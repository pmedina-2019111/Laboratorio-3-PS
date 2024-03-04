import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentsSchema = mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: [true, "The User is obligatory"],
    },
    userName: {
        type: String,
        ref: "User",
        required: [true, "The user name is obligatory"],
    },
    idPublications: {
        type: String,
        ref: "Publications",
        required: [true, "The publicaction is obligatory"],
    },
    descripComment: {
        type: String,
        required: [true, "The description is obligatory"],
    },
    estado: {
        type: Boolean,
        default: true,
    }
});

export default mongoose.model('Comments', CommentsSchema);