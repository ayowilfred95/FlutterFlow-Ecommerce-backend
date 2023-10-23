import express from "express";
import { registerAdmin, loginAdmin, authorizedAdmin, resetPassword } from '../controllers/adminController';

const router = express.Router();

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/password/reset').post(authorizedAdmin,resetPassword);

export default router;



