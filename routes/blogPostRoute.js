import express from "express";
import {
  allowAdminOrAssistant,
  requireSignIn,
} from "../middlewares/authMiddleware.js";
import { createPostController, deletePostController, getPostController, getSinglePostController, postPhotoController, updatePostController } from "../controllers/blogPostController.js";
import formidable from 'express-formidable';

const router = express.Router();

//CREAT POST
router.post(
  "/blog-create-post",
  requireSignIn,
  allowAdminOrAssistant,
  formidable(),
  createPostController
);

//ACTUALIZAR POST
router.put(
  "/blog-update-post/:pid",
  requireSignIn,
  allowAdminOrAssistant,
  formidable(),
  updatePostController
);

//ELIMINAR POST
router.delete(
  "/blog-delete-post/:pid",
  requireSignIn,
  allowAdminOrAssistant,
  formidable(),
  deletePostController
);

//OBTENER POSTS
router.get("/blog-get-posts", getPostController);

//OBTENER POST UNITARIO
router.get("/blog-get-posts/:slug", getSinglePostController);

//OBTENER FOTO DE POST
router.get("/blog-post-photo/:pid", postPhotoController);


export default router;
