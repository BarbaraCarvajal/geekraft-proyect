import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import productsRoutes from "./routes/productRoutes.js";
import blogpostrouter from "./routes/blogPostRoute.js";
import authRoutes from "./routes/authRoute.js";
import path from "path";
import { fileURLToPath } from 'url';

//config dotenv
dotenv.config();

//database config
connectDB();

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productsRoutes);
app.use("/api/v1/blog", blogpostrouter);
app.use(express.static(path.join(__dirname, "/client/build")));


//rest api
app.use('*', function(req,res){
  res.sendFile(path.join(__dirname, './client/build/index.html'))

}) 

/* app.get("/", (req, res) => {
  res.send({
    message: "Bienvenidos a Geekraft API",
  });
});  */

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `El servidor esta corriendo en ${process.env.DEV_MODE} mode en el puerto ${PORT}`
      .bgMagenta
  );
});
