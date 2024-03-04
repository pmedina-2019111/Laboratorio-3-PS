import jwt from 'jsonwebtoken';
import Usuario from '../users/user-model.js';

export const validarJWT = async(req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "|The Token Does Not Exist|",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: '|User Not Registered In Database|'
            })
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: '|Invalid Token Fake User|'
            })
        }
        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e),
            res.status(401).json({
                msg: "|Invalid Token|",
            });
    }
};

export const validarJWTCMNT = async(req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "|The Request Does Not Have a Token|",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: '|User Not Registered In Database|'
            })
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: '|Invalid Token Fake User|'
            })
        }

        req.usuario = usuario;

        const idPublication = req.params.idPublication;
        if (!idPublication) {
            return res.status(400).json({
                msg: '|There is no Publication ID in the request|'
            });
        }

        req.idPublication = idPublication;

        next();
    } catch (e) {
        console.log(e),
            res.status(401).json({
                msg: "|Invalid Token|",
            });
    }
};