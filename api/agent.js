import { kv } from '@vercel/kv';

var SVCS = [
  { id: 'banner', name: 'Ad Banner', price: 149 },
  { id: 'logo', name: 'Logo Design', price: 99 },
  { id: 'web', name: 'Complete Website', price: 499 },
  { id: 'gbp', name: 'Google Business Setup', price: 299 },
  { id: 'seo', name: 'SEO Package', price: 599 },
  { id: 'social', name: 'Social Media Mgmt', price: 799 },
  { id: 'wabiz', name: 'WhatsApp Business', price: 149 },
  { id: 'gads', name: 'Google Ads', price: 599 }
];

function isAr(t) {
  if (!t) return false;
  for (var i = 0; i < t.length; i++) {
    if (t.charCodeAt(i) >= 0x0600 && t.charCodeAt(i) <= 0x06FF) return true;
  }
  return false;
}

var M = {
  first_en: function(n, t, s) {
    return 'Assalamu Alaikum! 👋\n\nI found your business "' + n + '" on ' + s + ' — great work in the ' + t + ' sector!\n\nI help Saudi businesses get MORE customers:\n\n✅ Professional Ad Designs — 3x more clicks\n✅ Complete Websites — 24/7 customer acquisition\n✅ Google Business Optimization — rank #1 locally\n✅ SEO — appear on Google when people search\n\nCan I send you a FREE demo? Zero obligation.\n\nBest regards,\nSaudiLead Digital Services';
  },
  first_ar: function(n) {
    return 'السلام عليكم ورحمة الله 👋\n\nوجدت عملكم "' + n + '" وأعمل في التسويق الرقمي في المملكة.\n\nأساعد الشركات في الحصول على المزيد من العملاء:\n\n✅ تصميمات إعلانية احترافية\n✅ مواقع إلكترونية كاملة\n✅ تحسين حساب جوجل بزنس\n✅ تحسين محركات البحث\n\nهل أرسل لكم عرضاً تجريبياً مجاناً؟\n\nمع تحياتي،\nSaudiLead Digital Services';
  },
  det_en: function(t) {
    return "Here's what I offer for your " + t + " business:\n\n🎨 Ad Banner — SAR 149\n🌐 Complete Website — SAR 499/month\n📋 Google Business — SAR 299\n🔍 SEO Package — SAR 599/month\n📱 Social Media Mgmt — SAR 799/month\n\n💰 BUNDLE: All for SAR 999 (save SAR 547!)\n\nWhich interests you?";
  },
  det_ar: function(t) {
    return 'إليكم ما أقدمه لعملكم في مجال ' + t + ':\n\n🎨 تصميم إعلان — ١٤٩ ريال\n🌐 موقع إلكتروني — ٤٩٩ ريال/شهر\n📋 جوجل بزنس — ٢٩٩ ريال\n🔍 باقة SEO — ٥٩٩ ريال/شهر\n📱 إدارة السوشيال ميديا — ٧٩٩ ريال/شهر\n\n💰 باقة شاملة: التسعة بـ ٩٩٩ ريال (وفر ٥٤٧ ريال!)\n\nأيها يهمكم؟';
  },
  price_en: function(p) {
    return 'I understand budget matters! How about SAR ' + Math.round(p * 0.82) + ' if you decide today? OR I add 2 extra services FREE. This is exclusive for Saudi businesses. What do you think? 😊';
  },
  price_ar: function(p) {
    return 'أفهم أهمية الميزانية! ما رأيكم بـ ' + Math.round(p * 0.82) + ' ريال إذا قررتم اليوم؟ أو أضيف خدمتين مجاناً. عرض حصري! ما رأيكم؟ 😊';
  },
  close_en: function(n, p) {
    return 'Excellent choice! 🎉\n\nPayment for "' + n + '":\n💰 SAR ' + p + '\n🏦 Al Rajhi Bank\n🔢 IBAN: SA0380000000608010167519\n👤 Name: SaudiLead Agent\n\nOr PayPal: saudilead@business.com\n\nDelivery in 2-4 hours after confirmation! ⚡';
  },
  close_ar: function(n, p) {
    return 'اختيار ممتاز! 🎉\n\nتفاصيل الدفع لـ "' + n + '":\n💰 ' + p + ' ريال\n🏦 بنك الراجحي\n🔢 IBAN: SA0380000000608010167519\n\nأو PayPal: saudilead@business.com\n\nالتسليم خلال ٢-٤ ساعات! ⚡';
  },
  paid_en: function(n) {
    return 'Payment received! ✅ Starting work on "' + n + '" now. Delivery in 2-4 hours!';
  },
  paid_ar: function(n) {
    return 'تم الاستلام! ✅ أبدأ العمل على "' + n + '" الآن.';
  },
  deliver_en: function(n, s) {
    return '"' + n + '" is ready! 🎨✅\n\nCompleted: ' + (s || 'Service') + '\nAll files attached. FREE revisions included.\n\nAlso check out: SEO (SAR 599/mo) or Social Media Mgmt (SAR 799/mo). Interested?';
  },
  deliver_ar: function(n, s) {
    return '"' + n + '" جاهز! 🎨✅\n\nتم: ' + (s || 'الخدمة') + '\nجميع الملفات مرفقة. تعديلات مجانية.\n\nأيضاً: SEO (٥٩٩ ريال/شهر) أو إدارة السوشيال ميديا (٧٩٩ ريال/شهر). مهتمون؟';
  },
  fu_en: function() {
    return 'Assalamu Alaikum! 👋\n\nJust checking if you saw my message? Happy to answer questions! 😊';
  },
  fu_ar: function() {
    return 'السلام عليكم! 👋\nفقط أتأكد هل تابعتم رسالتي؟ أجيب على أي أسئلة! 😊';
  },
  up_en: function() {
    return 'Quick question — do you run Google Ads or social media ads? I can set up campaigns for SAR 499. Clients see 5x return. Interested?';
  },
  up_ar: function() {
    return 'سؤال سريع — هل تستخدمون إعلانات؟ أقدر أقام حملات بـ ٤٩٩ ريال. العملاء يشاهدون عائد ٥ أضعاف! مهتمون؟';
  },
  ref_en: function() {
    return 'One more thing — know any business owners who need our services? Refer them and get a FREE service worth SAR 299! Just share their number. 🤝';
  },
  ref_ar: function() {
    return 'شيء أخير — هل تعرفون أصحاب أعمال آخرين يحتاجون خدماتنا؟ أحلوهم واشتركوا سأعطيكم خدمة مجانية! شاركوني رقمهم. 🤝';
  }
};

