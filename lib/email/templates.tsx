export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function getSessionConfirmationEmail(data: {
  customerName: string
  sessionDate: string
  sessionTime: string
  agentName: string
}): EmailTemplate {
  return {
    subject: "Your Witness Session is Confirmed",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Session Confirmed!</h1>
              <p>Your digital witnessing session is scheduled</p>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Your Form 1583 digital witnessing session has been confirmed. Here are the details:</p>
              
              <div class="details">
                <p><strong>Date:</strong> ${data.sessionDate}</p>
                <p><strong>Time:</strong> ${data.sessionTime}</p>
                <p><strong>Witness Agent:</strong> ${data.agentName}</p>
                <p><strong>Session Type:</strong> V3b Remote Witness</p>
              </div>

              <p><strong>What to prepare:</strong></p>
              <ul>
                <li>Valid government-issued photo ID</li>
                <li>Quiet, well-lit location</li>
                <li>Stable internet connection</li>
                <li>Camera and microphone access</li>
              </ul>

              <a href="#" class="button">Join Session</a>

              <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
            </div>
            <div class="footer">
              <p>StreamlineWitness - AI-Powered Digital Witnessing</p>
              <p>Questions? Reply to this email or visit our support center</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.customerName},

Your Form 1583 digital witnessing session has been confirmed.

Session Details:
- Date: ${data.sessionDate}
- Time: ${data.sessionTime}
- Witness Agent: ${data.agentName}
- Session Type: V3b Remote Witness

What to prepare:
- Valid government-issued photo ID
- Quiet, well-lit location
- Stable internet connection
- Camera and microphone access

If you need to reschedule, please contact us at least 24 hours in advance.

StreamlineWitness - AI-Powered Digital Witnessing
    `,
  }
}

export function getSessionCompleteEmail(data: {
  customerName: string
  sessionId: string
  form1583Url: string
  certificateUrl: string
  confidenceScore?: number
}): EmailTemplate {
  return {
    subject: "Your Form 1583 is Ready",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .success-badge { background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 10px 10px 0; }
            .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Session Complete!</h1>
              <p>Your Form 1583 has been successfully witnessed</p>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Great news! Your digital witnessing session is complete and your documents are ready.</p>
              
              <div class="success-badge">
                ✓ Verified & Compliant
              </div>

              <div class="details">
                <p><strong>Session ID:</strong> ${data.sessionId}</p>
                ${data.confidenceScore ? `<p><strong>Verification Score:</strong> ${data.confidenceScore}%</p>` : ""}
                <p><strong>Status:</strong> USPS Compliant</p>
              </div>

              <p><strong>Your Documents:</strong></p>
              <a href="${data.form1583Url}" class="button">Download Form 1583</a>
              <a href="${data.certificateUrl}" class="button">Download Certificate</a>

              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Download and save your documents</li>
                <li>Your CMRA will receive a copy automatically</li>
                <li>Your mailbox service is now active</li>
              </ul>

              <p>All documents are stored securely in your account dashboard.</p>
            </div>
            <div class="footer">
              <p>StreamlineWitness - AI-Powered Digital Witnessing</p>
              <p>Questions? Reply to this email or visit our support center</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.customerName},

Great news! Your digital witnessing session is complete and your documents are ready.

Session Details:
- Session ID: ${data.sessionId}
${data.confidenceScore ? `- Verification Score: ${data.confidenceScore}%` : ""}
- Status: USPS Compliant

Your Documents:
- Form 1583: ${data.form1583Url}
- Witness Certificate: ${data.certificateUrl}

Next Steps:
- Download and save your documents
- Your CMRA will receive a copy automatically
- Your mailbox service is now active

All documents are stored securely in your account dashboard.

StreamlineWitness - AI-Powered Digital Witnessing
    `,
  }
}

export function getSessionReminderEmail(data: {
  customerName: string
  sessionDate: string
  sessionTime: string
  joinUrl: string
}): EmailTemplate {
  return {
    subject: "Reminder: Your Witness Session is Tomorrow",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .checklist { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Session Reminder</h1>
              <p>Your witnessing session is coming up soon</p>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>This is a friendly reminder that your digital witnessing session is scheduled for:</p>
              
              <div class="checklist">
                <p><strong>${data.sessionDate} at ${data.sessionTime}</strong></p>
              </div>

              <p><strong>Pre-Session Checklist:</strong></p>
              <div class="checklist">
                <p>✓ Valid photo ID ready</p>
                <p>✓ Camera and microphone working</p>
                <p>✓ Quiet, well-lit location</p>
                <p>✓ Stable internet connection</p>
              </div>

              <a href="${data.joinUrl}" class="button">Join Session</a>

              <p>Need to reschedule? Contact us as soon as possible.</p>
            </div>
            <div class="footer">
              <p>StreamlineWitness - AI-Powered Digital Witnessing</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.customerName},

This is a friendly reminder that your digital witnessing session is scheduled for:

${data.sessionDate} at ${data.sessionTime}

Pre-Session Checklist:
✓ Valid photo ID ready
✓ Camera and microphone working
✓ Quiet, well-lit location
✓ Stable internet connection

Join your session: ${data.joinUrl}

Need to reschedule? Contact us as soon as possible.

StreamlineWitness - AI-Powered Digital Witnessing
    `,
  }
}
