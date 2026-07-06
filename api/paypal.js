export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // PayPal webhook — PayPal calls this when payment received
      const body = req.body;

      // Verify webhook (production)
      // In production, verify with PayPal API:
      // const verify = await fetch(`https://api-m.paypal.com/v1/notifications/verify-webhook-signature`, { ... })

      if (body.event_type === 'CHECKOUT.ORDER.APPROVED' || body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const { kv } = await import('@vercel/kv');
        const amount = body.resource?.amount?.value || body.resource?.purchase_units?.[0]?.amount?.value;
        const email = body.resource?.payer?.email_address || '';

        await kv.rpush('feed', JSON.stringify({
          type: 'paid',
          text: `PayPal payment: SAR ${amount} from ${email}`,
          time: Date.now()
        }));

        // Find matching lead by amount and mark as paid
        // The agent engine will pick it up on next run
        return res.json({ ok: true, captured: true });
      }

      return res.json({ received: true });
    }

    return res.status(405).json({ error: 'POST only' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
