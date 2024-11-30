const mongoose = require('mongoose');

const DiplomaSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    fileUrl: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    cpf: { type: String, required: true },
});

module.exports = mongoose.model('Diploma', DiplomaSchema);
