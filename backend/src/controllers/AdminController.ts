import { Request, Response } from 'express';
import { registerAdmin } from '../services/AdminService';
import { loginAdmin } from '../services/AdminService';
import bcrypt from 'bcryptjs/umd/types';

export const registerAdminController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const admin = await registerAdmin(username, password);
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};