import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    // Asegúrate de que MONGO_URL está definida en tus variables de entorno
    if (!process.env.MONGO_URL) {
      console.error('La URL de la base de datos MongoDB no está definida en las variables de entorno.'.red.bold);
      process.exit(1);
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Puedes agregar más opciones de configuración aquí si es necesario
    };

    const conexion = await mongoose.connect(process.env.MONGO_URL, options);
    console.log(`MongoDB conectado: ${conexion.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error al conectarse a la base de datos: ${error.message}`.red.underline.bold);
    process.exit(1); // Cierra el proceso con un estado de error
  }
};

export default connectDB;
