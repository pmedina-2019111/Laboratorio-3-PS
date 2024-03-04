import User from '../users/user-model.js';
import Publi from '../publications/publications-model.js';

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario) {
        throw new Error(`|The ID: ${email} Does Not Exist|`);
    }
};

export const existenteEmail = async (email = '') => {
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
        throw new Error(`|The Email: ${email} Has Already Been Registered In The DataBase|`)
    }
};

export const publicationexitById = async (id = '') => {
    const existPublication = await Publi.findById(id);
    if (!existPublication) {
        throw new Error(`||The id: ${title} does not exists||`);
    }
}

