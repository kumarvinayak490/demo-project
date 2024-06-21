import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("No .env file found");
}

export default {
  port: parseInt(process.env.PORT, 10),
  logs:{
    morgan:process.env.MORGAN
  },
  secret: process.env.SECRET,
  env:process.env.NODE_ENV || 'dev',
  mongo:{
    dev:process.env.MONGO_URI,
    
  }
};
