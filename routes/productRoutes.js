import express from "express";
import {
  allowAdminOrAssistant,
  isAdmin,
  requireSignIn,
} from "../middlewares/authMiddleware.js";
import {
  baintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes

//crear producto
router.post(
  "/create-product",
  requireSignIn,
  allowAdminOrAssistant,
  formidable(),
  createProductController
);

//actualizar producto
router.put(
  "/update-product/:pid",
  requireSignIn,
  allowAdminOrAssistant,
  formidable(),
  updateProductController
);

//eliminar producto
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  allowAdminOrAssistant,
  deleteProductController
);

//obtener productos
router.get("/get-product", getProductController);

//obtener producto unitario
router.get("/get-product/:slug", getSingleProductController);

//obtener foto del producto
router.get("/product-photo/:pid", productPhotoController);

//Filtrar producto
router.post("/product-filters", productFiltersController);

//productos cuenta
router.get("/product-count", productCountController);

//productos por página
router.get("/product-list/:page", productListController);

//buscador de productos
router.get("/search/:keyword", searchProductController);

//productos similares
router.get("/related-products/:pid/:cid", relatedProductController);

//categorias
router.get("/product-category/:slug", productCategoryController);

//Pagos routes
//Token
router.get("/braintree/token", braintreeTokenController);

//pagos
router.post("/braintree/payment", requireSignIn, baintreePaymentController);

export default router;
