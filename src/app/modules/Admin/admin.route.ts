import express from "express";
import { AdminController } from "./admin.controller";
const router = express.Router();

router.get("/", AdminController.getAllFromDb);
router.get("/:id", AdminController.getByIdFromDb);
router.patch("/:id", AdminController.updateIntoDb);
router.delete("/:id", AdminController.deleteFromDb);
router.delete("/soft/:id", AdminController.softDeleteFromDb);

export const adminRoutes = router;
