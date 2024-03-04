import { Router } from "express";
import { check } from "express-validator";
import {
    existenteEmail,
    existeUsuarioById,
} from "../helpers/db-validator.js";

import {
    usuariosGet,
    usuariosPost,
    usuariosPut,
} from "./user-controller.js";

import { validarCampos } from "../middlewares/validar-Campos.js";

const router = Router();

router.get("/", usuariosGet);


router.post(
    "/", [
        //check("name", "|Mandatory Name|").not().isEmpty(),
        /*check("password", "|Password must be greater than 6 characters|").isLength({min: 6,
        }),*/
        //check("email", "|Invalid Email|").isEmail(),
        //check("email").custom(existenteEmail),
        validarCampos,
    ],
    usuariosPost
);


router.put(
    "/:id", [
        check("id", "|Invalid ID|").isMongoId(),
        check("id").custom(existeUsuarioById),
        check('email', '|Current Email Required|').isEmail(),
        check('password', '|Current Password Required|').not().isEmpty(),
        check('newPassword', '|New Password Required|').not().isEmpty(),
        validarCampos,
    ],
    usuariosPut
);

export default router;