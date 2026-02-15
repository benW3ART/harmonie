import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Coaching Parental <noreply@harmonie.app>'
const SUPPORT_EMAIL = 'support@harmonie.app'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Email error:', err)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Coaching Parental</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">💖</span>
              </div>
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #1f2937;">
                Bienvenue ${firstName} !
              </h1>
              <p style="margin: 0 0 32px; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Nous sommes ravis de vous accompagner dans votre parcours parental. 
                Votre espace personnel est prêt et vous pouvez commencer dès maintenant.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://harmonie.app'}/dashboard" 
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Accéder à mon espace
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #1f2937;">
                  Ce qui vous attend :
                </h2>
                <ul style="margin: 0; padding: 0; list-style: none;">
                  <li style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                    ✅ Chat avec l'IA disponible 24h/24
                  </li>
                  <li style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                    ✅ Journal de bord personnalisé
                  </li>
                  <li style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                    ✅ Objectifs et réflexes à ancrer
                  </li>
                  <li style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                    ✅ Accompagnement par un coach humain
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background: #f9fafb; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                Des questions ? Répondez simplement à cet email ou contactez-nous à 
                <a href="mailto:${SUPPORT_EMAIL}" style="color: #ec4899;">${SUPPORT_EMAIL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `
Bienvenue ${firstName} !

Nous sommes ravis de vous accompagner dans votre parcours parental.
Votre espace personnel est prêt et vous pouvez commencer dès maintenant.

Accédez à votre espace : ${process.env.NEXT_PUBLIC_APP_URL || 'https://harmonie.app'}/dashboard

Ce qui vous attend :
- Chat avec l'IA disponible 24h/24
- Journal de bord personnalisé
- Objectifs et réflexes à ancrer
- Accompagnement par un coach humain

Des questions ? Contactez-nous à ${SUPPORT_EMAIL}
`

  return sendEmail({
    to,
    subject: `Bienvenue chez Coaching Parental, ${firstName} ! 💖`,
    html,
    text,
  })
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1f2937;">
                Réinitialisation de mot de passe
              </h1>
              <p style="margin: 0 0 32px; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Vous avez demandé à réinitialiser votre mot de passe.
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
              </p>
              <a href="${resetLink}" 
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Réinitialiser mon mot de passe
              </a>
              <p style="margin: 24px 0 0; font-size: 14px; color: #9ca3af;">
                Ce lien expire dans 1 heure.<br>
                Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `
Réinitialisation de mot de passe

Vous avez demandé à réinitialiser votre mot de passe.
Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :

${resetLink}

Ce lien expire dans 1 heure.
Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
`

  return sendEmail({
    to,
    subject: 'Réinitialisation de votre mot de passe - Coaching Parental',
    html,
    text,
  })
}

export async function sendCoachNotification(
  to: string,
  familyName: string,
  reason: string
) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px;">
              <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">
                  ⚠️ Nouvelle escalade nécessitant votre attention
                </p>
              </div>
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1f2937;">
                Escalade de ${familyName}
              </h1>
              <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280; font-weight: 600;">Raison :</p>
                <p style="margin: 8px 0 0; font-size: 16px; color: #1f2937;">${reason}</p>
              </div>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://harmonie.app'}/coach/escalades" 
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Voir l'escalade
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `
⚠️ Nouvelle escalade nécessitant votre attention

Escalade de ${familyName}

Raison :
${reason}

Voir l'escalade : ${process.env.NEXT_PUBLIC_APP_URL || 'https://harmonie.app'}/coach/escalades
`

  return sendEmail({
    to,
    subject: `⚠️ Escalade de ${familyName} - Action requise`,
    html,
    text,
  })
}
