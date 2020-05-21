const express = require("express");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const env = require("dotenv");
const helmet = require("helmet");
const mongoSanatize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const userRoutes = require("./Routes/userRoutes");
const authRoutes = require("./Routes/authRoutes");
const postRoutes = require("./Routes/postRoutes");
const postLikesRoute = require("./Routes/postLikesRoute");
const postCommentRoutes = require("./Routes/postCommentRoutes");
const ErrorHandler = require("./Controller/errorController");

env.config(__dirname + "../.dotenv");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser(`${process.env.COOKIE_KEY}`));
app.use(helmet());
app.use(mongoSanatize());
app.use(xss());
app.use(hpp());

//->------------------------------------------------------------------>//
//->-------- Handling the application routes and middlewares --------->//
//->------------------------------------------------------------------>//

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/like", postLikesRoute);
app.use("/api/comment", postCommentRoutes);

//->---------------------------------------------------->//
//->-------- Server and Database Configuration --------->//
//->---------------------------------------------------->//

//->Error Handling Middleware
app.use(ErrorHandler);

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  const server = app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });

  //->Database Connection Handler
  mongoose
    .connect(`${process.env.ATLAS_DATABASE_CONNECTION}`, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Connection to the database Successfull!");
    })
    .catch(err => {
      console.log(err);
    });

  process.on("unhandledRejection", err => {
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}
start();
