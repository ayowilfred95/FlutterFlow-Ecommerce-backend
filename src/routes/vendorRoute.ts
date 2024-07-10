import express, {Express,Request,Response} from "express";
import{registerVendor,loginVendor,resetVendorPassword,deleteVendorById,vendorByProduct, getAllVendors, getVendorById  } from "../controllers"
import{ authorizedAdmin} from "../controllers/adminController";
// import isCached from "../middlewares/cacheMiddleware";
const router = express.Router();

router.route('/').post(authorizedAdmin,registerVendor)
router.route('/login').post(loginVendor)
router.route('/password/reset').post(resetVendorPassword)
router.route('/product/:id').get(authorizedAdmin,vendorByProduct)
router.route('/delete/:id').delete(authorizedAdmin,deleteVendorById )
router.route('/').get(authorizedAdmin,getAllVendors)
router.route("/:id").get(getVendorById)

export default router;
