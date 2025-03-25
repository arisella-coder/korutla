//routes/auth.js
import express from 'express';
import { register, login, verifyOTP, resendOTP, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
    }
);

export default router;
