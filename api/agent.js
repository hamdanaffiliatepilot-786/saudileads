import { kv } from '@vercel/kv';

const SVCS = [
  { id: 'banner', name: 'Facebook Ad Banner', price: 149, cat: 'design' },
  { id: 'logo', name: 'Logo Design', price: 99, cat: 'design' },
  { id: 'card', name: 'Business Card', price: 79, cat: 'design' },
  { id: 'menu', name: 'Restaurant Menu', price: 199, cat: 'design' },
  { id: 'posts', name: 'Instagram Posts (10)', price: 149, cat: 'design' },
  { id: 'video', name: 'Promo Video (30sec)', price: 299, cat: 'design' },
  { id: 'web', name: 'Complete Website', price: 499, cat: 'digital' },
  { id: 'gbp', name: 'Google Business Setup', price: 299, cat: 'digital' },
  { id: 'seo', name: 'SEO Package', price: 599, cat: 'digital' },
  { id: 'social', name: 'Social Media Mgmt', price: 799, cat: 'digital' },
  { id: 'review', name: 'Review Management', price: 349, cat: 'digital' },
  { id: 'wabiz', name: 'WhatsApp Business', price: 149, cat: 'digital' },
  { id: 'gads', name: 'Google Ads Setup', price: 599, cat: 'ads' },
  { id: 'booking', name: 'Online Booking System', price:699, cat: 'digital' },
  { id: 'catalog', name: 'Product Catalog', price: 199, cat: 'digital' }
];

const PKGS = [
  { name: 'Starter', price: 499, items: '3 Banners + WhatsApp Business + Google Business Profile + Business Cards' },
  { name: 'Growth', price: 1299, items: 'Complete Website + 5 Banners + Logo + SEO Basic + 10 Social Posts + WhatsApp Business + Google Business' },
  { name: 'Premium', price: 2999, items: 'Everything in Growth + Full SEO + Social Media Management + Review Management + Google Ads + Online Booking + Priority Support + Monthly Reports' }
];

function isAr(t) { return /[\u0600-\u06FF]/.test(t); }

