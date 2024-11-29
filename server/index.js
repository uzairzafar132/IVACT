require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
var nodemailer = require("nodemailer");

// database connection
connection();

app.use(cors());

app.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  next();
});

//use cors to allow cross origin resource sharing

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);


app.use("api/data", (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let name = req.body.name;
  let message = req.body.message;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jfazil72@gmail.com",
      pass: "xjwqzfvpboiqgjzi",
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: name,
    text: message,
    name,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent for Report: " + info.response);
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
