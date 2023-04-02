import express from "express";
import { create, getAll, remove, update, get } from "../controllers/category";
import { checkPermission } from "../middlewares/checkPermission";
const router = express.Router();

router.post("/categories",checkPermission, create)
router.get("/categories/", getAll)
router.get("/categories/:id", get)
router.put("/categories/:id",checkPermission, update)
router.delete("/categories/:id",checkPermission, remove)



export default router;