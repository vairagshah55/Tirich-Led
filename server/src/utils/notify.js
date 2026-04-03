/**
 * Lead notification — email (Resend) + WhatsApp (Meta Cloud API)
 *
 * Email    : Resend free tier (3 000 emails/month)
 * WhatsApp : Meta Cloud API free tier (1 000 conversations/month)
 *
 * Both run fire-and-forget so the API response is never delayed.
 */

const { Resend } = require('resend');

/* ── helpers ── */

const BIZ_LABELS = {
  'led-showroom': 'LED Showroom',
  'electrical-shop': 'Electrical Shop',
  distributor: 'Distributor',
  other: 'Other',
};

const DESG_LABELS = {
  owner: 'Owner',
  interior: 'Interior Designer',
  architect: 'Architect',
};

function formatLead(lead) {
  const biz =
    lead.business_type === 'other'
      ? lead.business_other || 'Other'
      : BIZ_LABELS[lead.business_type] || lead.business_type;
  const desg = DESG_LABELS[lead.designation] || lead.designation;
  return { ...lead, bizLabel: biz, desgLabel: desg };
}

/* ── Email (Resend) ── */

async function sendEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const resend = new Resend(apiKey);
  const f = formatLead(lead);

  await resend.emails.send({
    from: 'Tirich LED <onboarding@resend.dev>',
    to,
    subject: `New Lead — ${f.name} (${f.city})`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="color:#262262;margin:0 0 4px;">New Lead Received</h2>
        <p style="color:#888;font-size:13px;margin:0 0 20px;">From the Tirich LED product catalogue</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#888;width:120px;">Name</td><td style="padding:8px 0;color:#262262;font-weight:600;">${f.name}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;color:#262262;font-weight:600;">${f.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">City</td><td style="padding:8px 0;color:#262262;font-weight:600;">${f.city}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">Business</td><td style="padding:8px 0;color:#262262;font-weight:600;">${f.bizLabel}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">Designation</td><td style="padding:8px 0;color:#262262;font-weight:600;">${f.desgLabel}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0 12px;">
        <p style="color:#aaa;font-size:11px;margin:0;">Tirich LED — Automated Lead Notification</p>
      </div>
    `,
  });
}

/* ── WhatsApp (Meta Cloud API) ── */

async function sendWhatsApp(lead) {
  const token = process.env.WA_TOKEN;
  const phoneId = process.env.WA_PHONE_ID;
  const to = process.env.WA_NOTIFY_NUMBER;
  if (!token || !phoneId || !to) return;

  const f = formatLead(lead);

  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      body: [
        `📋 *New Lead — Tirich LED*`,
        ``,
        `*Name:* ${f.name}`,
        `*Phone:* ${f.phone}`,
        `*City:* ${f.city}`,
        `*Business:* ${f.bizLabel}`,
        `*Designation:* ${f.desgLabel}`,
      ].join('\n'),
    },
  };

  await fetch(
    `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
}

/* ── Public API ── */

function notifyNewLead(lead) {
  // Fire-and-forget — don't block the API response
  sendEmail(lead).catch((err) =>
    console.error('[notify] email failed:', err.message)
  );
  sendWhatsApp(lead).catch((err) =>
    console.error('[notify] whatsapp failed:', err.message)
  );
}

module.exports = { notifyNewLead };
