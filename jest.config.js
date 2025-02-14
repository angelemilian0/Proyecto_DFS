import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/AvanceProyecto_DFS';
export const PORT = process.env.PORT || 4000;
export const JWT_SECRET = process.env.JWT_SECRET;

// Agrega validación de variables de entorno
if (!MONGODB_URI) {
    throw new Error('MONGO_URI is required');
}

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
}