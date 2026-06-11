const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Configurar caminho do banco de dados
const DB_PATH = process.env.DB_PATH || '/dados/tarefas.db';

// Garantir que o diretório existe
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite');
    }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

const database = {
    initialize: function() {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // Criar tabela de tarefas
                db.run(`
                    CREATE TABLE IF NOT EXISTS tasks (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        completed BOOLEAN DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => {
                    if (err) {
                        console.error('❌ Erro ao criar tabela:', err.message);
                        reject(err);
                    } else {
                        console.log('✅ Tabela de tarefas pronta');
                        resolve();
                    }
                });
            });
        });
    },

    getAllTasks: function() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM tasks ORDER BY created_at DESC', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    },

    getTaskById: function(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    },

    createTask: function(title) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO tasks (title, completed) VALUES (?, ?)';
            db.run(query, [title, 0], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        title: title,
                        completed: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                }
            });
        });
    },

    updateTask: function(id, updates) {
        return new Promise((resolve, reject) => {
            const allowedFields = ['title', 'completed'];
            const fields = [];
            const values = [];

            Object.keys(updates).forEach(key => {
                if (allowedFields.includes(key)) {
                    fields.push(`${key} = ?`);
                    values.push(updates[key]);
                }
            });

            if (fields.length === 0) {
                reject(new Error('Nenhum campo para atualizar'));
                return;
            }

            fields.push('updated_at = ?');
            values.push(new Date().toISOString());
            values.push(id);

            const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
            
            db.run(query, values, function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Tarefa não encontrada'));
                } else {
                    database.getTaskById(id).then(resolve).catch(reject);
                }
            });
        });
    },

    deleteTask: function(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Tarefa não encontrada'));
                } else {
                    resolve({ success: true, deletedId: id });
                }
            });
        });
    },

    close: function() {
        db.close((err) => {
            if (err) {
                console.error('❌ Erro ao fechar banco de dados:', err.message);
            } else {
                console.log('✅ Banco de dados fechado');
            }
        });
    }
};

module.exports = database;