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
import { error } from "console";
import {register} from "./controllers/auth.js"

//#USE 'nodemon run' to run server

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




/*MONGOOSE SETUP*/

const PORT = process.env.PORT || 6001;  //if it doesn't work got to port 6001
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));

/*Authentication VS Authorization
//*Authentication is basically registering and login
//*Authorization is making sure someone is logged in to perform certain operations

*/ 
