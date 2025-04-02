import mongoose from "mongoose";

const parkingFinesCarInfoSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true },
  companyCode: { type: String, required: true },
});

const ParkingFinesCarInfo = mongoose.model(
  "ParkingFinesCarInfo",
  parkingFinesCarInfoSchema
);

export default ParkingFinesCarInfo;
