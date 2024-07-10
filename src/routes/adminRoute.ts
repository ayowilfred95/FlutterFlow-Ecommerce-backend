import express from "express";
import { registerAdmin, loginAdmin, authorizedAdmin, resetAdminPassword } from '../controllers';


const router = express.Router();

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/password/reset').post(authorizedAdmin,resetAdminPassword);

export default router;



