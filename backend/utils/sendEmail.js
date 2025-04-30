import nodemailer from "nodemailer";

export const sendInvoiceEmail = async (invoice, recipientEmail) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `InvoiceGen <${process.env.SMTP_USER}>`,
    to: recipientEmail,
    subject: `Invoice ${invoice.invoiceNumber} from ${invoice.clientName}`,
    text: `Please find attached invoice ${invoice.invoiceNumber}`,
    attachments: [
      {
        filename: `${invoice.invoiceNumber}.pdf`,
        path: `./invoices/${invoice.invoiceNumber}.pdf`,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
