import Invoice from "../models/Invoice.js";
import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";
import { generateInvoicePDF } from "../utils/generatePDF.js";
import { sendInvoiceEmail } from "../utils/sendEmail.js";

export const createInvoice = async (req, res) => {
   try {
     const { clientName, clientEmail, clientAddress, items, dueDate, status } =
       req.body;
     const total = items.reduce((acc, item) => {
       const subtotal = item.quantity * item.price;
       const tax = ((item.tax || 0) / 100) * subtotal;
       const discount = ((item.discount || 0) / 100) * subtotal;
       return acc + subtotal + tax - discount;
     }, 0);

     const invoice = new Invoice({
       user: req.user._id,
       invoiceNumber: await generateInvoiceNumber(),
       clientName,
       clientEmail,
       clientAddress,
       items,
       dueDate,
       total,
       status,
     });
     await invoice.save();
     generateInvoicePDF(invoice);
     res.status(201).json(invoice);
   } catch (err) {
     res.status(500).json({ message: err.message });
   }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    await sendInvoiceEmail(invoice, invoice.clientEmail);
    res.json({ message: "Invoice sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
app.post("/api/invoices", auth, async (req, res) => {
  try {
    const { clientName, clientEmail, clientAddress, items, dueDate, status } = req.body;
    const total = items.reduce((acc, item) => {
      const subtotal = item.quantity * item.price;
      const tax = (item.tax || 0) / 100 * subtotal;
      const discount = (item.discount || 0) / 100 * subtotal;
      return acc + subtotal + tax - discount;
    }, 0);
    
    const invoice = new Invoice({
      user: req.user._id, 
      invoiceNumber: await generateInvoiceNumber(),
      clientName,
      clientEmail,
      clientAddress,
      items,
      dueDate,
      total,
      status
    });
    await invoice.save();
    generateInvoicePDF(invoice);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/