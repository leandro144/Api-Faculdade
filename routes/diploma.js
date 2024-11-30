const express = require('express');
const jwt = require('jsonwebtoken');
const Diploma = require('../models/Diploma');
const router = express.Router();

// Middleware para autenticação
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Adicionar diploma
router.post('/add', auth, async (req, res) => {
    const { code, fileUrl, name, email, cpf } = req.body;

    if (!code || !fileUrl || !name || !email || !cpf) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    try {
        const newDiploma = new Diploma({ code, fileUrl, name, email, cpf });
        await newDiploma.save();
        res.status(201).json({ message: 'Diploma salvo com sucesso!', diploma: newDiploma });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro ao salvar diploma', error: err.message });
    }
});


// Consultar diploma
router.get('/:code', async (req, res) => {
    try {
        const diploma = await Diploma.findOne({ code: req.params.code });
        if (!diploma) return res.status(404).json({ message: 'Diploma not found' });

        res.json(diploma);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
