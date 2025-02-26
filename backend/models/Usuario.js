// Importamos el módulo mongoose para manejar la base de datos MongoDB
const mongoose = require('mongoose');

// Definimos el esquema para la colección de usuarios
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Nombre del usuario, campo obligatorio
  email: { type: String, required: true, unique: true }, // Correo electrónico único y obligatorio
  password: { type: String, required: true }, // Contraseña del usuario, campo obligatorio
  role: { type: String, enum: ['alumno', 'profesor'], default: 'alumno' }, // Campo de rol con valores permitidos
});

// Exportamos el modelo 'Usuario' basado en el esquema definido
module.exports = mongoose.model('Usuario', UsuarioSchema);
