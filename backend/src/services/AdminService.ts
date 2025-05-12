import AdminModel from '../models/AdminModel';
import bcrypt from 'bcryptjs';

export const registerAdmin = async (username: string, password: string) => {
  // Kiểm tra xem quản trị viên đã tồn tại chưa
  const existingAdmin = await AdminModel.findOne({ username });
  if (existingAdmin) {
    throw new Error('Username already exists!');
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Tạo mới quản trị viên
  const newAdmin = new AdminModel({
    username,
    password: hashedPassword,
  });

  await newAdmin.save();

  return newAdmin;
};