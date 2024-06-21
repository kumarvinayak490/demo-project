import mongoose from "mongoose";
import config from "../config";

mongoose.connection.on("connected", () => {
  console.log("MongoDB is connected");
});

mongoose.connection.on("error", (err) => {
  console.log(`Could not connect to MongoDB because of ${err}`);
  process.exit(1);
});

export default async function () {
  if (config.env === "dev") {
    mongoose.set("debug", true);
  }

  var mongoURI = config.mongo.dev;
  await mongoose.connect(mongoURI);
  mongoose.set("autoIndex", true);
  return mongoose.connection;
}
