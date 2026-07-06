export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    var body = req.body;
    if (!body.phone || !body.message) {
      return res.status(400).json({ error: 'phone and message required' });
    }

    var iid = process.env.ULTRAMSG_INSTANCE_ID;
    var tok = process.env.ULTRAMSG_TOKEN;

    if (!iid || !tok) {
      return res.json({ error: 'ULTRAMSG not configured. Set ULTRAMSG_INSTANCE_ID and ULTRAMSG_TOKEN in Vercel env.', sent: false });
    }

    var phoneClean = body.phone.replace(/[^0-9]/g, '');
    var resp = await fetch('https://api.ultramsg.com/' + iid + '/messages/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'token=' + tok + '&to=' + phoneClean + '&body=' + encodeURIComponent(body.message)
    });

    var data = await resp.json();
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message, sent: false });
  }
}
