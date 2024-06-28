// const mongoose=require("mongoose");
// const connect=mongoose.connect("mongodb://127.0.0.1:27017/login_signup");

// connect.then(()=>{
//     console.log("database connected successfully");
// })
// .catch((error)=>{
//     console.log("database cannot be connected");
//     console.error(error);
// });

// const loginschema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// });

// const collection=new mongoose.model("user",loginschema);
// module.exports=collection;
const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb://127.0.0.1:27017/login_signup");
const mongoDB = 'mongodb+srv://khushi14khush:Ankita16@02@cluster0.somh5.mongodb.net/message-database?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected to MongoDB');
}).catch(err => console.log(err));


connect.then(() => {
    console.log("Database connected successfully");
}).catch((error) => {
    console.log("Database cannot be connected");
    console.error(error);
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique
    },
    username: {
        type: String,
        required: true,
        unique: true // Ensures username is unique
    },
    password: {
        type: String,
        required: true
    },
    confirm_password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true // Ensures phone is unique
    }
});

const collection = mongoose.model("user", userSchema);
module.exports = collection;