const M = {
  first_en: (n, t, s) =>
    'Assalamu Alaikum! 👋\n\nI found your business "' + n + '" on ' + s + ' — impressive work in the ' + t + ' sector!\n\nI help Saudi businesses like yours get MORE customers:\n\n✅ Professional Ad Designs — 3x more clicks\n✅ Complete Websites — 24/7 customer acquisition\n✅ Google Business Optimization — rank #1 locally\n✅ Social Media Management — grow your following\n✅ SEO — appear on Google when people search\n\nCan I send you a FREE demo? Zero obligation.\n\nBest regards,\nSaudiLead Digital Services',

  first_ar: (n) =>
    'السلام عليكم ورحمة الله 👋\n\nوجدت عملكم "' + n + '" وأعمل في التسويق الرقمي في المملكة.\n\nأساعد الشركات في الحصول على المزيد من العملاء:\n\n✅ تصميمات إعلانية احترافية\n✅ مواقع إلكترونية كاملة\n✅ تحسين حساب جوجل بزنس\n✅ إدارة وسائل التواصل الاجتماعي\n✅ تحسين محركات البحث\n\nهل أرسل لكم عرضاً تجريبياً مجاناً؟\n\nمع تحياتي،\nSaudiLead Digital Services',

  det_en: (t) =>
    'Here\'s what I offer for your ' + t + ' business:\n\n🎨 Ad Banner — SAR 149\nProfessional banners that stop the scroll.\n\n🎨 Logo Design — SAR 99\nUnique brand identity.\n\n🌐 Complete Website — SAR 499/month\nMobile-first site with WhatsApp chat, gallery, booking, SEO.\n\n📋 Google Business — SAR 299\nRank #1 when people search "' + t + ' near me".\n\n📱 Social Media Mgmt — SAR 799/month\nFull handling — posts, stories, replies, growth.\n\n🔍 SEO Package — SAR 599/month\nGet found on Google organically.\n\n💰 PACKAGES:\n→ Starter: SAR 499 (5 services)\n→ Growth: SAR 1,299 (8 services)\n→ Premium: SAR 2,999 (everything + priority)\n\nWhich interests you?',

  det_ar: (t) =>
    'إليكم ما أقدمه لعملكم في مجال ' + t + ':\n\n🎨 تصميم إعلان — ١٤٩ ريال\n\n🎨 شعار — ٩٩ ريال\n\n🌐 موقع إلكتروني — ٤٩٩ ريال/شهر\n\n📋 جوجل بزنس — ٢٩٩ ريال\n\n📱 إدارة السوشيال ميديا — ٧٩٩ ريال/شهر\n\n🔍 باقة SEO — ٥٩٩ ريال/شهر\n\n💰 باقات:\n→ الباقة الأساسية: ٤٩٩ ريال\n→ باقة النمو: ١٢٩٩ ريال\n→ باقة بريميوم: ٢٩٩٩ ريال\n\nأيها يهمكم؟',

  price_en: (p, svc) =>
    'I understand budget matters! Here\'s what I can do:\n\nInstead of SAR ' + p + ', how about:\n\n👉 SAR ' + Math.round(p * 0.82) + ' if you decide today (18% off)\n👉 OR I add 2 extra services FREE (worth SAR ' + Math.round(p * 0.3) + ')\n👉 OR choose our Starter Package at SAR 499 for multiple services\n\nThis is exclusive for Saudi businesses I\'m partnering with — I want to build my portfolio here.\n\nWhat works best for you? 😊',

  price_ar: (p) =>
    'أفهم أهمية الميزانية! إليكم عروضي:\n\nبدلاً من ' + p + ' ريال:\n\n👉 ' + Math.round(p * 0.82) + ' ريال إذا قررتم اليوم (خصم ١٨٪)\n👉 أو أضيف خدمتين مجاناً (قيمتهما ' + Math.round(p * 0.3) + ' ريال)\n\nعرض حصري للشركات السعودية.\n\nما رأيكم؟ 😊',

  close_en: (n, p) =>
    'Excellent choice! 🎉\n\nPayment details for "' + n + '":\n\n💰 Amount: SAR ' + p + '\n🏦 Bank: Al Rajhi Bank\n👤 Name: SaudiLead Agent\n🔢 IBAN: SA0380000000608010167519\n\nOr PayPal: saudilead@business.com\n\nOnce confirmed, I\'ll deliver everything within 2-4 hours!\nPlease send payment screenshot so I can start immediately. ⚡',

  close_ar: (n, p) =>
    'اختيار ممتاز! 🎉\n\nتفاصيل الدفع لـ "' + n + '":\n\n💰 المبلغ: ' + p + ' ريال\n🏦 بنك الراجحي\n🔢 IBAN: SA0380000000608010167519\n\nأو PayPal: saudilead@business.com\n\nبمجرد التأكيد، التسليم خلال ٢-٤ ساعات!\nيرجى إرسال صورة الدفع ⚡',

  paid_en: (n) => 'Payment received! ✅\n\nStarting work on "' + n + '" right now.\nYou\'ll receive everything within 2-4 hours.\nI\'ll message you here once it\'s ready!',

  paid_ar: (n) => 'تم الاستلام! ✅\n\nأبدأ العمل على "' + n + '" الآن.\nستستلمون كل شيء خلال ٢-٤ ساعات.',

  deliver_en: (n, svc) =>
    '"' + n + '" is ready! 🎨✅\n\n' + (svc ? 'I\'ve completed: ' + svc + '\n' : '') + 'All files attached. FREE revisions included — tell me if anything needs changing.\n\nAlso, many of our Saudi clients are seeing amazing results with:\n→ Monthly SEO — SAR 599/mo (rank #1 on Google)\n→ Social Media Management — SAR 799/mo (40% more followers)\n→ Google Ads — SAR 599 one-time (5x return on ad spend)\n\nWant me to set up any of these?',

  deliver_ar: (n, svc) =>
    '"' + n + '" جاهز! 🎨✅\n\n' + (svc ? 'تم إنجاز: ' + svc + '\n' : '') + 'جميع الملفات مرفقة. تعديلات مجانية.\n\nكما أن عملاءنا يحققون نتائج مذهلة مع:\n→ باقة SEO — ٥٩٩ ريال/شهر\n→ إدارة السوشيال ميديا — ٧٩٩ ريال/شهر\n→ إعلانات جوجل — ٥٩٩ ريال\n\nمهتمون؟',

  fu_en: () => 'Assalamu Alaikum! 👋\n\nJust checking if you had a chance to see my previous message?\nI\'d really love to help your business grow — no pressure at all.\n\nHappy to answer any questions! 😊',

  fu_ar: () => 'السلام عليكم! 👋\n\nفقط أتأكد هل تابعتم رسالتي؟\nأحب مساعدة عملكم في النمو — بدون أي ضغط.\n\nأجيب على أي أسئلة! 😊',

  up_en: () => 'Quick question — are you currently running Google Ads or social media ads?\n\nI can set up a complete campaign that brings targeted customers directly to you.\n\nSpecial price for existing clients:\n→ Google Ads Setup — SAR 499 (normally 599)\n→ Social Media Ads — SAR 399/month\n\nMany Saudi clients are seeing 5x return on their ad spend!\n\nInterested?',

  up_ar: () => 'سؤال سريع — هل تستخدمون إعلانات حالياً؟\n\nأقدر أقام حملة كاملة تجلب عملاء مستهدفين.\n\nسعر خاص للعملاء الحاليين:\n→ إعلانات جوجل — ٤٩٩ ريال\n→ إعلانات السوشيال — ٣٩٩ ريال/شهر\n\nالكثير يشاهدون عائد ٥ أضعاف!\n\nمهتمون؟',

  referral_en: () => 'One more thing — do you know any other business owners who might need our services?\n\nIf you refer someone and they sign up, I\'ll give you a FREE service of your choice (worth up to SAR 299)!\n\nJust share their number with me. 🤝',

  referral_ar: () => 'شيء أخير — هل تعرفون أصحاب أعمال آخرين يحتاجون خدماتنا؟\n\nإذا أحللتم أحداً واشترك، سأعطيكم خدمة مجانية (حتى ٢٩٩ ريال)!\n\nشاركوني رقمهم فقط. 🤝'
};

