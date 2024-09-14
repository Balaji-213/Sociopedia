import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import oauthRouters from "./routes/oauth.js";
import requestRouters from "./routes/request.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { updateUser } from "./controllers/users.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// import cookieSession from 'cookie-session';
// import passport from 'passport';
// import './config/passport-setup.js';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json({limit:'10mb'}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: 'https://sociopedia-gamma-jade.vercel.app'
}));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// app.use(cookieSession({
//   maxAge: 24 * 60 * 60 * 1000, // 1 day
//   keys: [process.env.COOKIE_KEY]
// }));

// app.use(passport.initialize());
// app.use(passport.session());

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const upload2 = multer({
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 10 * 1024 * 1024, // Max field value size in bytes (here set to 2MB)
  }
});

app.get("/", (req, res) => {
  res.send("Hi Admin");
});

/* ROUTES WITH FILES */
app.post("/auth/register",upload2.any(), register);
app.post("/posts", verifyToken, upload2.any(), createPost);


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use('/oauth', oauthRouters);
app.use('/request', requestRouters);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));



