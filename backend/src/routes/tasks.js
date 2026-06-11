const express = require('express');
const router = express.Router();
const database = require('../models/database');

// GET - Listar todas as tarefas
router.get('/', async (req, res) => {
    try {
        const tasks = await database.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('❌ Erro ao listar tarefas:', error);
        res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
});

// GET - Obter tarefa por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const task = await database.getTaskById(id);
        
        if (!task) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('❌ Erro ao buscar tarefa:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
});

// POST - Criar nova tarefa
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;

        // Validação
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'Título é obrigatório' });
        }

        const trimmedTitle = title.trim();
        
        if (trimmedTitle.length === 0) {
            return res.status(400).json({ error: 'Título não pode estar vazio' });
        }

        if (trimmedTitle.length > 200) {
            return res.status(400).json({ error: 'Título muito longo (máximo 200 caracteres)' });
        }

        const task = await database.createTask(trimmedTitle);
        res.status(201).json(task);
    } catch (error) {
        console.error('❌ Erro ao criar tarefa:', error);
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
});

// PUT - Atualizar tarefa
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        }

        // Validar title se for atualizado
        if (updates.title) {
            if (typeof updates.title !== 'string') {
                return res.status(400).json({ error: 'Título deve ser uma string' });
            }
            const trimmedTitle = updates.title.trim();
            if (trimmedTitle.length === 0) {
                return res.status(400).json({ error: 'Título não pode estar vazio' });
            }
            if (trimmedTitle.length > 200) {
                return res.status(400).json({ error: 'Título muito longo (máximo 200 caracteres)' });
            }
            updates.title = trimmedTitle;
        }

        // Validar completed se for atualizado
        if ('completed' in updates) {
            if (typeof updates.completed !== 'boolean' && updates.completed !== 0 && updates.completed !== 1) {
                return res.status(400).json({ error: 'Completed deve ser um booleano' });
            }
        }

        const task = await database.updateTask(id, updates);
        res.status(200).json(task);
    } catch (error) {
        console.error('❌ Erro ao atualizar tarefa:', error);
        
        if (error.message === 'Tarefa não encontrada') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

// DELETE - Deletar tarefa
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const result = await database.deleteTask(id);
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro ao deletar tarefa:', error);
        
        if (error.message === 'Tarefa não encontrada') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
});

module.exports = router;