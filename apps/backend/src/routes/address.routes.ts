import { Router } from "express";
import { AddressController } from "../controllers/address.controller";
import { validate } from "../middlewares/validate.middleware";
import { createAddressSchema, updateAddressSchema } from "../schemas/address.schema";

/**
 * Mounted at `/api/users/:userId/addresses`
 * Auth is enforced at the parent user.routes level.
 */
const router = Router({ mergeParams: true });

router.get("/", AddressController.getMyAddresses);
router.post("/", validate(createAddressSchema), AddressController.addAddress);
router.put("/:id", validate(updateAddressSchema), AddressController.updateAddress);
router.delete("/:id", AddressController.deleteAddress);
router.patch("/:id/default", AddressController.setDefaultAddress);

export default router;
