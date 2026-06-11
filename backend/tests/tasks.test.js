const request = require('supertest');
const app = require('../src/app');
const database = require('../src/models/database');

describe('API de Tarefas', () => {
    beforeAll(async () => {
        await database.initialize();
    });

    afterAll(() => {
        database.close();
    });

    describe('GET /api/tasks', () => {
        test('deve retornar array de tarefas', async () => {
            const response = await request(app)
                .get('/api/tasks')
                .expect(200);
            
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /api/tasks', () => {
        test('deve criar uma nova tarefa com título válido', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tarefa de teste' })
                .expect(201);
            
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Tarefa de teste');
            expect(response.body.completed).toBe(0);
        });

        test('deve rejeitar tarefa sem título', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: '' })
                .expect(400);
            
            expect(response.body).toHaveProperty('error');
        });

        test('deve rejeitar tarefa com título muito longo', async () => {
            const longTitle = 'a'.repeat(201);
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: longTitle })
                .expect(400);
            
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/health', () => {
        test('deve retornar status ok', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);
            
            expect(response.body.status).toBe('ok');
            expect(response.body).toHaveProperty('timestamp');
        });
    });

    describe('PUT /api/tasks/:id', () => {
        let taskId;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tarefa para atualizar' });
            taskId = response.body.id;
        });

        test('deve atualizar tarefa para concluída', async () => {
            const response = await request(app)
                .put(`/api/tasks/${taskId}`)
                .send({ completed: true })
                .expect(200);
            
            expect(response.body.completed).toBe(1);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        let taskId;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tarefa para deletar' });
            taskId = response.body.id;
        });

        test('deve deletar uma tarefa', async () => {
            const response = await request(app)
                .delete(`/api/tasks/${taskId}`)
                .expect(200);
            
            expect(response.body.success).toBe(true);
            expect(response.body.deletedId).toBe(taskId);
        });

        test('deve retornar 404 ao tentar deletar tarefa inexistente', async () => {
            const response = await request(app)
                .delete('/api/tasks/99999')
                .expect(404);
            
            expect(response.body).toHaveProperty('error');
        });
    });
});