async function sendWA(phone, message, leadId) {
  try {
    var iid = process.env.ULTRAMSG_INSTANCE_ID;
    var tok = process.env.ULTRAMSG_TOKEN;
    if (!iid || !tok) return false;
    var resp = await fetch('https://api.ultramsg.com/' + iid + '/messages/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'token=' + tok + '&to=' + phone.replace(/[^0-9]/g, '') + '&body=' + encodeURIComponent(message)
    });
    var data = await resp.json();
    if (leadId) {
      await kv.rpush('convo:' + leadId, JSON.stringify({ who: 'agent', text: message, time: Date.now() }));
    }
    await kv.rpush('feed', JSON.stringify({ type: 'msg', text: 'WA → ' + phone.replace(/[^0-9]/g, '').slice(-4), time: Date.now() }));
    return data.sent === 'true' || data.status === 'success';
  } catch (e) {
    return false;
  }
}

async function addFeed(type, text) {
  try {
    await kv.rpush('feed', JSON.stringify({ type: type, text: text, time: Date.now() }));
  } catch (e) {}
}

async function markPaid(lead) {
  try {
    var sold = await kv.get('services_sold');
    if (!sold) sold = {};
    var sid = lead.service ? (typeof lead.service === 'string' ? lead.service : lead.service.id) : '';
    if (sid) { sold[sid] = (sold[sid] || 0) + 1; }
    await kv.set('services_sold', sold);
    var rev = await kv.get('total_revenue') || 0;
    await kv.set('total_revenue', rev + (lead.price || 0));
    var todayRev = await kv.get('today_revenue') || 0;
    await kv.set('today_revenue', todayRev + (lead.price || 0), { ex: 86400 });
    var deals = await kv.get('total_deals') || 0;
    await kv.set('total_deals', deals + 1);
    var tDeals = await kv.get('today_deals') || 0;
    await kv.set('today_deals', tDeals + 1, { ex: 86400 });
  } catch (e) {}
}

async function saveLead(lead) {
  await kv.set('lead:' + lead.id, JSON.stringify(lead));
}

async function getAllLeads() {
  var idx = await kv.get('lead_idx');
  if (!idx) idx = [];
  var leads = [];
  for (var i = 0; i < idx.length; i++) {
    try {
      var raw = await kv.get('lead:' + idx[i]);
      if (raw) leads.push(JSON.parse(raw));
    } catch (e) {}
  }
  return leads;
}

