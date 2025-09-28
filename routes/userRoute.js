// userRoute.js - Adicione estas rotas
import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  changeAdminCredentials,
  registerAdmin,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const userRoute = express.Router();

// Rotas públicas
userRoute.post("/register", adminAuth, registerUser);
userRoute.post("/login", adminAuth, loginUser);

// Rotas de administrador
userRoute.post("/admin", adminAuth, adminLogin);
userRoute.post("/register-admin", adminAuth, registerAdmin);
userRoute.post("/change-credentials", adminAuth, changeAdminCredentials);
userRoute.post('/admin/register', adminAuth, registerUser);
// NOVAS ROTAS PARA GERENCIAMENTO DE USUÁRIOS (apenas admin)
userRoute.get("/admin/users", adminAuth, getAllUsers);
userRoute.get("/admin/users/:id", adminAuth, getUserById);
userRoute.put("/admin/users/:id", adminAuth, updateUser);
userRoute.delete("/admin/users/:id", adminAuth, deleteUser);
userRoute.put("/admin/users/:id/password", adminAuth, updateUserPassword);

export default userRoute;
