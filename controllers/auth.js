import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/*REGISTER USER*/
// any call to mongoDB needs to be asynchronous 
// basically an API call that you use from frontend - backend - backend - database 
// req- request, res - response. very similar to GET & POST
export const register = async(req, res) => {
    try{
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        //encrypting the password 
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        // creating a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        // sending the user info as a status code, then displaying in the db as a json
        res.status(201).json(savedUser);
    }catch (err){
        // when smth goes wrong
        res.status(500).json({error: err.message })
    }
};


/*LOGGING IN*/ 
export const login = async(req, res) =>{
    try{
        const {email, password} = req.body; //grabbing email and pswrd when user tries to login
        const user = await User.findOne({email: email}); //using mongoose to find the one with this specified email
        if(!user) return res.status(400).json({msg: "User does not exist."})

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: "Invalid credentials."})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET); //if the passwords match generate a JSON WEB TOKEN to authenticate the user.
        delete user.password; //deleting for security
        res.status(200).json({token, user});

    }catch(err){
        res.status(500).json({error: err.message })
    }
}