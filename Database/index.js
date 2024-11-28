// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://mahektek63:@cluster0.bt4m70j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const User = require('./Models/Users')
const Post = require('./Models/Posts');
const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/Social-Point";
// const databaseName = "Social-Point";
// const collectionName = "Users";
const port = 3000;

const app = express();

app.use(cors({ origin: "http://localhost:3001" }));
app.use(cors())
app.use(bodyParser.json());

// const client = new MongoClient(uri)
mongoose.connect(uri).catch((err) => console.log(err))


// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // try {
// // await client.connect();
// //     // Send a ping to confirm a successful connection
// //     const database = client.db(databaseName);
// //     const data = database.collection("userData")
// //     const document = await data.find().toArray()
// // } finally {
//         // Ensures that the client will close when you finish/error
//         // await client.close();
// // }

// app.get('/', (req, res) => {
// })

// app.listen(port, () => {
//     console.log('SERVER STARTED...');
// })



// const {MongoClient} = require('mongodb');
// const express = require('express');
// const bodyParser = require('body-parser');
// // const path = require("path")

// const app = express()
// const port = 3000

// const url = "mongodb://localhost:27017"

// const client = new MongoClient(url)

app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "frontEnd", "build")));
    res.sendFile(path.resolve(__dirname, "frontEnd", "build", "index.html"));
});

// done
app.post("/Regi", async (req, res) => {
    const name = req.body.name
    const Password = req.body.Password
    const Question = req.body.Que
    const Answer = req.body.Ans

    try {
        const document = await User.find()
        
        if (document.length > 0) {
            document.forEach((ele) => {
                if (ele.name == name) {
                    res.json({ message: "User already exists" })
                }
            })
        }
        
        
        const user = User({name, Password, Question, Answer, Post: []})
        const new_user = await user.save()
        console.log(new_user)
        res.json({ message: "Data inserted", UID: _id })


    } catch (error) {
        console.log(error);
    } finally {
    }
})

// done
app.post("/login", async (req, res) => {
    const name = req.body.name
    const Password = req.body.Password

    try {
        const document = await User.findOne({ name: name })
        if(document){
                if (document.name == name && document.Password == Password) {
                    res.json({ message: "Logged In", Que: document.Question, Ans: document.Answer, UID: document._id })
                }
        } else {   
            res.json({ message: "User Not Found" })
        }

    } catch (error) {
    } finally {
    }
})

// done
app.post("/ImgPost", async (req, res) => {
    const image = req.body.Image
    const name = req.body.Name
    const caption = req.body.caption

    try {
        // await client.connect()
        // const database = client.db(databaseName)
        // const data = database.collection(collectionName)
        const callForUserID = await User.findOne({"name": name})
        const Auther = callForUserID._id;


        const post = Post({"Image":image, "Caption":caption, "Auther":Auther})
        const document = await post.save()

        const PostID = document._id;

        const document2 = await User.updateOne({ name: name },
            {
                $push: { Posts: PostID }
            }
        )

        res.json({ message: "Inserted" })


    } catch (error) {
        console.log(error);
    } finally {
        // client.close()
    }
})

// done
app.post("/ImgBack", async (req, res) => {

    try {
        const posts = await Post.find()
        let arr = []
        for (const post of posts) {
            const user = await User.findOne({ _id: post.Auther });
            if (user) {
              arr.push({
                _id: post._id,
                name: user.name,
                Image: post.Image,
                Caption: post.Caption,
                PP: user.ProfilePic || null,
                likes: post.UserWhoLikes
              });
            }
          }
        res.json({ Posts: arr })

    } catch (error) {
        console.log(error);
    } finally {
    }

})

// done 
app.post("/UpPsw", async (req, res) => {
    let UserName = req.body.UserName
    let oldPsw = req.body.oldPsw
    let newPsw = req.body.newPsw

    try {
        // await client.connect()
        // const database = client.db(databaseName)
        // const data = database.collection(collectionName)

        const result = await User.findOne({ name: UserName })

        if(result.length == 0){
            res.json({message: "User Not Found"})
        }

        if (oldPsw != result.Password) {
            res.json({ message: "Password Has Not Been Changed" })
        } else {
            const document = await User.updateOne({ name: UserName }, { $set: { Password: newPsw } })

            if (document.modifiedCount != 0) {
                res.json({ message: "Password Has Been Changed" })
            } else {
                res.json({ message: "Password Has Not Been Changed" })
            }
        }

    } catch (error) {
        console.log(error);
    } finally {
        // await client.close()
    }
})

