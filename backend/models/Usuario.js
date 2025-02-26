// filepath: /workspaces/Proyecto_DFS/backend/models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', UsuarioSchema);