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

export function getCustomerInviteEmail(data: {
  customerName?: string
  cmraName: string
  inviteLink: string
  expiresAt: string
}): EmailTemplate {
  const greeting = data.customerName ? `Hi ${data.customerName}` : "Hello"

  return {
    subject: `${data.cmraName} has invited you to complete your Form 1583`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Invited!</h1>
              <p>Complete your Form 1583 with ${data.cmraName}</p>
            </div>
            <div class="content">
              <p>${greeting},</p>
              <p>${data.cmraName} has invited you to complete your USPS Form 1583 for mailbox services.</p>
              
              <div class="details">
                <p><strong>What you'll need:</strong></p>
                <ul>
                  <li>Valid government-issued photo ID</li>
                  <li>Proof of address (utility bill, lease, etc.)</li>
                  <li>10-15 minutes to complete the process</li>
                </ul>
              </div>

              <a href="${data.inviteLink}" class="button">Start Your Application</a>

              <p><strong>This invitation expires on ${new Date(data.expiresAt).toLocaleDateString()}</strong></p>

              <p>The process is simple:</p>
              <ol>
                <li>Upload your documents</li>
                <li>Complete Form 1583</li>
                <li>Schedule a witness session</li>
                <li>Get approved and start using your mailbox!</li>
              </ol>
            </div>
            <div class="footer">
              <p>MailboxHero Pro - USPS Compliant Mailbox Services</p>
              <p>Questions? Contact ${data.cmraName} directly</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${greeting},

${data.cmraName} has invited you to complete your USPS Form 1583 for mailbox services.

What you'll need:
- Valid government-issued photo ID
- Proof of address (utility bill, lease, etc.)
- 10-15 minutes to complete the process

Start your application: ${data.inviteLink}

This invitation expires on ${new Date(data.expiresAt).toLocaleDateString()}

The process is simple:
1. Upload your documents
2. Complete Form 1583
3. Schedule a witness session
4. Get approved and start using your mailbox!

MailboxHero Pro - USPS Compliant Mailbox Services
Questions? Contact ${data.cmraName} directly
    `,
  }
}

export function getMissingUploadEmail(data: {
  customerName: string
  missingDocuments: string[]
  uploadLink: string
}): EmailTemplate {
  return {
    subject: "Action Required: Missing Documents for Your Mailbox Application",
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
            .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Action Required</h1>
              <p>Missing documents for your application</p>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>We're almost ready to process your mailbox application, but we need a few more documents from you.</p>
              
              <div class="alert">
                <p><strong>Missing Documents:</strong></p>
                <ul>
                  ${data.missingDocuments.map((doc) => `<li>${doc}</li>`).join("")}
                </ul>
              </div>

              <a href="${data.uploadLink}" class="button">Upload Missing Documents</a>

              <p>Once we receive these documents, we'll review them within 24 hours and get you set up with your mailbox service.</p>

              <p>Need help? Reply to this email and we'll assist you right away.</p>
            </div>
            <div class="footer">
              <p>MailboxHero Pro - USPS Compliant Mailbox Services</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.customerName},

We're almost ready to process your mailbox application, but we need a few more documents from you.

Missing Documents:
${data.missingDocuments.map((doc) => `- ${doc}`).join("\n")}

Upload missing documents: ${data.uploadLink}

Once we receive these documents, we'll review them within 24 hours and get you set up with your mailbox service.

Need help? Reply to this email and we'll assist you right away.

MailboxHero Pro - USPS Compliant Mailbox Services
    `,
  }
}

export function getInvalidUploadEmail(data: {
  customerName: string
  documentType: string
  reason: string
  uploadLink: string
}): EmailTemplate {
  return {
    subject: "Document Rejected: Please Re-upload",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Document Rejected</h1>
              <p>Please re-upload your document</p>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>We've reviewed your uploaded document and unfortunately it doesn't meet our requirements.</p>
              
              <div class="alert">
                <p><strong>Document:</strong> ${data.documentType}</p>
                <p><strong>Reason for rejection:</strong> ${data.reason}</p>
              </div>

              <p><strong>Tips for a successful upload:</strong></p>
              <ul>
                <li>Ensure the document is clear and legible</li>
                <li>All four corners of the document should be visible</li>
                <li>No glare or shadows on the document</li>
                <li>Document should be in color (not black and white)</li>
                <li>File format: JPG, PNG, or PDF</li>
              </ul>

              <a href="${data.uploadLink}" class="button">Re-upload Document</a>

              <p>If you have questions about this rejection, please reply to this email and we'll help you.</p>
            </div>
            <div class="footer">
              <p>MailboxHero Pro - USPS Compliant Mailbox Services</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.customerName},

We've reviewed your uploaded document and unfortunately it doesn't meet our requirements.

Document: ${data.documentType}
Reason for rejection: ${data.reason}

Tips for a successful upload:
- Ensure the document is clear and legible
- All four corners of the document should be visible
- No glare or shadows on the document
- Document should be in color (not black and white)
- File format: JPG, PNG, or PDF

Re-upload document: ${data.uploadLink}

If you have questions about this rejection, please reply to this email and we'll help you.

MailboxHero Pro - USPS Compliant Mailbox Services
    `,
  }
}

export function getViolationAlertEmail(data: {
  customerName: string
  violationType: string
  description: string
  actionUrl: string
}): EmailTemplate {
  return {
    subject: `Compliance Alert: ${data.violationType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Compliance Alert</h1>
              <p>${data.violationType}</p>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>We've detected a compliance issue that requires your attention.</p>
              
              <div class="alert">
                <p><strong>Issue:</strong> ${data.violationType}</p>
                <p><strong>Description:</strong> ${data.description}</p>
              </div>

              <p><strong>What you need to do:</strong></p>
              <ul>
                <li>Review the violation details in your dashboard</li>
                <li>Take corrective action as soon as possible</li>
                <li>Contact support if you need assistance</li>
              </ul>

              <a href="${data.actionUrl}" class="button">View Dashboard</a>

              <p>Maintaining compliance is essential for continued service. Please address this issue promptly.</p>
            </div>
            <div class="footer">
              <p>MailboxHero Pro - USPS Compliant Mailbox Services</p>
              <p>Questions? Reply to this email for immediate assistance</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.customerName},

We've detected a compliance issue that requires your attention.

Issue: ${data.violationType}
Description: ${data.description}

What you need to do:
- Review the violation details in your dashboard
- Take corrective action as soon as possible
- Contact support if you need assistance

View Dashboard: ${data.actionUrl}

Maintaining compliance is essential for continued service. Please address this issue promptly.

MailboxHero Pro - USPS Compliant Mailbox Services
Questions? Reply to this email for immediate assistance
    `,
  }
}
