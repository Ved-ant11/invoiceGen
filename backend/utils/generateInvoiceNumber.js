import Invoice from "../models/Invoice.js";

export default async function generateInvoiceNumber() {
  const lastInvoice = await Invoice.findOne().sort({ _id: -1 });
  const lastNumber = lastInvoice
    ? parseInt(lastInvoice.invoiceNumber.split("-")[1] || "0")
    : 0;
  return `INV-${String(lastNumber + 1).padStart(5, "0")}`;
}
