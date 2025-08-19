function baseTemplate({ title, preheader, heading, bodyHtml, cta }) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <style>
        /* Clients that respect <style> */
        @media (max-width: 600px) {
          .container { width: 100% !important; }
          .content { padding: 24px !important; }
          .h1 { font-size: 28px !important; }
        }
        a:hover { opacity: 0.9 !important; }
      </style>
    </head>
    <body style="margin:0; padding:0; background:#000000; color:#ffffff;">
      <span style="display:none!important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden;">
        ${preheader || ""}
      </span>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#000000;">
        <tr>
          <td align="center" style="padding: 24px 12px;">
            <table role="presentation" width="600" class="container" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px; background:#111111; border-radius:12px; overflow:hidden; border:1px solid #1f1f1f;">
              <tr>
                <td style="padding: 20px 24px; background:#111111; border-bottom:1px solid #1f1f1f;">
                  <table width="100%" role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="left">
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; font-size:18px; font-weight:700; color:#ffffff; letter-spacing:0.5px;">
                          <span style="color:#ff0000; font-weight: 800; font-size: 20px; text-shadow: 0 0 10px rgba(255,0,0,0.3);">CINERSE</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="content" style="padding: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;">
                  <h1 class="h1" style="margin:0 0 16px; font-size:32px; line-height:1.2; color:#ffffff;">${heading}</h1>
                  <div style="font-size:16px; line-height:1.6; color:#d1d5db;">${bodyHtml}</div>
                  ${
                    cta
                      ? `
                    <div style="margin-top: 28px;">
                      <a href="${cta.href}"
                         style="display:inline-block; background:#e50914; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 20px; border-radius:6px;">
                        ${cta.label}
                      </a>
                    </div>
                  `
                      : ""
                  }
                  <p style="margin-top:28px; font-size:12px; color:#9ca3af;">
                    If you didn’t request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 24px; background:#0a0a0a; border-top:1px solid #1f1f1f;">
                  <p style="margin:0; font-size:12px; color:#6b7280;">
                    © ${new Date().getFullYear()} <span style="color:#ff0000; font-weight: 700;">CINERSE</span>. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function resetPasswordTemplate({ name = "there", resetUrl }) {
  return baseTemplate({
    title: "Reset your password",
    preheader: "Reset your Cinerse password securely.",
    heading: "Reset Your Password",
    bodyHtml: `
      <p style="margin:0 0 12px;">Hi ${name},</p>
      <p style="margin:0 0 12px;">We received a request to reset your password. Click the button below to choose a new one.</p>
      <p style="margin:0 0 12px;">This link will expire in 10 minutes.</p>
    `,
    cta: { label: "Verify & Reset Password", href: resetUrl },
  });
}

module.exports = {
  resetPasswordTemplate,
};