// done
app.post("/UpName", async (req, res) => {
    let oldName = req.body.oldName;
    let newName = req.body.newName;

    try {
        // Connect to MongoDB
        // await client.connect();
        // const database = client.db(databaseName);
        // const data = database.collection(collectionName);

        // Update the document
        const result = await User.updateOne({ name: oldName }, { $set: { name: newName } });

        if (result.modifiedCount != 0) {
            res.send({ message: "User Name Has Been Updated" })
        } else {
            res.send({ message: "User Name Has Not Been Updated" })
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send({ message: "An error occurred while updating user name" });
    } finally {
    }
})

// done
app.post("/UpSec", async (req, res) => {
    let UserName = req.body.UserName
    let secQue = req.body.secQue
    let secAnsUp = req.body.secAnsUp

    try {
        // await client.connect()
        // const database = client.db(databaseName)
        // const data = database.collection(collection)

        const result = await User.updateOne({ name: UserName }, { $set: { Question: secQue, Answer: secAnsUp } })

        res.json({ message: "Data Has Been Updated" })
    } catch (error) {

    } finally {

    }
})

// done
app.post("/setDP", async (req, res) => {
    const UserName = req.body.UserName
    const DP = req.body.DP

    try {
        // await client.connect()
        // const database = client.db(databaseName)
        // const data = database.collection(collectionName)
        const result = await User.updateOne({ name: UserName }, { $set: { ProfilePic: DP } })
        if (result.modifiedCount == 1) {
            res.json({ message: "Profile Pic Has Been Updated" })
        } else {
            res.json({ message: "Profile Pic Has Not Been Updated" })
        }


    } catch (error) {
        console.log(error);
        res.json({message: "Error"})
    } finally {
    }
})

/*
app.post("/forgetPSW", async (req,res)=>{
    const name = req.body.UserName

    try {
        await client.connect()
        const database = client.db(databaseName)
        const data = database.collection(collectionName)
        const document = await data.findOne({name: name})

        if(document){
            res.json({ans: document.Answer, Que: document.Question})
        } else {
            res.json({message: "User Not Found"})
        }

    } catch (error) {

    } finally {
        client.close()
    }
})

app.post("/updatePassword", async(req,res)=>{
    const new_psw = req.body.new_psw
    const uName = req.body.uName

    try {
        await client.connect()
        const database = client.db(databaseName)
        const data = database.collection(collectionName)
        // const document = await data.findOne({name: name})
        const result = await data.updateOne(
            {name: "mahek"},
            {$set: {Password: new_psw}}
        )

        if(result.modifiedCount == 0){
            res.json({message: "Password Can Not Be Same As Old Password..."})
        } else {
            res.json({message: "Password Has Been Updated..."})
        }


    } catch (error) {

    } finally {
        client.close()
    }


})


app.get("/getData",async (req, res)=>{
    // console.log('reached...');
    try {
        await client.connect();
        const database = client.db(databaseName)
        const collection = database.collection(collectionName)

        const result = await collection.find({}).toArray()

        res.send(result);

    } catch (error) {
        console.log(error);
    } finally {
        client.close()
    }
})
*/

// done
app.post("/getUserPosts", async (req, res) => {
    const UserName = req.body.UserName

    try {
        
        const postIDs = await User.findOne({name: UserName})
        var arr = []
        if(!postIDs){
            return res.json({"message":"User Not FOund"})
            
        }
        for (const iterator of postIDs.Posts) {
            const post = await Post.findOne({_id: iterator})
            arr.push(post)
        }
        
        res.send({message: arr.length>0 ? "Post Found" : "Post not Found", Post: arr})


    } catch (error) {
        console.log(error)
    }
})

app.post("/likePost", async (req, res) => {
    const userName = req.body.name;
    const post_id = req.body.post_id;

    try {
        const user = await User.findOne({name: userName})
        const post = await Post.findOne({_id: post_id})

        let arr = []
        arr = post.UserWhoLikes
        if(user && !arr.includes(user._id)){
            const Likepost = await Post.updateOne({_id: post_id}, {
                $push: {
                    UserWhoLikes: user._id
                }
            })

            if(Likepost.modifiedCount){
                res.json({message: "Liked"})
            } else {
                res.json({message: "not Liked"})
            }
        } else {
            res.json({message: "User Not Found"})
        }
    } catch (error) {
        res.json(error)
        console.log(error);
    }
})

app.post("/DisLikePost", async (req, res) => {
    const userName = req.body.name
    const post_id = req.body.post_id

    
    try {
        let arr = []
        const user = await User.findOne({name: userName})
        const post = await Post.findOne({_id: post_id})
        console.log(post.UserWhoLikes.length)
        arr = post.UserWhoLikes
        console.log(arr.includes(2))
        if(user && arr.includes(user._id)){
            const DisLikePost = await Post.updateOne({_id: post_id}, {
                $pull: {
                    UserWhoLikes: user._id
                }
            })

            if(DisLikePost.modifiedCount){
                res.json({message: "DisLiked"})
            } else {
                res.json({message : "not DisLiked"})
            }
        } else {
            res.json({message: "User Not Found"})
        }
    } catch (error) {
        console.log(error);
        res.json({message: "can not DisLiked"})
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});