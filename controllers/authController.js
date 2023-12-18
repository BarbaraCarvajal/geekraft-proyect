import { comparePassword, hashAnswer, hashPassword, compareAnswer } from "./../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";


//REGISTRO NUEVO USUARIO
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer, ask } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "El nombre es requerido" });
    }
    if (!email) {
      return res.send({ message: "El email es requerido" });
    }
    if (!password) {
      return res.send({ message: "La contraseña es requerida" });
    }
    if (!phone) {
      return res.send({ message: "El telefono es requerido" });
    }
    if (!address) {
      return res.send({ message: "La dirección es requerida" });
    }
    if (!ask) {
      return res.send({ message: "La pregunta de seguridad es requerida" });
    }
    if (!answer) {
      return res.send({ message: "La respuesta de seguridad es requerida" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Usuario ya registrado, por favor inicie sesión",
      });
    }
    //encriptar contraseña
    const hashedPassword = await hashPassword(password);
    //encriptar respuesta
    const hashedAnswer = await hashAnswer(answer);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      ask,
      answer: hashedAnswer,
    }).save();

    res.status(201).send({
      success: true,
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error en registro de usuario",
      error,
    });
  }
};

//INICIO DE SESIÓN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Correo o contraseña invalidos",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email no registrado",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Contraseña incorrecta",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error en inicio de sesión",
      error,
    });
  }
};

//POST FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Correo requerido" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "Nueva contraseña es requerida" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Respuesta de seguridad es requerida" });
    }
    // Verificar usuario
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar respuesta de seguridad
    const isAnswerMatch = await compareAnswer(answer, user.answer);
    if (!isAnswerMatch) {
      return res.status(401).send({
        success: false,
        message: "Respuesta de seguridad incorrecta",
      });
    }

    // Si la respuesta de seguridad es correcta, actualizar la contraseña
    const hashedNewPassword = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashedNewPassword });

    res.status(200).send({
      success: true,
      message: "Contraseña actualizada con éxito",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error en el proceso de cambio de contraseña",
      error,
    });
  }
};



//UPDATE PROFILE
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({
        error: "La contraseña es requerida y debe tener al menos 6 caracteres",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        phone: phone || user.phone,
        address: address || user.address,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Perfil actualizado satisfactoriamente 😄",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error en actualizar perfil",
      error,
    });
  }
};

//GET ORDERS
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error mientras se obtienen las ordenes de compra",
      error,
    });
  }
};

//GET todos los pedidos
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error mientras se obtienen las ordenes de compra",
      error,
    });
  }
};

//UPDATE orden de compra estado
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al actualizar el estado de la orden",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
