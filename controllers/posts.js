import Post from "../models/Post.js";
import User from "../models/User.js";




/*CREATE*/
export const createPost = async (req, res) => {
    try{

        const {userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        // saving the post to the db
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await  newPost.save();
        // this grabs all the posts and returns it to the frontend.
        const post = await Post.find();
        res.status(201).json(post);

    }catch(err){
        res.status(409).json({message: err.message})
    }
}


/*READ*/
export const getFeedPosts = async (req, res) =>{
    try{

        // this grabs all the posts and returns it to the frontend.
        const post = await Post.find();
        res.status(201).json(post);
    }catch(err){
        res.status(404).json({message: err.message})
    }
} 

export const getUserPosts = async (req, res) =>{
    try{
        const {userId} = req.params;

        const post = await Post.find({ userId });
        // this grabs all the posts and returns it to the frontend.
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message: err.message})
    }

}

/*UPDATE*/ 
export const likePost = async (req, res) => {
    try{
        const {id} = req.params; //grabbing the relevant post
        const {userId} = req.body;
        const post = await Post.findById(id); //grabbing post info
        const isLiked = post.likes.get(userId); //grabbing whether is liked or not

        if (isLiked){
            post.likes.delete(userId); //delete the user
        }else{
            post.likes.set(userId,true); //set the likes
        }


        const updatedPost = await Post.findByIdAndUpdate(
            id, //finding it first
            {likes: post.likes}, //updating the post
            {new: true}
        );

        res.status(200).json(updatedPost); //updating the frontend.

    }catch(err){
        res.status(404).json({message: err.message})
    }

}