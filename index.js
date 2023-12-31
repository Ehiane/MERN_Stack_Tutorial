import express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import {register} from "./controllers/auth.js"
import {createPost} from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users, posts} from "./data/index.js";


//#USE 'nodemon run' to run server

/*
$ "async"- 
*    this is a function that is used for process or computations that may take time to complete.
*   they perform tasks in the background without blocking the execution of the rest of your code.
*   mostly used in network requests, file reading or timers; without freezing the entire program.

$ "status codes"
* 404- generic request error
* 409- generic post/creation error
* 200-  successful request
* 201-  successful creation

*/ 


/* CONFIGURATIONS --middleware(functions that run inbetween request)*/

const __filename = fileURLToPath(import.meta.url); //to use module
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); //sets the directory of our images in a remote place.

/* FILE STORAGE CONFIGURATIONS*/

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets")
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const upload = multer({storage})

/* ROUTES  WITH FILES */ 
/*middle ware Funct*/ 
app.post("/auth/register", upload.single("picture"), register) //all the uploaded pictures will be locally uploaded to 'public/assests'
app.post("/posts", verifyToken, upload.single("picture"), createPost) 

/*ROUTES*/ 
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);


/*MONGOOSE SETUP*/

const PORT = process.env.PORT || 6001;  //if it doesn't work got to port 6001
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // manually injecting dummy data
    /*ADD DATA ONE TIME*/ 
    // User.insertMany(users);
    // Post.insertMany(posts);


}).catch((error) => console.log(`${error} did not connect`));

/*Authentication VS Authorization
//*Authentication is basically registering and login
//*Authorization is making sure someone is logged in to perform certain operations

*/ 
