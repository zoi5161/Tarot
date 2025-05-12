import { Request, Response } from 'express';
import { registerAdmin } from '../services/AdminService';
import AdminModel from '../models/AdminModel';
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';

export const registerAdminController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const admin = await registerAdmin(username, password);
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const loginAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await AdminModel.findOne({ username });

    if (!admin) {
      // Admin not found
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      // If the passwords don't match, send a failure message
      res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
      return;
    }

    // If the password matches, respond with a success message
    res.json({ message: 'Đăng nhập thành công!' });

  } catch (error) {
    next(error);
  }
};