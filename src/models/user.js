import mongoose from "mongoose";

const useSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ["admin", "member"] ,
        default: "member",
    },
},{timestamps: true, versionKey: false})

export default mongoose.model('User', useSchema)