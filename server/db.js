

const mongoose = require("mongoose");

const password = "uzair00125";


//PORJECTLEARN

const Connection = async () => {
  const URL = `mongodb://uzair00:${password}@cluster0-shard-00-00.jmjbv.mongodb.net:27017,cluster0-shard-00-01.jmjbv.mongodb.net:27017,cluster0-shard-00-02.jmjbv.mongodb.net:27017/fyp?ssl=true&replicaSet=atlas-zhqyxd-shard-0&authSource=admin&retryWrites=true&w=majority`;
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting to the database ", error);
  }
};

module.exports = Connection;
