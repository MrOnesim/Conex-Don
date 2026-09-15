interface BookingEmailData {
  reference: string;
  name: string;
  email: string;
  organization?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  eventType?: string | null;
  eventDate?: string | null;
  capacity?: string | null;
  budget?: string | null;
  message?: string | null;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  to: string;
}

function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM ?? "noreply@conexetdon.com";
  const to = process.env.BOOKING_EMAIL ?? "booking.conexetdon@gmail.com";

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from,
    to,
  };
}

function generateBookingEmailHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle demande de booking - ${data.reference}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #080808 0%, #1a1a1a 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: #D6A83A; margin: 0; font-size: 24px; font-weight: 600;">Nouvelle demande de booking</h1>
    <p style="color: #F5F2EA; margin: 8px 0 0; opacity: 0.8;">Référence: <strong>${data.reference}</strong></p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #080808; margin-top: 0; font-size: 18px;">Informations du demandeur</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666; width: 150px;">Nom</td>
        <td style="padding: 10px 0; color: #1a1a1a;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666;">Email</td>
        <td style="padding: 10px 0; color: #1a1a1a;"><a href="mailto:${data.email}" style="color: #D6A83A;">${data.email}</a></td>
      </tr>
      ${data.organization ? `
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666;">Organisation</td>
        <td style="padding: 10px 0; color: #1a1a1a;">${data.organization}</td>
      </tr>
      ` : ""}
      ${data.phone ? `
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666;">Téléphone</td>
        <td style="padding: 10px 0; color: #1a1a1a;"><a href="tel:${data.phone}" style="color: #D6A83A;">${data.phone}</a></td>
      </tr>
      ` : ""}
      ${data.country ? `
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666;">Pays</td>
        <td style="padding: 10px 0; color: #1a1a1a;">${data.country}</td>
      </tr>
      ` : ""}
      ${data.city ? `
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666;">Ville</td>
        <td style="padding: 10px 0; color: #1a1a1a;">${data.city}</td>
      </tr>
      ` : ""}
    </table>

    <h2 style="color: #080808; margin-top: 30px; font-size: 18px;">Détails de l'événement</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      ${data.eventType ? `
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666; width: 150px;">Type d'événement</td>
        <td style="padding: 10px 0; color: #1a1a1a;">${data.eventType}</td>
      </tr>
      ` : ""}
      ${data.eventDate ? `
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666;">Date souhaitée</td>
        <td style="padding: 10px 0; color: #1a1a1a;">${data.eventDate}</td>
      </tr>
      ` : ""}
      ${data.capacity ? `
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666;">Capacité</td>
        <td style="padding: 10px 0; color: #1a1a1a;">${data.capacity}</td>
      </tr>
      ` : ""}
      ${data.budget ? `
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #666;">Budget estimé</td>
        <td style="padding: 10px 0; color: #1a1a1a;">${data.budget}</td>
      </tr>
      ` : ""}
    </table>

    ${data.message ? `
    <h2 style="color: #080808; margin-top: 30px; font-size: 18px;">Message</h2>
    <div style="background: #fafafa; padding: 20px; border-radius: 8px; border-left: 4px solid #D6A83A; white-space: pre-wrap;">${data.message}</div>
    ` : ""}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
      <a href="mailto:${data.email}?subject=Re: Booking ${data.reference}" 
         style="display: inline-block; background: #D6A83A; color: #080808; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Répondre au demandeur
      </a>
      <p style="margin-top: 16px; font-size: 12px; color: #999;">
        Cet email a été envoyé automatiquement depuis le formulaire de booking du site conexetdon.com
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateBookingEmailText(data: BookingEmailData): string {
  return `
Nouvelle demande de booking - ${data.reference}

INFORMATIONS DU DEMANDEUR
- Nom: ${data.name}
- Email: ${data.email}
${data.organization ? `- Organisation: ${data.organization}` : ""}
${data.phone ? `- Téléphone: ${data.phone}` : ""}
${data.country ? `- Pays: ${data.country}` : ""}
${data.city ? `- Ville: ${data.city}` : ""}

DÉTAILS DE L'ÉVÉNEMENT
${data.eventType ? `- Type d'événement: ${data.eventType}` : ""}
${data.eventDate ? `- Date souhaitée: ${data.eventDate}` : ""}
${data.capacity ? `- Capacité: ${data.capacity}` : ""}
${data.budget ? `- Budget estimé: ${data.budget}` : ""}

${data.message ? `MESSAGE\n${data.message}` : ""}

---
Répondre à: ${data.email}
Site: conexetdon.com
  `.trim();
}

export async function sendBookingNotification(data: BookingEmailData): Promise<boolean> {
  const config = getEmailConfig();
  
  if (!config) {
    console.log("Email configuration not found, skipping notification");
    return false;
  }

  try {
    const nodemailer = await import("nodemailer");
    
    const transporter = nodemailer.default.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: `Nouvelle demande de booking - ${data.reference}`,
      text: generateBookingEmailText(data),
      html: generateBookingEmailHtml(data),
      replyTo: data.email,
    });

    console.log(`Booking notification sent for ${data.reference}`);
    return true;
  } catch (error) {
    console.error("Failed to send booking notification:", error);
    return false;
  }
}

export async function sendNewsletterWelcome(email: string): Promise<boolean> {
  const config = getEmailConfig();
  
  if (!config) {
    return false;
  }

  try {
    const nodemailer = await import("nodemailer");
    
    const transporter = nodemailer.default.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    await transporter.sendMail({
      from: config.from,
      to: email,
      subject: "Bienvenue dans la communauté ALOBA 🌿",
      text: `
Bienvenue dans ALOBA !

Merci de rejoindre la communauté Conex & Don. Vous recevrez désormais en avant-première :
- Les annonces de concerts et dates de tournée
- Les coulisses et contenus exclusifs
- Les nouveaux clips et sorties musicales

L'équipe Conex & Don
      `.trim(),
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #080808 0%, #1a1a1a 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #D6A83A; margin: 0; font-size: 28px; font-weight: 600;">Bienvenue dans ALOBA 🌿</h1>
    <p style="color: #F5F2EA; margin: 16px 0 0; opacity: 0.9;">La communauté Conex & Don</p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
    <p style="font-size: 16px; color: #1a1a1a;">Merci de rejoindre la communauté <strong>Conex & Don</strong> !</p>
    
    <p style="font-size: 16px; color: #1a1a1a;">Vous recevrez désormais en avant-première :</p>
    
    <ul style="color: #1a1a1a; padding-left: 20px;">
      <li style="margin-bottom: 10px;">🎤 Les annonces de concerts et dates de tournée</li>
      <li style="margin-bottom: 10px;">🎬 Les coulisses et contenus exclusifs</li>
      <li style="margin-bottom: 10px;">🎵 Les nouveaux clips et sorties musicales</li>
    </ul>
    
    <div style="margin-top: 30px; text-align: center;">
      <a href="https://conexetdon.com" style="display: inline-block; background: #D6A83A; color: #080808; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Visiter le site
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
      L'équipe Conex & Don<br>
      <a href="https://conexetdon.com" style="color: #D6A83A;">conexetdon.com</a>
    </p>
  </div>
</body>
</html>
      `,
    });

    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
}