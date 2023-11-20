import express from "express";
import {
  forgotPasswordController,
  getAllOrdersController,
  getOrdersController,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
import {
  isAdmin,
  isAssistant,
  requireSignIn,
} from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || POST
router.post("/register", registerController);

//LOGIN POST
router.post("/login", loginController);

//Forgot Password POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Verificación de autenticación de asistente
router.get("/assistant-auth", requireSignIn, isAssistant, (req, res) => {
  res.status(200).send({ ok: true });
});

//Actualizar perfil
router.put("/profile", requireSignIn, updateProfileController);

//ordenes de compra
router.get("/orders", requireSignIn, getOrdersController);

//todas las ordenes de compra
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//actualizar orden de compra
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
