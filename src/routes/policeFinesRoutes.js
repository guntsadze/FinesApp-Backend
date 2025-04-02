import { Router } from "express";
import getPoliceFines from "../controllers/policeFinesController.js";
import { CRUDService } from "../services/crudService.js";
import { CRUDController } from "../controllers/crudController.js";
import PoliceFines from "../models/policeFinesModel.js";
import PoliceFinesCarInfo from "../models/policeFinesCarInfoModel.js";

const router = Router();

const policeFinesService = new CRUDService(PoliceFines);
const policeFinesController = new CRUDController(policeFinesService);

router.post("/policeCheckFines", getPoliceFines);

router.post("/policeFines/create", policeFinesController.create);
router.get("/policeFines/getList", policeFinesController.getList);
router.get("/policeFines/get/:id", policeFinesController.get);
router.put("/policeFines/update/:id", policeFinesController.update);
router.delete("/policeFines/delete/:id", policeFinesController.delete);

const policeFinesCarInfoService = new CRUDService(PoliceFinesCarInfo);
const policeFinesCarInfoController = new CRUDController(
  policeFinesCarInfoService
);

router.post("/PoliceFinesCarInfo/create", policeFinesCarInfoController.create);
router.get("/PoliceFinesCarInfo/getList", policeFinesCarInfoController.getList);
router.get("/PoliceFinesCarInfo/get/:id", policeFinesCarInfoController.get);
router.put(
  "/PoliceFinesCarInfo/update/:id",
  policeFinesCarInfoController.update
);
router.delete(
  "/PoliceFinesCarInfo/delete/:id",
  policeFinesCarInfoController.delete
);

export default router;
