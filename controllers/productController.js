import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

//pagos gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//Crear producto
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //validación

    if (!name) {
      return res.status(400).send({ error: "El nombre es requerido" });
    }
    if (!description) {
      return res.status(400).send({ error: "La descripción es requerida" });
    }
    if (!price) {
      return res.status(400).send({ error: "El precio es requerido" });
    }
    if (!category) {
      return res.status(400).send({ error: "La categoria es requerida" });
    }
    if (!quantity) {
      return res.status(400).send({ error: "La cantidad es requerida" });
    }
    if (!photo) {
      return res.status(400).send({ error: "La imagen es obligatoria" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      products,
      message: "Producto creado exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al crear el producto",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category', 'name')
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Productos obtenidos exitosamente",
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

//obtener producto unitario
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category", "name")
      .select("-photo");
    res.status(200).send({
      success: true,
      product,
      message: "Producto obtenido exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al obtener el producto",
    });
  }
};

//obtener foto del producto
// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    // Verificar si el producto existe
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Producto no encontrado",
      });
    }

    // Verificar si el producto tiene una foto
    if (product.photo && product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Foto del producto no disponible",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener la foto del producto",
      error,
    });
  }
};


//eliminar producto
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al eliminar el producto",
      error,
    });
  }
};

//upate producto
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Nombre del producto es requerido" });
      case !description:
        return res.status(400).send({ error: "La descripción es requerida" });
      case !price:
        return res.status(400).send({ error: "El precio del producto es requerido" });
      case !category:
        return res.status(400).send({ error: "La categoría es requerida" });
      case !quantity:
        return res.status(400).send({ error: "La cantidad es requerida" });
      case photo:
        return res
          .status(400)
          .send({ error: "Foto es requerida" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Producto actualizado exitosamente",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error en la actualización del producto",
    });
  }
};

//filtrar productos
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al filtrar los productos",
      error,
    });
  }
};

//productos cuenta
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al obtener el total de productos",
      error,
    });
  }
};

//productos por página
export const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al obtener el total de productos",
      error,
    });
  }
};

//buscador de productos
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al buscar productos",
      error,
    });
  }
};

//productos similares
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al obtener productos similares",
      error,
    });
  }
};

// obtener productos por categoria
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//pago gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener el token",
      error,
    });
  }
};

//Pago

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = cart.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

    // Validar stock antes de procesar el pago
    for (const item of cart) {
      const product = await productModel.findById(item._id);
      if (!product || product.quantity < item.cartQuantity) {
        return res.status(400).json({
          success: false,
          message: `No hay suficiente stock para el producto: ${product.name}`
        });
      }
    }

    let newTransaction = gateway.transaction.sale(
      {
        amount: total.toString(),
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (error) {
          return res.status(500).send({
            success: false,
            message: "Error al realizar el pago",
            error,
          });
        }

        if (result.success) {
          const order = new orderModel({
            products: cart.map(item => ({
              product: item._id,
              quantity: item.cartQuantity
            })),
            payment: result.transaction,
            buyer: req.user._id,
            status: 'No procesado'
          });

          await order.save();

          // Actualizar el stock de cada producto
          for (const item of cart) {
            await productModel.findByIdAndUpdate(item._id, {
              $inc: { quantity: -item.cartQuantity }
            });
          }

          return res.status(201).json({ ok: true, order });
        } else {
          return res.status(500).send({
            success: false,
            message: "Error al procesar la transacción de pago",
            error: result.message,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error al realizar el pago",
      error,
    });
  }
};

//productos por categoria
export const productCountByCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    const categoryCounts = await Promise.all(categories.map(async (category) => {
      const count = await productModel.countDocuments({ category: category._id });
      return { category: category.name, count };
    }));
    
    res.status(200).send({
      success: true,
      categoryCounts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener el total de productos por categoría",
      error,
    });
  }
};