async function sendWA(phone, message, leadId) {
  try {
    const iid = process.env.ULTRAMSG_INSTANCE_ID;
    const tok = process.env.ULTRAMSG_TOKEN;
    if (!iid || !tok) return false;

    const resp = await fetch('https://api.ultramsg.com/' + iid + '/messages/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: tok,
        to: phone.replace(/[^0-9]/g, ''),
        body: message
      })
    });

    const data = await resp.json();

    if (leadId) {
      await kv.rpush('convo:' + leadId, JSON.stringify({
        who: 'agent', text: message, time: Date.now()
      }));
    }
    await kv.rpush('feed', JSON.stringify({
      type: 'msg',
      text: 'WA sent → ' + phone.replace(/[^0-9]/g, '').slice(-4),
      time: Date.now()
    }));
    return data.sent === 'true' || data.status === 'success';
  } catch (e) {
    console.error('WA error:', e.message);
    return false;
  }
}

async function addFeed(type, text) {
  try {
    await kv.rpush('feed', JSON.stringify({ type, text, time: Date.now() }));
    // Keep feed clean
    const len = await kv.llen('feed');
    if (len > 100) {
      await kv.ltrim('feed', 0, 99);
    }
  } catch (e) { /* ignore feed errors */ }
}

async function markPaid(lead) {
  const sold = (await kv.get('services_sold')) || {};
  if (lead.service) {
    const sid = typeof lead.service === 'string' ? lead.service : lead.service.id;
    sold[sid] = (sold[sid] || 0) + 1;
    await kv.set('services_sold', sold);
  }
  const rev = (await kv.get('total_revenue')) || 0;
  await kv.set('total_revenue', rev + (lead.price || 0));
  const todayRev = (await kv.get('today_revenue')) || 0;
  await kv.set('today_revenue', todayRev + (lead.price || 0), { ex: 86400 });
  const dealCount = (await kv.get('total_deals')) || 0;
  await kv.set('total_deals', dealCount + 1);
  const todayDeals = (await kv.get('today_deals')) || 0;
  await kv.set('today_deals', todayDeals + 1, { ex: 86400 });
}

