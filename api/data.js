import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    var action = req.query.action;
    if (!action) return res.status(400).json({ error: 'action required' });

    if (action === 'stats') {
      var idx = await kv.get('lead_idx');
      if (!idx) idx = [];
      var leads = [];
      for (var i = 0; i < idx.length; i++) {
        try {
          var raw = await kv.get('lead:' + idx[i]);
          if (raw) leads.push(JSON.parse(raw));
        } catch (e) {}
      }
      var paid = leads.filter(function(l) { return l.stage >= 7; });
      var today = new Date().toDateString();
      var todayPaid = paid.filter(function(l) { return l.paidAt && new Date(l.paidAt).toDateString() === today; });
      var todayLeads = leads.filter(function(l) { return l.createdAt && new Date(l.createdAt).toDateString() === today; });
      var activeChats = leads.filter(function(l) { return l.stage >= 1 && l.stage < 11; });
      var sold = await kv.get('services_sold');
      if (!sold) sold = {};
      var totalRev = await kv.get('total_revenue') || 0;
      var todayRev = await kv.get('today_revenue') || 0;
      var totalDeals = await kv.get('total_deals') || 0;
      var todayDeals = await kv.get('today_deals') || 0;
      return res.json({
        totalRevenue: totalRev,
        todayRevenue: todayRev,
        totalLeads: leads.length,
        todayLeads: todayLeads.length,
        totalDeals: totalDeals,
        todayDeals: todayDeals,
        activeChats: activeChats.length,
        servicesSold: sold
      });
    }

    if (action === 'leads') {
      var idx2 = await kv.get('lead_idx');
      if (!idx2) idx2 = [];
      var leads2 = [];
      for (var j = 0; j < idx2.length; j++) {
        try {
          var raw2 = await kv.get('lead:' + idx2[j]);
          if (raw2) leads2.push(JSON.parse(raw2));
        } catch (e) {}
      }
      return res.json(leads2);
    }

    if (action === 'feed') {
      var rawFeed = await kv.lrange('feed', 0, 99);
      if (!rawFeed) return res.json([]);
      var result = [];
      for (var k = 0; k < rawFeed.length; k++) {
        try { result.push(JSON.parse(rawFeed[k])); } catch (e) {}
      }
      return res.json(result);
    }

    if (action === 'convo') {
      var lid = req.query.leadId;
      if (!lid) return res.json([]);
      var rawConv = await kv.lrange('convo:' + lid, 0, 99);
      if (!rawConv) return res.json([]);
      var conv = [];
      for (var m = 0; m < rawConv.length; m++) {
        try { conv.push(JSON.parse(rawConv[m])); } catch (e) {}
      }
      return res.json(conv);
    }

    if (action === 'config') {
      var cfg = await kv.get('config');
      return res.json(cfg || {});
    }

    if (action === 'setconfig' && req.method === 'POST') {
      await kv.set('config', req.body);
      return res.json({ ok: true });
    }

    if (action === 'manualscan') {
      var keyword = req.query.keyword || 'restaurant';
      var city = req.query.city || 'Riyadh';
      var key = process.env.GOOGLE_MAPS_API_KEY;
      if (!key) return res.json({ error: 'GOOGLE_MAPS_API_KEY not set in Vercel env vars', found: 0, new: 0 });

      var resp = await fetch(
        'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' +
        encodeURIComponent(keyword + ' in ' + city) + '&region=sa&language=en&key=' + key
      );
      var data = await resp.json();
      var added = 0;

      if (data.results) {
        for (var p = 0; p < Math.min(data.results.length, 8); p++) {
          var place = data.results[p];
          if (!place.place_id) continue;
          var phone = '';
          try {
            var dr = await fetch(
              'https://maps.googleapis.com/maps/api/place/details/json?place_id=' +
              place.place_id + '&fields=formatted_phone_number&key=' + key
            );
            var dd = await dr.json();
            if (dd.result && dd.result.formatted_phone_number) {
              phone = dd.result.formatted_phone_number;
            }
          } catch (e) {}
          if (!phone) continue;

          var id = 'gm_' + place.place_id;
          var exists = await kv.get('lead:' + id);
          if (exists) continue;

          var lead = {
            id: id,
            source: 'gmaps',
            name: place.name,
            owner: place.name,
            type: keyword,
            city: city,
            area: place.formatted_address || '',
            phone: phone,
            rating: place.rating || 0,
            reviews: place.user_ratings_total || 0,
            hasWebsite: false,
            photos: [],
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
          var idx3 = await kv.get('lead_idx');
          if (!idx3) idx3 = [];
          idx3.push(id);
          await kv.set('lead_idx', idx3);
          await kv.rpush('feed', JSON.stringify({
            type: 'scan',
            text: 'GMaps: ' + place.name + ' [' + city + '] — ' + phone,
            time: Date.now()
          }));
          added++;
        }
      }

      return res.json({ found: data.results ? data.results.length : 0, new: added });
    }

    return res.status(400).json({ error: 'Unknown action: ' + action });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
