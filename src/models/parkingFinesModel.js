import mongoose from "mongoose";

const parkingFineSchema = new mongoose.Schema({
  createDate: String,
  fineNumber: String,
  payAmount: String,
  status: String,
});

const parkingFinesSchema = new mongoose.Schema({
  vehicles: { type: String, required: true },
  parkingFines: [parkingFineSchema],
});

const ParkingFines = mongoose.model("ParkingFines", parkingFinesSchema);

export default ParkingFines;
