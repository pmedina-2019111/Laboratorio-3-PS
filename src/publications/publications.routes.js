import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-Campos.js";
import { validarJWTCMNT, validarJWT } from "../middlewares/validar-jwt.js"
import { createPublication, getPublicationById, getPublications, publicationsDelete, updatePublication } from './publications.controller.js'
import { publicationexitById } from '../helpers/db-validator.js'

const routerPublications = Router();

routerPublications.get(
    '/',
    getPublications
)

routerPublications.post('/',
    [
        check('titlePub', '||The title is obligatory||').not().isEmpty(),
        check('categoryPub', '||The category is obligatory||').not().isEmpty(),
        check('descriptionBY', '||The description is obligatory||').not().isEmpty(),
        validarJWT,
        validarCampos
    ],
    createPublication);

routerPublications.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    updatePublication
);

routerPublications.delete(
    '/:id',
    [
        check('id', 'The entered ID is invalid').isMongoId(),
        check('id').custom(publicationexitById),
        validarCampos
    ],
    publicationsDelete
);

routerPublications.get(
    '/:id',
    [
        check('id', 'The entered ID is invalid').isMongoId(),
        check('id').custom(publicationexitById),
        validarCampos
    ],
    getPublicationById
);

export default routerPublications;