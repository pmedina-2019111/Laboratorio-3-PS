import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "|Required Name|"]
    },
    email: {
        type: String,
        required: [true, "|Required Email|"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "|Required Password|"]
    },
    newPassword: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }

});

UserSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default mongoose.model('User', UserSchema);