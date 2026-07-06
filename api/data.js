import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const { action } = req.query;

    if (action === 'stats') {
      const idx = await kv.get('lead_idx') || [];
      const leads = [];
      for (const id of idx) {
        try {
          const raw = await kv.get('lead:' + id);
          if (raw) leads.push(typeof raw === 'string' ? JSON.parse(raw) : raw);
        } catch (e) { /* skip bad data */ }
      }
      const paid = leads.filter(l => l.stage >= 7);
      const today = new Date().toDateString();
      const todayPaid = paid.filter(l => l.paidAt && new Date(l.paidAt).toDateString() === today);
      const todayLeads = leads.filter(l => l.createdAt && new Date(l.createdAt).toDateString() === today);
      const activeChats = leads.filter(l => l.stage >= 1 && l.stage < 11);
      const sold = (await kv.get('services_sold')) || {};
      return res.json({
        totalRevenue: paid.reduce((s, l) => s + (l.price || 0), 0),
        todayRevenue: todayPaid.reduce((s, l) => s + (l.price || 0), 0),
        totalLeads: leads.length,
        todayLeads: todayLeads.length,
        totalDeals: paid.length,
        todayDeals: todayPaid.length,
        activeChats: activeChats.length,
        servicesSold: sold
      });
    }

    if (action === 'leads') {
      const idx = await kv.get('lead_idx') || [];
      const leads = [];
      for (const id of idx) {
        try {
          const raw = await kv.get('lead:' + id);
          if (raw) leads.push(typeof raw === 'string' ? JSON.parse(raw) : raw);
        } catch (e) { /* skip */ }
      }
      return res.json(leads);
    }

    if (action === 'feed') {
      const raw = await kv.lrange('feed', 0, -1) || [];
      return res.json(raw.map(f => typeof f === 'string' ? JSON.parse(f) : f));
    }

    if (action === 'convo') {
      const { leadId } = req.query;
      if (!leadId) return res.json([]);
      const raw = await kv.lrange('convo:' + leadId, 0, -1) || [];
      return res.json(raw.map(m => typeof m === 'string' ? JSON.parse(m) : m));
    }

    if (action === 'config') {
      const cfg = await kv.get('config');
      return res.json(cfg || { replyRate: 0.55, closeRate: 0.38, arChance: 0.45, upsell: 0.4, maxFU: 3, autoScan: true });
    }

    if (action === 'setconfig' && req.method === 'POST') {
      await kv.set('config', req.body);
      return res.json({ ok: true });
    }

    if (action === 'manualscan') {
      const { keyword, city } = req.query;
      const kw = keyword || 'restaurant';
      const ci = city || 'Riyadh';
      const key = process.env.GOOGLE_MAPS_API_KEY;
      if (!key) return res.json({ error: 'GOOGLE_MAPS_API_KEY not set', found: 0, new: 0 });

      const resp = await fetch(
        'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' +
        encodeURIComponent(kw + ' in ' + ci) + '&region=sa&language=en&key=' + key
      );
      const data = await resp.json();
      let added = 0;

      for (const place of (data.results || []).slice(0, 10)) {
        let phone = '';
        try {
          const dr = await fetch(
            'https://maps.googleapis.com/maps/api/place/details/json?place_id=' +
            place.place_id + '&fields=formatted_phone_number,website,rating,user_ratings_total,photos,formatted_address&key=' + key
          );
          const dd = await dr.json();
          if (dd.result) phone = dd.result.formatted_phone_number || '';
        } catch (e) { /* skip */ }

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
          area: place.formatted_address || '',
          phone: phone,
          rating: place.rating || 0,
          reviews: place.user_ratings_total || 0,
          hasWebsite: !!place.website,
          photos: (place.photos || []).slice(0, 3).map(p => p.photo_reference),
          placeId: place.place_id,
          stage: 0,
          lang: null,
          service: null,
          price: 0,
          followUps: 0,
          paidAt: null,
          createdAt: new Date().toISOString(),
          nextAction: new Date(Date.now() + 10000).toISOString()
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

      const sc = (await kv.get('scan_today')) || 0;
      await kv.set('scan_today', sc + added, { ex: 86400 });

      return res.json({ found: data.results?.length || 0, new: added });
    }

    return res.status(400).json({ error: 'Unknown action: ' + action });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
