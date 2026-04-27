import * as postmark from 'postmark';

const serverToken = process.env.POSTMARK_API_TOKEN || '';
const client = new postmark.ServerClient(serverToken);

const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL || 'contact@dovepeakdigital.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dovepeakdigital@gmail.com';

interface ReceiptData {
  amount: number;
  phone: string;
  reference: string;
  mpesaReceipt: string;
  customerEmail?: string;
}

export async function sendPaymentReceipt(data: ReceiptData) {
  const { amount, phone, reference, mpesaReceipt, customerEmail } = data;

  const formattedPhone = phone.replace(/\D/g, '');
  const displayPhone = formattedPhone.length === 12 
    ? `+${formattedPhone.slice(0, 3)} ${formattedPhone.slice(3, 6)} ${formattedPhone.slice(6, 9)} ${formattedPhone.slice(9)}`
    : phone;

  const formattedDate = new Date().toLocaleString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt - Dovepeak Digital</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7fa; padding-bottom: 40px; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 20px; text-align: center; }
        .header img { max-width: 150px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .status-badge { display: inline-block; background-color: #10b981; color: white; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 15px; }
        .content { padding: 40px; }
        .receipt-summary { text-align: center; margin-bottom: 40px; }
        .amount-label { color: #64748b; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .amount-value { font-size: 48px; font-weight: 800; color: #0f172a; margin: 0; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 30px 0; }
        .details-grid { width: 100%; border-collapse: collapse; }
        .detail-row td { padding: 12px 0; font-size: 15px; }
        .detail-label { color: #64748b; width: 40%; }
        .detail-value { color: #0f172a; font-weight: 600; text-align: right; }
        .footer { padding: 30px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9; }
        .action-button { display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
        .contact-info { margin-top: 20px; font-style: normal; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Dovepeak Digital</h1>
            <div class="status-badge">Payment Successful</div>
          </div>
          <div class="content">
            <div class="receipt-summary">
              <div class="amount-label">Amount Paid</div>
              <div class="amount-value">KES ${amount.toLocaleString()}</div>
            </div>
            
            <table class="details-grid">
              <tr class="detail-row">
                <td class="detail-label">Receipt Number</td>
                <td class="detail-value">${mpesaReceipt}</td>
              </tr>
              <tr class="detail-row">
                <td class="detail-label">Reference</td>
                <td class="detail-value">${reference}</td>
              </tr>
              <tr class="detail-row">
                <td class="detail-label">Payment Method</td>
                <td class="detail-value">M-Pesa</td>
              </tr>
              <tr class="detail-row">
                <td class="detail-label">Phone Number</td>
                <td class="detail-value">${displayPhone}</td>
              </tr>
              <tr class="detail-row">
                <td class="detail-label">Date & Time</td>
                <td class="detail-value">${formattedDate}</td>
              </tr>
            </table>

            <div class="divider"></div>

            <p style="color: #475569; font-size: 15px; line-height: 1.6; text-align: center;">
              Thank you for choosing Dovepeak Digital. Your payment has been successfully processed and your service is being activated.
            </p>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" class="action-button">Go to Admin Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Dovepeak Digital Solutions. All rights reserved.</p>
            <p class="contact-info">
              Questions? Contact us at <a href="mailto:contact@dovepeakdigital.com" style="color: #2563eb; text-decoration: none;">contact@dovepeakdigital.com</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const recipients = [ADMIN_EMAIL];
    if (customerEmail) recipients.push(customerEmail);

    await client.sendEmail({
      From: `Dovepeak Digital <${FROM_EMAIL}>`,
      To: recipients.join(', '),
      Subject: `Receipt for Payment: ${mpesaReceipt} - Dovepeak Digital`,
      HtmlBody: htmlContent,
      TextBody: `Payment Receipt\n\nAmount: KES ${amount}\nReceipt: ${mpesaReceipt}\nReference: ${reference}\nPhone: ${displayPhone}\nDate: ${formattedDate}\n\nThank you for choosing Dovepeak Digital.`,
      MessageStream: 'outbound'
    });

    console.log(`Payment receipt sent successfully to: ${recipients.join(', ')}`);
    return { success: true };
  } catch (error) {
    console.error('Postmark Error:', error);
    return { success: false, error };
  }
}
