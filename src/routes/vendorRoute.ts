import express, {Express,Request,Response} from "express";
import{registerVendor,loginVendor,resetPassword,deleteVendorById,vendorByProduct  } from "../controllers/vendorController"
import{authorizedAdmin} from "../controllers/adminController";
const router = express.Router();

router.route('/').post(authorizedAdmin,registerVendor)
router.route('/login').post(loginVendor)
router.route('/password/reset').post(resetPassword)
router.route('/product/:id').get(authorizedAdmin,vendorByProduct)
router.route('/delete/:id').delete(authorizedAdmin,deleteVendorById )

export default router;
