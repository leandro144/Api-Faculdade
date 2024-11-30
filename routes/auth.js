const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');  // Importando o pacote CORS

const router = express.Router();

// Modelo do usuário/admin
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', UserSchema);

const corsOptions = {
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

router.use(cors(corsOptions)); 


router.post('/create-admin', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin já existe!' });
        }

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin',
        });

        await admin.save();
        res.status(201).json({ message: 'Admin criado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar admin', error: err.message });
    }
});

// Rota de login do admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await User.findOne({ username, role: 'admin' });
        if (!admin) return res.status(404).json({ message: 'Admin não encontrado!' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas!' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
});

// Rota para obter dados do admin
router.get('/admin/:username', async (req, res) => {
    try {
        const admin = await User.findOne({ username: req.params.username, role: 'admin' });
        
        if (!admin) {
            return res.status(404).json({ message: 'Admin não encontrado!' });
        }
        
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
});

module.exports = router;
