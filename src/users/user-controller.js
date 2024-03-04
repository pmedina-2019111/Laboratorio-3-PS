import { response, request } from "express";
import bcryptjs from "bcryptjs";
import User from './user-model.js'

export const usuariosGet = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };
    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        msg: '|User List|',
        total,
        usuarios,
    });
}


export const usuariosPost = async (req= request, res = response) => {
    const { name, email, password } = req.body;
    const usuario = new User({ name, email, password });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(200).json({
        msg: '|Added User|',
        usuario
    });
}


export const usuariosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, newPassword, email, ...resto } = req.body;

    try {
        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: '|Not Found|' });
        }

        if (usuario.email !== email) {
            return res.status(400).json({ msg: '|The Email Does Not Match the Registered Email|' });
        }

        if (password && newPassword) {
            const passwordCorrect = bcryptjs.compareSync(password, usuario.password);
            if (!passwordCorrect) {
                return res.status(400).json({ msg: '|Incorrect Current Password|' });
            }
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(newPassword, salt);
        } else if (password || newPassword) {
            return res.status(400).json({ msg: '|Enter Current and New Password|' });
        }

        await User.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            msg: '|Updated User|',
            id,
            email
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: '|Update Failed|'
        });
    }
};
