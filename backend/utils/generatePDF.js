// Fix your backend PDF generation function
import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoicePDF = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      // Create directory if it doesn't exist
      const dir = "./invoices";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const fileName = `${invoice.invoiceNumber}.pdf`;
      const filePath = `${dir}/${fileName}`;

      // Create a new PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Pipe to file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add content to PDF
      doc.fontSize(25).text("INVOICE", { align: "center" });
      // Add other invoice details...
      doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`);
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);

      // Client info
      doc.moveDown();
      doc.text(`Client: ${invoice.clientName}`);
      doc.text(`Email: ${invoice.clientEmail}`);
      doc.text(`Address: ${invoice.clientAddress}`);

      // Items table
      doc.moveDown();
      let y = doc.y;
      doc.font("Helvetica-Bold");
      doc.text("Item", 50, y);
      doc.text("Quantity", 200, y);
      doc.text("Price", 280, y);
      doc.text("Total", 350, y);
      doc.font("Helvetica");

      // Add items
      y += 20;
      invoice.items.forEach((item) => {
        const itemTotal = item.quantity * item.price;
        doc.text(item.description, 50, y);
        doc.text(item.quantity.toString(), 200, y);
        doc.text(`₹${item.price}`, 280, y);
        doc.text(`₹${itemTotal}`, 350, y);
        y += 20;
      });

      // Add total
      doc.moveDown();
      doc
        .font("Helvetica-Bold")
        .text(`Total: ₹${invoice.total}`, { align: "right" });

      // THIS IS CRITICAL - must end the document
      doc.end();

      // Return filepath when stream is finished
      stream.on("finish", () => {
        resolve(filePath);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
