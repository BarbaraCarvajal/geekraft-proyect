import blogModel from "../models/blogModel.js";
import slugify from "slugify";
import fs from "fs";

//CRAR POST
export const createPostController = async (req, res) => {
  try {
    const { title, slug, content } = req.fields;
    const { photo } = req.files;

    // Validaciones
    if (!title) {
      return res.status(400).send({ error: "El título es obligatorio" });
    }
    if (!content) {
      return res.status(400).send({ error: "El contenido es obligatorio" });
    }
    if (!photo) {
      return res.status(400).send({ error: "La imagen es obligatoria" });
    }

    const post = new blogModel({ ...req.fields, slug: slugify(title) });
    if (photo) {
      post.photo.data = fs.readFileSync(photo.path);
      post.photo.contentType = photo.type;
    }
    await post.save();
    res.status(201).send({
      success: true,
      post,
      message: "Post creado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al crear el post",
    });
  }
};

//OBTENER TODOS LOS POSTS
export const getPostController = async (req, res) => {
  try {
    const posts = await blogModel
      .find({})
      .populate("title")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Posts obtenidos correctamente",
      total: posts.length,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener los posts",
      error: error.message,
    });
  }
};

//OBTENER UN POST
export const getSinglePostController = async (req, res) => {
  try {
    const post = await blogModel
      .findOne({ slug: req.params.slug })
      .populate("title")
      .select("-photo");
    res.status(200).send({
      success: true,
      post,
      message: "Post obtenido correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      post,
      message: "Error al obtener el post",
    });
  }
};

//OBTENER FOTO DEL POST
export const postPhotoController = async (req, res) => {
  try {
    const post = await blogModel.findById(req.params.pid).select("photo");
    if (post.photo.data) {
      res.set("Content-Type", post.photo.contentType);
      return res.status(200).send(post.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener la foto del post",
    });
  }
};

//ElIMINAR POST
export const deletePostController = async (req, res) => {
  try {
    await blogModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Post eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al eliminar el post",
    });
  }
};

//ACTUALIZAR POST
export const updatePostController = async (req, res) => {
  try {
    const { title, content } = req.fields;
    const { photo } = req.files;

    // Validaciones
    switch(true) {
      case !title:
        return res.status(400).send({ error: "El título es obligatorio" });
      case !content:
        return res.status(400).send({ error: "El contenido es obligatorio" });
      case photo:
        return res.status(400).send({ error: "Adjuntar imagen válida" });
    }

    const post = await blogModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(title) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await post.save();
    res.status(200).send({
      success: true,
      message: "Post actualizado correctamente",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al actualizar el post",
    });
  }
};

