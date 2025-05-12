import express, { Request, Response } from 'express';
import { registerAdminController, loginAdminController } from '../controllers/AdminController';

const router = express.Router();

router.post('/register', registerAdminController);
router.post('/login', loginAdminController);

export default router;