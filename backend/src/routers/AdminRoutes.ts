import express, { Request, Response } from 'express';
import { registerAdminController } from '../controllers/AdminController';
import bcrypt from 'bcryptjs';
import AdminModel from '../models/AdminModel';

const router = express.Router();

router.post('/register', registerAdminController);


export default router;