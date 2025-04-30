import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  price: Number,
  tax: Number,
  discount: Number,
});

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  invoiceNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date },
  clientName: { type: String, required: true },
  clientEmail: { type: String },
  clientAddress: { type: String },
  items: [itemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["draft", "sent", "paid", "overdue"],
    default: "draft",
  },
});

export default mongoose.model("Invoice", invoiceSchema);
