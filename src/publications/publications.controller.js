import { response, request } from "express";
import Publication from './publications-model.js';
import Usuario from '../users/user-model.js';
import Comment from '../comments/comments.model.js';
import jwt from "jsonwebtoken";

export const getPublications = async (req = request, res = response) => {
    try {
        const { limite, desde } = req.query;
        const query = { state: true };

        const publications = await Publication.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const publicactionWithComments = await Promise.all(
            publications.map(async (publication) => {
                const comments = await Comment.find({ idPublication: publication._id, state: true })
                    .select('id descriptionComment');

                return {
                    ...publication._doc,
                    comments,
                };
            })
        );

        const total = publications.length;

        res.status(200).json({
            total,
            publications: publicactionWithComments,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ERROR - Internal server error' })
    }
};


export const createPublication = async (req, res) => {
    try {
        const { userId, userName, titlePub, categoryPub, commentId, descriptionBY, state } = req.body;

        // Verificar si se proporcionó un título válido
        if (!titlePub || typeof titlePub !== 'string' || titlePub.trim() === '') {
            return res.status(400).json({ error: '|Invalid title. Please provide a non-empty string.|' });
        }

        console.log("Data received:", req.body); // Imprimir los datos recibidos

        const publication = new Publication({
            userId,
            userName,
            titlePub,
            categoryPub,
            commentId,
            descriptionBY,
            state
        });

        console.log("|Publication to save:|", publication); // Imprimir la publicación antes de guardarla

        await publication.save();

        res.status(200).json({ msg: '||Publication added successfully|', publication });
    } catch (error) {
        console.error('Error creating publication', error);
        res.status(500).json({ error: 'Error creating publication' });
    }
};




export const getPublicationById = async (req, res) => {
    const { id } = req.params;
    const publication = await Publication.findOne({ _id: id });

    res.status(200).json({
        publication
    })
};


export const updatePublication = async (req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(401).json({ msg: "||No hay TOKEN en la solicitud||" });
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({ msg: '||El usuario no existe en la base de datos||' });
        }

        const publication = await Publication.findById(id);
        if (!publication || publication.userId.toString() !== uid) {
            return res.status(403).json({ msg: '||No tienes permiso para actualizar esta publicación||' });
        }

        await Publication.findByIdAndUpdate(id, resto);

        const updatedPublication = await Publication.findOne({ _id: id });

        res.status(200).json({ msg: '||Publicación actualizada con éxito||', publication: updatedPublication });
    } catch (error) {
        console.error('||error actualizando la publicación||', error);
        res.status(500).json({ error: 'ERROR - actualizando la publicación' });
    }
};


export const publicationsDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(401).json({ msg: "||No hay TOKEN en la solicitud||" });
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({ msg: '||El usuario NO EXISTE en la base de datos||' });
        }

        const publication = await Publication.findById(id);
        if (!publication || publication.userId.toString() !== uid) {
            return res.status(403).json({ msg: '||No tienes permiso para eliminar esta publicación||' });
        }

        await Publication.findByIdAndUpdate(id, { state: false });
        
        const bruh = await Publication.findOne({ _id: id });

        res.status(200).json({ msg: '||Publicación eliminada con éxito||', bruh});

    } catch (error) {
        console.error('||error eliminando la publicación||', error);
        res.status(500).json({ error: '|| eliminando la publicación ||' });
    }
};
