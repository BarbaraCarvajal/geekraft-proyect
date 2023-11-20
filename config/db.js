import mongoose from 'mongoose'
import colors from 'colors'

const connectDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URL)
    console.log(`MongoDB conectado: ${conexion.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.log(`Error al conectarse a la base de datos: ${error.message}`.red.underline.bold);
  }
}

export default connectDB;