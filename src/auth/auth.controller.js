import bcryptjs from 'bcryptjs';
import Usuario from '../users/user-model.js';
import { generarJWT } from '../helpers/generate-jwt.js';
import validator from 'validator';

export const login = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        let usuario;

        // Verificar si se proporcionó un correo electrónico
        if (email) {
            usuario = await Usuario.findOne({ email });
        } else if (name) { // Verificar si se proporcionó un nombre de usuario
            usuario = await Usuario.findOne({ name });
        }

        if (!usuario) {
            return res.status(400).json({
                msg: "|Credenciales incorrectas, el correo electrónico o el nombre de usuario NO EXISTEN en la base de datos|",
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "|La contraseña es INCORRECTA|",
            });
        }

        const token = await generarJWT(usuario.id);

        res.status(200).json({
            msg: '|BIENVENIDO - Inicio de sesión exitoso|',
            usuario,
            token
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "|Contacte al administrador|",
        });
    }
};
