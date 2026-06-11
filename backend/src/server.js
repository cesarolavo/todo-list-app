const app = require('./app');
const database = require('./models/database');

const PORT = process.env.PORT || 3000;

// Inicializar banco de dados
database.initialize();

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`\n🚀 Servidor executando em http://localhost:${PORT}`);
    console.log(`📝 API disponível em http://localhost:${PORT}/api`);
    console.log(`💾 Banco de dados: ${process.env.DB_PATH || '/dados/tarefas.db'}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n📋 Recebido SIGTERM, encerrando gracefully...');
    server.close(() => {
        database.close();
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n📋 Recebido SIGINT, encerrando gracefully...');
    server.close(() => {
        database.close();
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});

module.exports = server;