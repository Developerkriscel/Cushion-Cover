import express from "express";
import { addAddress, deleteAddress, getAddresses, setDefaultAddress, updateAddress } from "../controllers/userController.js";
import { changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.put("/password", changePassword);
router.route("/addresses").get(getAddresses).post(addAddress);
router.put("/addresses/:id/default", setDefaultAddress);
router.route("/addresses/:id").put(updateAddress).delete(deleteAddress);

export default router;
