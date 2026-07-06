export default async function handler(req, res) {
  try {
    const { phone, message, leadId } = req.body;
    if (!phone || !message) return res.status(400).json({ error: 'Phone and message required' });

    const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
    const token = process.env.ULTRAMSG_TOKEN;

    if (!instanceId || !token) {
      return res.status(400).json({ error: 'ULTRAMSG_INSTANCE_ID and ULTRAMSG_TOKEN required in .env' });
    }

    // UltraMsg API — sends from YOUR number (+91 81888 42829)
    const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: token,
        to: phone.replace(/[^0-9]/g, ''),
        body: message
      })
    });

    const data = await resp.json();

    // Log message
    if (data.sent === 'true' || data.status === 'success') {
      const { kv } = await import('@vercel/kv');
      if (leadId) {
        await kv.rpush('convo:' + leadId, JSON.stringify({
          who: 'agent', text: message, time: Date.now()
        }));
      }
      await kv.rpush('feed', JSON.stringify({
        type: 'msg', text: `WhatsApp sent to ${phone}`, time: Date.now()
      }));
    }

    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
