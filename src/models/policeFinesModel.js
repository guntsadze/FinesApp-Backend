import mongoose from "mongoose";

const fineSchema = new mongoose.Schema({
  vehicleNo: String,
  documentNo: String,
  receiptNumber: String,
  issueDate: String,
  article: String,
  amount: String,
  status: String,
});

const policeFinesSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true },
  documentNo: { type: String, required: true },
  fines: [fineSchema],
});

const PoliceFines = mongoose.model("PoliceFines", policeFinesSchema);

export default PoliceFines;
