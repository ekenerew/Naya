// lib/notifications/email.ts
// Email notifications via Resend

const FROM = process.env.EMAIL_FROM || 'Naya Real Estate <noreply@naya.ng>'
const RESEND_KEY = process.env.RESEND_API_KEY

function nayaEmail(title: string, body: string, cta?: { label: string; url: string }): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; background:#F5F3EE; font-family:'Outfit',Arial,sans-serif; }
  .wrap { max-width:580px; margin:0 auto; padding:32px 16px; }
  .card { background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,0.08); }
  .header { background:#0A0A0B; padding:28px 32px; text-align:center; }
  .logo { color:#C8A84B; font-size:22px; font-weight:300; letter-spacing:4px; }
  .body { padding:32px; }
  .title { font-size:22px; font-weight:600; color:#0A0A0B; margin:0 0 12px; }
  .text { font-size:15px; color:#6B6B6B; line-height:1.7; margin:0 0 20px; }
  .cta { display:inline-block; padding:14px 28px; background:#C8A84B; color:#0A0A0B; font-weight:700; font-size:14px; border-radius:50px; text-decoration:none; }
  .footer { text-align:center; padding:24px 32px; color:#9A9A9A; font-size:12px; }
  .divider { height:1px; background:#F0EBE0; margin:24px 0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header"><div class="logo">NAYA</div></div>
    <div class="body">
      <h2 class="title">${title}</h2>
      ${body}
      ${cta ? `<div style="text-align:center;margin-top:28px"><a class="cta" href="${cta.url}">${cta.label}</a></div>` : ''}
    </div>
    <div class="footer">
      <div class="divider"></div>
      <p>Naya Real Estate Technologies Ltd · Port Harcourt, Rivers State</p>
      <p>© ${new Date().getFullYear()} Naya. All rights reserved.</p>
      <p><a href="https://naya-fawn.vercel.app" style="color:#C8A84B;text-decoration:none;">naya-fawn.vercel.app</a></p>
    </div>
  </div>
</div>
</body></html>`
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_KEY) {
    console.log(`[EMAIL DEV] To: ${to} | Subject: ${subject}`)
    return true
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
    const data = await res.json()
    if (!res.ok) { console.error('[EMAIL ERROR]', data); return false }
    console.log(`[EMAIL SENT] ${to} - ${subject}`)
    return true
  } catch (e: any) {
    console.error('[EMAIL EXCEPTION]', e?.message)
    return false
  }
}

// ── Email templates ───────────────────────────────────────────
export async function sendWelcomeEmail(to: string, firstName: string, accountType: string) {
  const isAgent = ['AGENT','LANDLORD'].includes(accountType)
  return sendEmail(to, `Welcome to Naya, ${firstName}!`, nayaEmail(
    `Welcome to Naya, ${firstName}! 🎉`,
    `<p class="text">You've successfully created your ${isAgent ? 'agent' : ''} account on Naya — Nigeria's most trusted property marketplace in Port Harcourt.</p>
     <p class="text">${isAgent
       ? 'Start by completing your <strong>RSSPC verification</strong> to get your verified badge and list your first property.'
       : 'Browse thousands of verified properties for rent, sale, and shortlet across Port Harcourt.'
     }</p>`,
    { label: isAgent ? 'Complete Verification →' : 'Browse Properties →', url: isAgent ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/profile` : `${process.env.NEXT_PUBLIC_APP_URL}/search` }
  ))
}

export async function sendEnquiryNotification(to: string, agentName: string, enquirerName: string, propertyTitle: string, message: string, phone?: string) {
  return sendEmail(to, `New Enquiry: ${propertyTitle}`, nayaEmail(
    `New Enquiry on Your Listing`,
    `<p class="text">Hi <strong>${agentName}</strong>, you have a new enquiry!</p>
     <div style="background:#F5F3EE;border-radius:12px;padding:16px;margin:16px 0">
       <p style="margin:0 0 8px;font-weight:700;color:#0A0A0B">${propertyTitle}</p>
       <p style="margin:0 0 8px;font-size:13px;color:#6B6B6B">From: <strong>${enquirerName}</strong>${phone ? ` · 📞 ${phone}` : ''}</p>
       <p style="margin:0;font-size:14px;color:#3D3D3D;font-style:italic">"${message}"</p>
     </div>
     <p class="text">Respond quickly — agents who reply within 1 hour get 3x more deals.</p>`,
    { label: 'View Enquiry →', url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/dashboard` }
  ))
}

export async function sendListingApprovedEmail(to: string, firstName: string, propertyTitle: string, listingId: string) {
  return sendEmail(to, `Your listing is now live! 🏠`, nayaEmail(
    `Your Listing is Live!`,
    `<p class="text">Hi <strong>${firstName}</strong>, great news! Your property listing has been reviewed and approved.</p>
     <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin:16px 0">
       <p style="margin:0;font-weight:700;color:#15803d">✓ ${propertyTitle}</p>
     </div>
     <p class="text">Your listing is now visible to thousands of buyers and renters searching in Port Harcourt.</p>`,
    { label: 'View Your Listing →', url: `${process.env.NEXT_PUBLIC_APP_URL}/properties/${listingId}` }
  ))
}

export async function sendPasswordResetEmail(to: string, firstName: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/forgot-password?token=${resetToken}`
  return sendEmail(to, `Reset your Naya password`, nayaEmail(
    `Reset Your Password`,
    `<p class="text">Hi <strong>${firstName}</strong>, we received a request to reset your password.</p>
     <p class="text">This link expires in <strong>30 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>`,
    { label: 'Reset Password →', url: resetUrl }
  ))
}

export async function sendOTPEmail(to: string, otp: string) {
  return sendEmail(to, `Your Naya verification code: ${otp}`, nayaEmail(
    `Your Verification Code`,
    `<p class="text">Use this code to verify your account:</p>
     <div style="text-align:center;margin:24px 0">
       <span style="font-family:monospace;font-size:40px;font-weight:700;color:#0A0A0B;letter-spacing:12px">${otp}</span>
     </div>
     <p class="text" style="text-align:center;font-size:13px">Valid for <strong>5 minutes</strong>. Do not share this code.</p>`
  ))
}

export async function sendVerificationStatusEmail(to: string, firstName: string, status: 'approved' | 'rejected', reason?: string) {
  const approved = status === 'approved'
  return sendEmail(to, approved ? `🎉 RSSPC Verification Approved!` : `RSSPC Verification Update`, nayaEmail(
    approved ? `You're Now a Verified Agent!` : `Verification Update Required`,
    approved
      ? `<p class="text">Congratulations <strong>${firstName}</strong>! Your RSSPC verification has been approved.</p>
         <p class="text">Your verified badge is now active on your profile and all your listings. Buyers and renters can see that you're a trusted, registered professional.</p>`
      : `<p class="text">Hi <strong>${firstName}</strong>, we were unable to complete your RSSPC verification at this time.</p>
         ${reason ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:16px 0"><p style="margin:0;color:#b91c1c">${reason}</p></div>` : ''}
         <p class="text">Please resubmit with the correct documents or contact us at <a href="mailto:verify@naya.ng" style="color:#C8A84B">verify@naya.ng</a></p>`,
    { label: approved ? 'View Your Profile →' : 'Resubmit Documents →', url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/profile` }
  ))
}
