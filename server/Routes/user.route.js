import express from 'express';
import {login, register,verifyOtp,logout} from '../Controllers/user.controller.js';
const router = express.Router();

router.route('/register').post(register);
router.route('/verifyotp/:id').post(verifyOtp);
router.route('/login').post(login);
router.route('/logout').post(logout);
export default router;