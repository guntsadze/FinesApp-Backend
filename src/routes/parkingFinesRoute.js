import { Router } from "express";
import { getParkingFines } from "../controllers/parkingFinesController.js";
import ParkingFines from "../models/parkingFinesModel.js";
import { CRUDService } from "../services/crudService.js";
import { CRUDController } from "../controllers/crudController.js";
import ParkingFinesCarInfo from "../models/parkingFinesCarInfoModel.js";

const router = Router();

const parkingFinesService = new CRUDService(ParkingFines);
const parkingFinesController = new CRUDController(parkingFinesService);

router.post("/ParkingFines/create", parkingFinesController.create);
router.get("/ParkingFines/getList", parkingFinesController.getList);
router.get("/ParkingFines/get/:id", parkingFinesController.get);
router.put("/ParkingFines/update/:id", parkingFinesController.update);
router.delete("/ParkingFines/delete/:id", parkingFinesController.delete);

router.post("/parkingCheckFines", getParkingFines);

const parkingFinesCarInfoService = new CRUDService(ParkingFinesCarInfo);
const parkingFinesCarInfoController = new CRUDController(
  parkingFinesCarInfoService
);

router.post(
  "/ParkingFinesCarInfo/create",
  parkingFinesCarInfoController.create
);
router.get(
  "/ParkingFinesCarInfo/getList",
  parkingFinesCarInfoController.getList
);
router.get("/ParkingFinesCarInfo/get/:id", parkingFinesCarInfoController.get);
router.put(
  "/ParkingFinesCarInfo/update/:id",
  parkingFinesCarInfoController.update
);
router.delete(
  "/ParkingFinesCarInfo/delete/:id",
  parkingFinesCarInfoController.delete
);

export default router;
