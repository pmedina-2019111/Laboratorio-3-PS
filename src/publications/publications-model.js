import mongoose from "mongoose";

const PublicationSchema = mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: [true, "User ID is required"],
    },
    userName: {
        type: String,
        ref: "User",
        required: [true, "User name is required"],
    },
    titlePub: {
        type: String,
        required: [true, "Title is required"],
    },
    categoryPub: {
        type: String,
        required: [true, "Category is required"],
    },
    commentId: {
        type: String,
        ref: "Comment"
    },
    descriptionBY: {
        type: String,
        required: [true, "Description is required"],
    },
    state: {
        type: Boolean,
        default: true,
    }
});

PublicationSchema.methods.toJSON = function() {
    const {__v, state, _id, ...publicacions} = this.toObject();
    publicacions.uid = _id;
    return publicacions;
}

export default mongoose.model('Publications', PublicationSchema);
