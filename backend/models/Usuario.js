const mongoose = require('mongoose');

// Definimos el esquema de usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },   // Nombre del usuario
  email: { type: String, required: true, unique: true },  // Correo único
  password: { type: String, required: true },  // Contraseña obligatoria
  role: { type: String, enum: ['admin', 'usuario'], default: 'usuario' }  // Campo 'role' con valor por defecto 'usuario'
});

// Exportamos el modelo 'Usuario' basado en el esquema
module.exports = mongoose.model('Usuario', UsuarioSchema);