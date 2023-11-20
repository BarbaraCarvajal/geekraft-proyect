import express from "express";
import {
  allowAdminOrAssistant,
  isAdmin,
  requireSignIn,
} from "../middlewares/authMiddleware.js";
import {
  categoryControlller,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//routes

// Crear categoría - Permitido para Admin y Asistente
router.post(
  "/create-category",
  allowAdminOrAssistant,
  createCategoryController
);

// Actualizar categoría - Permitido para Admin y Asistente
router.put(
  "/update-category/:id",
  allowAdminOrAssistant,
  updateCategoryController
);

// Eliminar categoría - Permitido para Admin y Asistente
router.delete(
  "/delete-category/:id",
  allowAdminOrAssistant,
  deleteCategoryController
);

//obtener todas las categorias
router.get("/get-category", categoryControlller);

//obtener una categoria
router.get("/single-category/:slug", singleCategoryController);

export default router;
