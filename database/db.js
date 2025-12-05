import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://giordana:admin@trama1.mk7b1sf.mongodb.net/?appName=trama1"
      )
      .then(() => {
        console.log("MongoDb Atlas CONECTADO!");
      });
  } catch (error) {
    console.error("Erro ao conectar:", error);
    process.exit(1);
  }
};

export default connectToDb;
