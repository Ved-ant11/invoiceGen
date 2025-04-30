
const nodemailer = require('nodemailer');
const { generateInvoicePdf } = require('./pdfService');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or another service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Function to send invoice by email
const sendInvoiceEmail = async (invoice, recipientEmail) => {
  try {
    console.log("Starting email send process...");
    
    // Generate PDF buffer
    const pdfBuffer = await generateInvoicePdf(invoice);
    console.log("PDF generated successfully");
    
    const transporter = createTransporter();
    
    // Create email options
    const mailOptions = {
      from: `"Invoice App" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Invoice ${invoice.invoiceNumber}`,
      text: `Please find attached invoice ${invoice.invoiceNumber} for ${invoice.total.toFixed(2)}.`,
      html: `
        <h2>Invoice ${invoice.invoiceNumber}</h2>
        <p>Dear ${invoice.client.name},</p>
        <p>Please find attached your invoice for ${invoice.total.toFixed(2)}.</p>
        <p>Due date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p>Thank you for your business!</p>
      `,
      attachments: [
        {
          filename: `Invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    
    console.log("Sending email to:", recipientEmail);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {
  sendInvoiceEmail
};
