import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-Campos.js";
//import { existeCommentsById } from "../helpers/db-validator.js";
import { validarJWTCMNT } from "../middlewares/validar-jwt.js";
import { commentsPost } from "./comments.controller.js";

const RouterComment = Router();

RouterComment.post(
    "/:idPublications",
    [
        check("descriptionComment", "this parameter is required").not().isEmpty(),
        validarJWTCMNT,
        validarCampos
    ],
    commentsPost
);


export default RouterComment;