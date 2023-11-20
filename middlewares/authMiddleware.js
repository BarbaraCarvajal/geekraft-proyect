import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// Admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      const error = new Error("Acceso no autorizado");
      error.status = 401;
      next(error); // Pasamos el error al siguiente middleware
    } else {
      next();
    }
  } catch (error) {
    next(error); // Pasamos cualquier error de servidor al siguiente middleware
  }
};

// Assistant access
export const isAssistant = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 2) {
      const error = new Error("Acceso no autorizado");
      error.status = 401;
      next(error); // Pasamos el error al siguiente middleware
    } else {
      next();
    }
  } catch (error) {
    next(error); // Pasamos cualquier error de servidor al siguiente middleware
  }
};


// Verificación de autenticación de administrador o asistente
export const allowAdminOrAssistant = [
  requireSignIn, 
  (req, res, next) => {
    isAdmin(req, res, (adminErr) => {
      if (adminErr) {
        // Si isAdmin falla, intentamos con isAssistant
        isAssistant(req, res, next);
      } else {
        // Si isAdmin pasa, seguimos adelante
        next();
      }
    });
  }
];

