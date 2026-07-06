import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const { source, keyword, city } = req.query;
    const key = process.env.GOOGLE_MAPS_API_KEY;

    if (!key) {
      return res.json({ found: 0, new: 0, error: 'GOOGLE_MAPS_API_KEY not set in Vercel env vars' });
    }

    if (source === 'gmaps') {
      const kw = keyword || 'hotel';
      const ci = city || 'Riyadh';
      const query = kw + ' in ' + ci;

      const resp = await fetch(
        'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' +
        encodeURIComponent(query) + '&region=sa&language=en&key=' + key
      );
      const data = await resp.json();
      let added = 0;

      for (const place of (data.results || []).slice(0, 12)) {
        let phone = '';
        let website = '';
        let photos = [];
        let address = place.formatted_address || '';

        try {
          const dr = await fetch(
            'https://maps.googleapis.com/maps/api/place/details/json?place_id=' +
            place.place_id +
            '&fields=formatted_phone_number,website,rating,user_ratings_total,photos,formatted_address' +
            '&key=' + key
          );
          const dd = await dr.json();
          if (dd.result) {
            phone = dd.result.formatted_phone_number || '';
            website = dd.result.website || '';
            photos = (dd.result.photos || []).slice(0, 5).map(p => p.photo_reference);
            address = dd.result.formatted_address || address;
          }
        } catch (e) { /* skip details */ }

        if (!phone) continue;

        const id = 'gm_' + place.place_id;
        const existing = await kv.get('lead:' + id);
        if (existing) continue;

        const lead = {
          id: id,
          source: 'gmaps',
          name: place.name,
          owner: place.name,
          type: kw,
          city: ci,
          area: address,
          phone: phone,
          rating: place.rating || 0,
          reviews: place.user_ratings_total || 0,
          hasWebsite: !!website,
          website: website || null,
          photos: photos,
          placeId: place.place_id,
          stage: 0,
          lang: null,
          service: null,
          price: 0,
          followUps: 0,
          paidAt: null,
          createdAt: new Date().toISOString(),
          nextAction: new Date(Date.now() + 12000).toISOString()
        };

        await kv.set('lead:' + id, JSON.stringify(lead));
        const idx = await kv.get('lead_idx') || [];
        idx.push(id);
        await kv.set('lead_idx', idx);
        await kv.rpush('feed', JSON.stringify({
          type: 'scan',
          text: 'GMaps: ' + place.name + ' [' + ci + '] — ' + phone,
          time: Date.now()
        }));
        added++;
      }

      return res.json({ found: data.results?.length || 0, new: added });
    }

    if (source === 'fb') {
      // Facebook Ads Library requires auth token
      // Return info message, don't crash
      return res.json({
        found: 0,
        new: 0,
        note: 'FB Ads scanning requires access token. Use Google Maps for now — it finds more businesses without phone numbers too.'
      });
    }

    return res.json({ found: 0, new: 0, error: 'Source must be gmaps or fb' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