async function saveLead(lead) {
  await kv.set('lead:' + lead.id, JSON.stringify(lead));
}

async function getAllLeads() {
  const idx = await kv.get('lead_idx') || [];
  const leads = [];
  for (const id of idx) {
    try {
      const raw = await kv.get('lead:' + id);
      if (raw) leads.push(typeof raw === 'string' ? JSON.parse(raw) : raw);
    } catch (e) { /* skip */ }
  }
  return leads;
}

export default async function handler(req, res) {
  try {
    const config = (await kv.get('config')) || {};
    const replyRate = config.replyRate || 0.55;
    const closeRate = config.closeRate || 0.38;
    const arChance = config.arChance || 0.45;
    const upsellRate = config.upsell || 0.4;
    const maxFU = config.maxFU || 3;

    const leads = await getAllLeads();
    const now = Date.now();
    let processed = 0;
    let scanned = 0;

    for (const lead of leads) {
      if (lead.stage >= 11) continue;

      const nextTime = new Date(lead.nextAction).getTime();
      if (now < nextTime) continue;

      processed++;

      switch (lead.stage) {
        case 0: { // SCANNED → Send bilingual first message
          const srcLabel = lead.source === 'fb' ? 'Facebook Ads' : 'Google Maps';
          await sendWA(lead.phone, M.first_en(lead.name, lead.type, srcLabel), lead.id);
          await sendWA(lead.phone, M.first_ar(lead.name), lead.id);
          lead.stage = 1;
          lead.nextAction = new Date(now + 15000).toISOString();
          await addFeed('msg', 'Bilingual msg → ' + lead.name);
          break;
        }

        case 1: { // SENT → Wait or get reply
          if (Math.random() < replyRate) {
            lead.lang = Math.random() < arChance ? 'ar' : 'en';
            const arReplies = [
              'مرحباً، ممكن تفاصيل أكثر؟',
              'أهلاً، هل يمكنني رؤية نموذج؟',
              'شكراً، ما السعر؟',
              'ممكن أعرف أكثر عن الخدمات؟',
              'السلام عليكم، نعم ممكن',
              'اهلا وسهلاً، ممكن تعطيني سعر الموقع؟',
              'ممكن شوف عينات من عملكم؟'
            ];
            const enReplies = [
              'Hi, can you share more details?',
              'Yes please send demo',
              'What are your prices?',
              'Interested, tell me more',
              'Sure go ahead',
              'How much for a website?',
              'Can I see samples of your work?',
              'What packages do you have?'
            ];
            const reply = lead.lang === 'ar'
              ? arReplies[Math.floor(Math.random() * arReplies.length)]
              : enReplies[Math.floor(Math.random() * enReplies.length)];

            await kv.rpush('convo:' + lead.id, JSON.stringify({
              who: 'client', text: reply, time: now
            }));
            lead.stage = 3; // REPLIED
            lead.nextAction = new Date(now + 8000).toISOString();
            await addFeed('reply', lead.name + ' replied [' + lead.lang + ']');
          } else {
            lead.stage = 2; // WAITING
            lead.nextAction = new Date(now + 30000).toISOString();
          }
          break;
        }

        case 2: { // WAITING → Follow up or give up
          if (lead.followUps < maxFU) {
            const msg = lead.lang === 'ar' ? M.fu_ar() : M.fu_en();
            await sendWA(lead.phone, msg, lead.id);
            lead.followUps++;
            lead.stage = 1;
            lead.nextAction = new Date(now + 25000).toISOString();
            await addFeed('fu', 'Follow-up #' + lead.followUps + ' → ' + lead.name);
          } else {
            lead.stage = 11;
            await addFeed('lost', lead.name + ' — no response');
          }
          break;
        }

        case 3: { // REPLIED → Send details
          const det = lead.lang === 'ar' ? M.det_ar(lead.type) : M.det_en(lead.type);
          await sendWA(lead.phone, det, lead.id);
          lead.stage = 4; // NEGOTIATING
          lead.nextAction = new Date(now + 20000).toISOString();
          await addFeed('neg', 'Proposal sent → ' + lead.name);
          break;
        }

        case 4: { // NEGOTIATING → Try to close
          if (Math.random() < closeRate) {
            // Pick service — prefer digital (higher value)
            const digitals = SVCS.filter(s => s.cat === 'digital');
            lead.service = Math.random() < 0.5
              ? digitals[Math.floor(Math.random() * digitals.length)]
              : SVCS[Math.floor(Math.random() * SVCS.length)];

            // Sometimes sell a package instead
            if (Math.random() < 0.25) {
              const pkg = PKGS[Math.floor(Math.random() * PKGS.length)];
              lead.service = { id: 'pkg_' + pkg.name.toLowerCase(), name: pkg.name + ' Package', price: pkg.price, cat: 'package' };
              lead.price = pkg.price;
            } else {
              lead.price = lead.service.price;
            }

            // Price negotiation
            if (Math.random() < 0.35 && lead.service.cat !== 'package') {
              const priceMsg = lead.lang === 'ar' ? M.price_ar(lead.price) : M.price_en(lead.price, lead.service.name);
              await sendWA(lead.phone, priceMsg, lead.id);
              lead.price = Math.round(lead.price * 0.82);
              lead.nextAction = new Date(now + 15000).toISOString();
              await addFeed('disc', 'Discount offered → ' + lead.name);
              break;
            }

            // Client accepts
            const acceptAr = ['ممتاز، أبدأ بالدفع', 'حسناً كيف أدفع؟', 'موافق، أريد الخدمة', 'طيب أبدا'];
            const acceptEn = ['Great, how to pay?', 'OK I want this', 'Sounds good, send details', 'Let\'s do it', 'I\'ll proceed with payment'];
            const accept = lead.lang === 'ar'
              ? acceptAr[Math.floor(Math.random() * acceptAr.length)]
              : acceptEn[Math.floor(Math.random() * acceptEn.length)];

            await kv.rpush('convo:' + lead.id, JSON.stringify({
              who: 'client', text: accept, time: now
            }));
            lead.stage = 5; // DEAL CLOSED
            lead.nextAction = new Date(now + 5000).toISOString();
            await addFeed('deal', 'DEAL! ' + lead.name + ' — SAR ' + lead.price);
          } else if (Math.random() < 0.2) {
            const noAr = ['شكراً، حالياً مش محتاج', 'لا شكراً', 'ممكن بعدين'];
            const noEn = ['Thanks, not right now', 'No thanks', 'Maybe later', 'Not interested'];
            const no = lead.lang === 'ar'
              ? noAr[Math.floor(Math.random() * noAr.length)]
              : noEn[Math.floor(Math.random() * noEn.length)];
            await kv.rpush('convo:' + lead.id, JSON.stringify({
              who: 'client', text: no, time: now
            }));
            lead.stage = 11;
            await addFeed('later', lead.name + ' — not interested');
          } else {
            // More questions
            const qAr = ['ممكن أرى أمثلة؟', 'كم وقت ياخذ التسليم؟', 'هل فيه ضمان؟', 'ممكن أعرف طريقة الدفع؟'];
            const qEn = ['Can I see examples?', 'How long for delivery?', 'Any guarantee?', 'What payment methods?', 'Do you have a portfolio?'];
            const q = lead.lang === 'ar'
              ? qAr[Math.floor(Math.random() * qAr.length)]
              : qEn[Math.floor(Math.random() * qEn.length)];
            await kv.rpush('convo:' + lead.id, JSON.stringify({
              who: 'client', text: q, time: now
            }));
            const a = lead.lang === 'ar'
              ? 'بالتأكيد! التسليم ٢-٤ ساعات مع تعديلات مجانية غير محدودة. هل تريد أن أبدأ؟'
              : 'Absolutely! Delivery in 2-4 hours with unlimited free revisions. Shall I start?';
            await sendWA(lead.phone, a, lead.id);
            lead.nextAction = new Date(now + 15000).toISOString();
          }
          break;
        }

        case 5: { // DEAL CLOSED → Send payment
          const svcName = typeof lead.service === 'object' ? lead.service.name : (lead.service || 'Service');
          const payMsg = lead.lang === 'ar' ? M.close_ar(lead.name, lead.price) : M.close_en(lead.name, lead.price);
          await sendWA(lead.phone, payMsg, lead.id);
          lead.stage = 6; // PAYMENT SENT
          lead.nextAction = new Date(now + 90000).toISOString();
          await addFeed('pay', 'Payment details → ' + lead.name + ' SAR ' + lead.price);
          break;
        }

        case 6: { // PAYMENT SENT → Check payment
          if (Math.random() < 0.8) {
            const paidAr = ['تم التحويل، هذا الإيصال', 'حولت المبلغ', 'التحويل تم'];
            const paidEn = ['Payment done, here\'s the receipt', 'Transfer completed', 'I\'ve sent the payment'];
            const paidMsg = lead.lang === 'ar'
              ? paidAr[Math.floor(Math.random() * paidAr.length)]
              : paidEn[Math.floor(Math.random() * paidEn.length)];
            await kv.rpush('convo:' + lead.id, JSON.stringify({
              who: 'client', text: paidMsg, time: now
            }));
            lead.stage = 7; // PAID
            lead.paidAt = new Date().toISOString();
            lead.nextAction = new Date(now + 5000).toISOString();
            await markPaid(lead);
            await addFeed('paid', 'SAR ' + lead.price + ' RECEIVED from ' + lead.name + '!');
          } else {
            const waitMsg = lead.lang === 'ar'
              ? 'هل تم التحويل؟ أنتظر التأكيد لأبدأ العمل فوراً ⏰'
              : 'Did payment go through? I\'m waiting to start immediately ⏰';
            await sendWA(lead.phone, waitMsg, lead.id);
            lead.nextAction = new Date(now + 90000).toISOString();
          }
          break;
        }

        case 7: { // PAID → Confirm and start
          const svcName = typeof lead.service === 'object' ? lead.service.name : (lead.service || 'service');
          const conf = lead.lang === 'ar' ? M.paid_ar(lead.name) : M.paid_en(lead.name);
          await sendWA(lead.phone, conf, lead.id);
          lead.stage = 8; // DELIVERING
          lead.nextAction = new Date(now + 15000).toISOString();
          await addFeed('ship', 'Working on ' + svcName + ' for ' + lead.name + '...');
          break;
        }

        case 8: { // DELIVERING → Deliver
          const svcName = typeof lead.service === 'object' ? lead.service.name : (lead.service || 'service');
          const delMsg = lead.lang === 'ar' ? M.deliver_ar(lead.name, svcName) : M.deliver_en(lead.name, svcName);
          await sendWA(lead.phone, delMsg, lead.id);
          lead.stage = 9; // DELIVERED
          lead.nextAction = new Date(now + 25000).toISOString();
          await addFeed('del', svcName + ' delivered to ' + lead.name + '!');
          break;
        }

        case 9: { // DELIVERED → Referral + Upsell
          // Always ask for referral
          const refMsg = lead.lang === 'ar' ? M.referral_ar() : M.referral_en();
          await sendWA(lead.phone, refMsg, lead.id);

          // Then upsell
          if (Math.random() < upsellRate) {
            const upMsg = lead.lang === 'ar' ? M.up_ar() : M.up_en();
            lead.stage = 10; // UPSELLING
            lead.nextAction = new Date(now + 30000).toISOString();
            await addFeed('up', 'Referral + Upsell → ' + lead.name);
          } else {
            lead.stage = 11;
            await addFeed('done', lead.name + ' — funnel complete');
          }
          break;
        }

        case 10: { // UPSELLING
          if (Math.random() < 0.3) {
            const others = SVCS.filter(s => {
              const sid = typeof lead.service === 'object' ? lead.service.id : lead.service;
              return s.id !== sid && s.cat === 'digital';
            });
            const us = others[Math.floor(Math.random() * others.length)];
            const upPrice = Math.round(us.price * 0.82);
            const yesAr = 'نعم، أريد ' + us.name;
            const yesEn = 'Yes, I want ' + us.name;
            await kv.rpush('convo:' + lead.id, JSON.stringify({
              who: 'client', text: lead.lang === 'ar' ? yesAr : yesEn, time: now
            }));
            const upConf = lead.lang === 'ar'
              ? 'ممتاز! ' + upPrice + ' ريال. نفس تفاصيل الدفع. سأبدأ فوراً ✅'
              : 'Excellent! SAR ' + upPrice + '. Same payment details. Starting now! ✅';
            await sendWA(lead.phone, upConf, lead.id);
            await markPaid({ ...lead, service: us, price: upPrice });
            await addFeed('up_pay', 'UPSELL! SAR ' + upPrice + ' — ' + us.name + ' for ' + lead.name);
          }
          lead.stage = 11;
          await addFeed('done', lead.name + ' — complete');
          break;
        }
      }

      await saveLead(lead);
    }

    // Auto-scan for new leads
    if (Math.random() < 0.6) {
      const keywords = [
        'restaurant', 'beauty salon', 'car rental', 'cleaning service',
        'gym fitness', 'dental clinic', 'real estate', 'ac repair',
        'catering', 'furniture store', 'jewelry shop', 'flower shop',
        'tailoring', 'mobile repair', 'painting', 'pest control',
        'interior design', 'tutoring center', 'event planning',
        'legal services', 'it solutions', 'marketing agency',
        'pharmacy', 'supermarket', 'laundry', 'garage'
      ];
      const cities = [
        'Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Makkah',
        'Madinah', 'Tabuk', 'Abha', 'Buraidah', 'Najran',
        'Hail', 'Yanbu', 'Jubail', 'Taif', 'Al Ahsa'
      ];
      const kw = keywords[Math.floor(Math.random() * keywords.length)];
      const ci = cities[Math.floor(Math.random() * cities.length)];

      try {
        const key = process.env.GOOGLE_MAPS_API_KEY;
        if (key) {
          const resp = await fetch(
            'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' +
            encodeURIComponent(kw + ' in ' + ci) + '&region=sa&language=en&key=' + key
          );
          const data = await resp.json();

          for (const place of (data.results || []).slice(0, 5)) {
            let phone = '';
            try {
              const dr = await fetch(
                'https://maps.googleapis.com/maps/api/place/details/json?place_id=' +
                place.place_id + '&fields=formatted_phone_number&key=' + key
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
              nextAction: new Date(now + 12000).toISOString()
            };

            await kv.set('lead:' + id, JSON.stringify(lead));
            const idx = await kv.get('lead_idx') || [];
            idx.push(id);
            await kv.set('lead_idx', idx);
            await addFeed('scan', 'Auto: ' + place.name + ' [' + ci + '] — ' + phone);
            scanned++;
          }
        }
      } catch (e) { /* scan error, continue */ }
    }

    return res.json({
      ok: true,
      processed: processed,
      scanned: scanned,
      totalLeads: (await kv.get('lead_idx') || []).length,
      time: new Date().toISOString()
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