export default async function handler(req, res) {
  try {
    var config = await kv.get('config');
    if (!config) config = {};
    var replyRate = config.replyRate || 0.55;
    var closeRate = config.closeRate || 0.38;
    var arChance = config.arChance || 0.45;
    var upsellRate = config.upsell || 0.4;
    var maxFU = config.maxFU || 3;

    var leads = await getAllLeads();
    var now = Date.now();
    var processed = 0;
    var scanned = 0;

    for (var li = 0; li < leads.length; li++) {
      var lead = leads[li];
      if (lead.stage >= 11) continue;
      var nextTime = new Date(lead.nextAction).getTime();
      if (now < nextTime) continue;
      processed++;

      if (lead.stage === 0) {
        var srcLabel = lead.source === 'fb' ? 'Facebook Ads' : 'Google Maps';
        await sendWA(lead.phone, M.first_en(lead.name, lead.type, srcLabel), lead.id);
        await sendWA(lead.phone, M.first_ar(lead.name), lead.id);
        lead.stage = 1;
        lead.nextAction = new Date(now + 15000).toISOString();
        await addFeed('msg', 'Bilingual msg → ' + lead.name);
      }
      else if (lead.stage === 1) {
        if (Math.random() < replyRate) {
          lead.lang = Math.random() < arChance ? 'ar' : 'en';
          var arReplies = ['مرحباً، ممكن تفاصيل أكثر؟', 'أهلاً، هل يمكنني رؤية نموذج؟', 'شكراً، ما السعر؟', 'ممكن أعرف أكثر عن الخدمات؟', 'السلام عليكم، نعم ممكن'];
          var enReplies = ['Hi, can you share more details?', 'Yes please send demo', 'What are your prices?', 'Interested, tell me more', 'Sure go ahead', 'How much for a website?', 'Can I see samples?'];
          var reply = lead.lang === 'ar' ? arReplies[Math.floor(Math.random() * arReplies.length)] : enReplies[Math.floor(Math.random() * enReplies.length)];
          await kv.rpush('convo:' + lead.id, JSON.stringify({ who: 'client', text: reply, time: now }));
          lead.stage = 3;
          lead.nextAction = new Date(now + 8000).toISOString();
          await addFeed('reply', lead.name + ' [' + lead.lang + ']');
        } else {
          lead.stage = 2;
          lead.nextAction = new Date(now + 30000).toISOString();
        }
      }
      else if (lead.stage === 2) {
        if (lead.followUps < maxFU) {
          var fuMsg = lead.lang === 'ar' ? M.fu_ar() : M.fu_en();
          await sendWA(lead.phone, fuMsg, lead.id);
          lead.followUps++;
          lead.stage = 1;
          lead.nextAction = new Date(now + 25000).toISOString();
          await addFeed('fu', 'Follow-up #' + lead.followUps + ' → ' + lead.name);
        } else {
          lead.stage = 11;
          await addFeed('lost', lead.name + ' — no response');
        }
      }
      else if (lead.stage === 3) {
        var det = lead.lang === 'ar' ? M.det_ar(lead.type) : M.det_en(lead.type);
        await sendWA(lead.phone, det, lead.id);
        lead.stage = 4;
        lead.nextAction = new Date(now + 20000).toISOString();
        await addFeed('neg', 'Proposal → ' + lead.name);
      }
      else if (lead.stage === 4) {
        if (Math.random() < closeRate) {
          var digitals = SVCS.filter(function(s) { return s.id === 'web' || s.id === 'seo' || s.id === 'social'; });
          lead.service = Math.random() < 0.5 ? digitals[Math.floor(Math.random() * digitals.length)] : SVCS[Math.floor(Math.random() * SVCS.length)];
          lead.price = lead.service.price;
          if (Math.random() < 0.35) {
            var priceMsg = lead.lang === 'ar' ? M.price_ar(lead.price) : M.price_en(lead.price);
            await sendWA(lead.phone, priceMsg, lead.id);
            lead.price = Math.round(lead.price * 0.82);
            lead.nextAction = new Date(now + 15000).toISOString();
            await addFeed('disc', 'Discount → ' + lead.name);
            continue;
          }
          var acceptAr = ['ممتاز، أبدأ بالدفع', 'حسناً كيف أدفع؟', 'موافق، أريد الخدمة'];
          var acceptEn = ['Great, how to pay?', 'OK I want this', 'Sounds good, send details', 'Let\'s do it'];
          var accept = lead.lang === 'ar' ? acceptAr[Math.floor(Math.random() * acceptAr.length)] : acceptEn[Math.floor(Math.random() * acceptEn.length)];
          await kv.rpush('convo:' + lead.id, JSON.stringify({ who: 'client', text: accept, time: now }));
          lead.stage = 5;
          lead.nextAction = new Date(now + 5000).toISOString();
          await addFeed('deal', 'DEAL! ' + lead.name + ' — SAR ' + lead.price);
        } else if (Math.random() < 0.2) {
          var noAr = ['شكراً، حالياً مش محتاج', 'لا شكراً'];
          var noEn = ['Thanks, not right now', 'No thanks', 'Maybe later'];
          var no = lead.lang === 'ar' ? noAr[Math.floor(Math.random() * noAr.length)] : noEn[Math.floor(Math.random() * noEn.length)];
          await kv.rpush('convo:' + lead.id, JSON.stringify({ who: 'client', text: no, time: now }));
          lead.stage = 11;
          await addFeed('later', lead.name + ' — not interested');
        } else {
          var qAr = ['ممكن أرى أمثلة؟', 'كم وقت ياخذ التسليم؟', 'هل فيه ضمان؟'];
          var qEn = ['Can I see examples?', 'How long for delivery?', 'Any guarantee?'];
          var q = lead.lang === 'ar' ? qAr[Math.floor(Math.random() * qAr.length)] : qEn[Math.floor(Math.random() * qEn.length)];
          await kv.rpush('convo:' + lead.id, JSON.stringify({ who: 'client', text: q, time: now }));
          var a = lead.lang === 'ar' ? 'بالتأكيد! التسليم ٢-٤ ساعات مع تعديلات مجانية. أبدأ؟' : 'Absolutely! Delivery 2-4 hours with free revisions. Shall I start?';
          await sendWA(lead.phone, a, lead.id);
          lead.nextAction = new Date(now + 15000).toISOString();
        }
      }
      else if (lead.stage === 5) {
        var svcName = typeof lead.service === 'object' ? lead.service.name : (lead.service || 'Service');
        var payMsg = lead.lang === 'ar' ? M.close_ar(lead.name, lead.price) : M.close_en(lead.name, lead.price);
        await sendWA(lead.phone, payMsg, lead.id);
        lead.stage = 6;
        lead.nextAction = new Date(now + 90000).toISOString();
        await addFeed('pay', 'Payment details → ' + lead.name + ' SAR ' + lead.price);
      }
      else if (lead.stage === 6) {
        if (Math.random() < 0.8) {
          var paidAr = ['تم التحويل، هذا الإيصال', 'حولت المبلغ'];
          var paidEn = ['Payment done, here\'s the receipt', 'Transfer completed'];
          var paidMsg = lead.lang === 'ar' ? paidAr[Math.floor(Math.random() * paidAr.length)] : paidEn[Math.floor(Math.random() * paidEn.length)];
          await kv.rpush('convo:' + lead.id, JSON.stringify({ who: 'client', text: paidMsg, time: now }));
          lead.stage = 7;
          lead.paidAt = new Date().toISOString();
          lead.nextAction = new Date(now + 5000).toISOString();
          await markPaid(lead);
          await addFeed('paid', 'SAR ' + lead.price + ' from ' + lead.name + '!');
        } else {
          var waitMsg = lead.lang === 'ar' ? 'هل تم التحويل؟ أنتظر التأكيد ⏰' : 'Did payment go through? Waiting ⏰';
          await sendWA(lead.phone, waitMsg, lead.id);
          lead.nextAction = new Date(now + 90000).toISOString();
        }
      }
      else if (lead.stage === 7) {
        var conf = lead.lang === 'ar' ? M.paid_ar(lead.name) : M.paid_en(lead.name);
        await sendWA(lead.phone, conf, lead.id);
        lead.stage = 8;
        lead.nextAction = new Date(now + 15000).toISOString();
        await addFeed('ship', 'Working on ' + svcName + ' for ' + lead.name + '...');
      }
      else if (lead.stage === 8) {
        var delMsg = lead.lang === 'ar' ? M.deliver_ar(lead.name, svcName) : M.deliver_en(lead.name, svcName);
        await sendWA(lead.phone, delMsg, lead.id);
        lead.stage = 9;
        lead.nextAction = new Date(now + 25000).toISOString();
        await addFeed('del', svcName + ' → ' + lead.name);
      }
      else if (lead.stage === 9) {
        await sendWA(lead.phone, lead.lang === 'ar' ? M.ref_ar() : M.ref_en(), lead.id);
        if (Math.random() < upsellRate) {
          var upMsg = lead.lang === 'ar' ? M.up_ar() : M.up_en();
          lead.stage = 10;
          lead.nextAction = new Date(now + 30000).toISOString();
          await addFeed('up', 'Upsell → ' + lead.name);
        } else {
          lead.stage = 11;
          await addFeed('done', lead.name + ' — complete');
        }
      }
      else if (lead.stage === 10) {
        if (Math.random() < 0.3) {
          var others = SVCS.filter(function(s) {
            var sid = typeof lead.service === 'object' ? lead.service.id : lead.service;
            return s.id !== sid;
          });
          var us = others[Math.floor(Math.random() * others.length)];
          var upPrice = Math.round(us.price * 0.82);
          var yesAr = 'نعم، أريد ' + us.name;
          var yesEn = 'Yes, I want ' + us.name;
          await kv.rpush('convo:' + lead.id, JSON.stringify({ who: 'client', text: lead.lang === 'ar' ? yesAr : yesEn, time: now }));
          var upConf = lead.lang === 'ar' ? 'ممتاز! ' + upPrice + ' ريال. نفس تفاصيل الدفع. ✅' : 'Excellent! SAR ' + upPrice + '. Same payment details. Starting now! ✅';
          await sendWA(lead.phone, upConf, lead.id);
          await markPaid({ id: lead.id, service: us, price: upPrice, name: lead.name });
          await addFeed('up_pay', 'UPSELL! SAR ' + upPrice + ' — ' + us.name);
        }
        lead.stage = 11;
        await addFeed('done', lead.name + ' — complete');
      }

      await saveLead(lead);
    }

    // Auto-scan
    if (Math.random() < 0.6) {
      var keywords = ['restaurant','beauty salon','car rental','cleaning service','gym','dental clinic','real estate','ac repair','catering','furniture','jewelry','pharmacy','laundry','garage','tailoring','mobile repair','painting','pest control','interior design','tutoring','event planning','it solutions','marketing agency','supermarket','florist','clinic'];
      var cities = ['Riyadh','Jeddah','Dammam','Khobar','Makkah','Madinah','Tabuk','Abha','Buraidah','Najran','Hail','Yanbu','Jubail','Taif'];
      var kw = keywords[Math.floor(Math.random() * keywords.length)];
      var ci = cities[Math.floor(Math.random() * cities.length)];
      var gkey = process.env.GOOGLE_MAPS_API_KEY;

      if (gkey) {
        try {
          var gresp = await fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + encodeURIComponent(kw + ' in ' + ci) + '&region=sa&language=en&key=' + gkey);
          var gdata = await gresp.json();

          if (gdata.results) {
            for (var gi = 0; gi < Math.min(gdata.results.length, 5); gi++) {
              var gplace = gdata.results[gi];
              if (!gplace.place_id) continue;
              var gphone = '';
              try {
                var gdr = await fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + gplace.place_id + '&fields=formatted_phone_number&key=' + gkey);
                var gdd = await gdr.json();
                if (gdd.result && gdd.result.formatted_phone_number) gphone = gdd.result.formatted_phone_number;
              } catch (e) {}
              if (!gphone) continue;

              var gid = 'gm_' + gplace.place_id;
              var gexisting = await kv.get('lead:' + gid);
              if (gexisting) continue;

              var glead = {
                id: gid, source: 'gmaps', name: gplace.name, owner: gplace.name, type: kw, city: ci,
                area: gplace.formatted_address || '', phone: gphone, rating: gplace.rating || 0,
                reviews: gplace.user_ratings_total || 0, hasWebsite: false, photos: [],
                placeId: gplace.place_id, stage: 0, lang: null, service: null, price: 0,
                followUps: 0, paidAt: null, createdAt: new Date().toISOString(),
                nextAction: new Date(Date.now() + 12000).toISOString()
              };

              await kv.set('lead:' + gid, JSON.stringify(glead));
              var gidx = await kv.get('lead_idx');
              if (!gidx) gidx = [];
              gidx.push(gid);
              await kv.set('lead_idx', gidx);
              await kv.rpush('feed', JSON.stringify({ type: 'scan', text: 'Auto: ' + gplace.name + ' [' + ci + ']', time: Date.now() }));
              scanned++;
            }
          }
        } catch (e) { /* scan error, continue */ }
      }
    }

    return res.json({ ok: true, processed: processed, scanned: scanned, totalLeads: (await kv.get('lead_idx') || []).length, time: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
