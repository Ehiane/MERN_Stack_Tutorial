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
}