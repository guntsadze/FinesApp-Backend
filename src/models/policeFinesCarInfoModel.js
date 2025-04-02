import mongoose from "mongoose";

const policeFinesCarInfoSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true },
  documentNo: { type: String, required: true },
});

const PoliceFinesCarInfo = mongoose.model(
  "PoliceFinesCarInfo",
  policeFinesCarInfoSchema
);

export default PoliceFinesCarInfo;
