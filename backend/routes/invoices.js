import express from "express";
import auth from "../middleware/auth.js";
import {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.use(auth);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);
router.post("/:id/send", sendInvoice);


export default router;
