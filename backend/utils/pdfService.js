
const PDFDocument = require('pdfkit');

// Function to generate invoice PDF
const generateInvoicePdf = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument();
      const buffers = [];
      
      // Collect PDF data chunks
      doc.on('data', buffer => buffers.push(buffer));
      
      // Resolve with the complete PDF data
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Handle errors
      doc.on('error', err => reject(err));
      
      // Add content to PDF
      
      // Header
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();
      
      // Invoice details
      doc.fontSize(12);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.text(`Date Issued: ${new Date(invoice.issueDate).toLocaleDateString()}`);
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
      doc.text(`Status: ${invoice.status.toUpperCase()}`);
      doc.moveDown();
      
      // Client Information
      doc.fontSize(14).text('Bill To:');
      doc.fontSize(12);
      doc.text(invoice.client.name);
      doc.text(invoice.client.email);
      if (invoice.client.address) {
        doc.text(invoice.client.address);
      }
      doc.moveDown();
      
      // Invoice Items
      doc.fontSize(14).text('Invoice Items');
      doc.moveDown(0.5);
      
      // Table header
      const tableTop = doc.y;
      const itemX = 50;
      const quantityX = 300;
      const priceX = 370;
      const amountX = 450;
      
      doc.fontSize(10);
      doc.text('Description', itemX, tableTop);
      doc.text('Quantity', quantityX, tableTop);
      doc.text('Price', priceX, tableTop);
      doc.text('Amount', amountX, tableTop);
      
      doc.moveDown();
      let yPosition = doc.y;
      
      // Table rows
      invoice.items.forEach(item => {
        doc.text(item.description, itemX, yPosition);
        doc.text(item.quantity.toString(), quantityX, yPosition);
        doc.text(`$${item.price.toFixed(2)}`, priceX, yPosition);
        doc.text(`$${(item.quantity * item.price).toFixed(2)}`, amountX, yPosition);
        yPosition += 20;
      });
      
      // Draw table lines
      doc.moveTo(itemX, tableTop - 5)
         .lineTo(amountX + 70, tableTop - 5)
         .stroke();
      
      doc.moveTo(itemX, tableTop + 15)
         .lineTo(amountX + 70, tableTop + 15)
         .stroke();
      
      doc.moveTo(itemX, yPosition + 10)
         .lineTo(amountX + 70, yPosition + 10)
         .stroke();
      
      // Total
      doc.moveDown(2);
      doc.fontSize(12);
      doc.text(`Subtotal: $${invoice.total.toFixed(2)}`, { align: 'right' });
      doc.text(`Total: $${invoice.total.toFixed(2)}`, { align: 'right' });
      
      // Notes if present
      if (invoice.notes) {
        doc.moveDown(2);
        doc.fontSize(12).text('Notes:');
        doc.fontSize(10).text(invoice.notes);
      }
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePdf
};
