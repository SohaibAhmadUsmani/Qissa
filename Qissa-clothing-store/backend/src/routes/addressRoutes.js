import express from "express";

import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "../validations/address.validation.js";

const router = express.Router();

router.use(protect);

router.post("/", validate(createAddressSchema), createAddress);

router.get("/", getAddresses);

router.get("/:id", getAddressById);

router.put("/:id", validate(updateAddressSchema), updateAddress);

router.put("/:id/default", setDefaultAddress);

router.delete("/:id", deleteAddress);

export default router;
