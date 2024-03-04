import { response, request } from "express";
import Comment from '../comments/comments.model.js';
import Usuario from '../users/user-model.js';
import jwt from 'jsonwebtoken';

export const commentsPost = async (req = request, res = response) => {
    const user = req.usuario;
    const pub = req.publicacions;
    const { descriptionComment } = req.body;

    try {
        if (!descriptionComment) {
            return res.status(400).json({
                msg: '||Please, The description of the comments is required||'
            });
        }

        const comment = new Comment({
            descriptionComment,
            userId: user.id,
            userName: user.name,
            idPublications: pub.idPublications,
        });

        await comment.save();

        res.status(200).json({
            msg: '||The Comment add successfully||',
            comment
        });

    } catch (error) {
        console.error('||error Creating Comment:|| ', error);
        res.status(400).json({ error: "||error Creating Comment||" });
    }
};