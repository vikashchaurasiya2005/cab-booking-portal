import Invoice from '../models/Invoice.js';
import { emitToVendor } from '../utils/socket.js';

export const createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice({ ...req.body, vendor: req.user.vendorId, submittedAt: new Date() });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const { status, month } = req.query;
    const filter = { vendor: req.user.vendorId };
    if (status) filter.status = status;
    if (month) filter.reportMonth = month;
    const invoices = await Invoice.find(filter).populate('booking vendor');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, vendor: req.user.vendorId }).populate('booking vendor');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate({ _id: req.params.id, vendor: req.user.vendorId }, req.body, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    emitToVendor(invoice.vendor, 'invoice:update', invoice);
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, vendor: req.user.vendorId });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
