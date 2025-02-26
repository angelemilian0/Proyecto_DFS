const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['alumno', 'profesor'], default: 'alumno' },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
