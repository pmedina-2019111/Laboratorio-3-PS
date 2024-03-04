import { Router } from "express";
import { check } from "express-validator";
import validator from 'validator';
import { login } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-Campos.js";

const routerUsuarios = Router();

routerUsuarios.post(
    '/', [
    check('password', '|La contraseña es OBLIGATORIA|').not().isEmpty(),
    validarCampos,
],
    login
);

export default routerUsuarios;
