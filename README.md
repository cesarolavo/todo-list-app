# 📝 ToDo List - Gerenciador de Tarefas

**Trabalho Final de Curso Técnico em Informática**

Aplicação web completa de gerenciamento de tarefas (ToDo List) desenvolvida com tecnologias modernas de desenvolvimento web.

## 🎯 Objetivo

Desenvolver uma aplicação web simples mas funcional para gerenciamento de tarefas, demonstrando conhecimentos em:

- Frontend: HTML, CSS, JavaScript Vanilla
- Backend: Node.js, Express, REST API
- Banco de Dados: SQLite
- DevOps: Docker, Docker Compose, GitHub Actions
- Deploy: Render

## ✨ Características

✅ **Funcionalidades**
- ✅ Adicionar novas tarefas
- ✅ Listar todas as tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Deletar tarefas
- ✅ Filtrar por status (Todas, Pendentes, Concluídas)
- ✅ Estatísticas em tempo real
- ✅ Interface responsiva e moderna

✅ **Tecnologias**
- Node.js 18+ com Express
- SQLite para persistência de dados
- JavaScript Vanilla (sem frameworks)
- Docker e Docker Compose
- GitHub Actions para CI/CD
- REST API completa

## 📋 Estrutura do Projeto

```
todo-list-app/
├── frontend/                           # Código do frontend
│   ├── index.html                      # Página principal
│   ├── styles.css                      # Estilos da aplicação
│   └── app.js                          # Lógica do frontend
├── backend/                            # Código do backend
│   ├── src/
│   │   ├── app.js                      # Configuração do Express
│   │   ├── server.js                   # Entrada do servidor
│   │   ├── routes/
│   │   │   └── tasks.js                # Rotas da API de tarefas
│   │   └── models/
│   │       └── database.js             # Modelo de banco de dados
│   ├── tests/
│   │   └── tasks.test.js               # Testes da API
│   ├── package.json                    # Dependências Node.js
│   └── .env.example                    # Variáveis de ambiente
├── .github/
│   └── workflows/
│       └── ci-cd.yml                   # Pipeline CI/CD
├── Dockerfile                          # Imagem Docker multi-stage
├── docker-compose.yml                  # Orquestração com Docker Compose
├── render.yaml                         # Configuração para deploy no Render
├── .dockerignore                       # Arquivos ignorados pelo Docker
├── .gitignore                          # Arquivos ignorados pelo Git
└── README.md                           # Esta documentação
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ e npm
- Docker e Docker Compose (opcional)
- Git

### Execução Local (Desenvolvimento)

#### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/cesarolavo/todo-list-app.git
cd todo-list-app
```

#### 2️⃣ Instalar dependências

```bash
cd backend
npm install
```

#### 3️⃣ Criar diretório de dados

```bash
mkdir -p dados
cd ..
```

#### 4️⃣ Iniciar o servidor

```bash
cd backend
npm start
```

A aplicação estará disponível em: **http://localhost:3000**

#### 5️⃣ Desenvolvimento com auto-reload

```bash
cd backend
npm run dev
```

### Execução com Docker

#### Build da imagem

```bash
docker build -t todo-list-app .
```

#### Execução com Docker

```bash
# Execução simples
docker run -p 3000:3000 todo-list-app

# Execução com persistência de dados (bind mount)
docker run -p 3000:3000 -v ./dados:/dados todo-list-app

# Execução com variáveis de ambiente
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_PATH=/dados/tarefas.db \
  -v ./dados:/dados \
  todo-list-app
```

#### Execução com Docker Compose

```bash
# Iniciar a aplicação
docker-compose up

# Iniciar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar a aplicação
docker-compose down

# Limpar volumes
docker-compose down -v
```

A aplicação estará disponível em: **http://localhost:3000**

## 🧪 Testes

### Executar testes unitários

```bash
cd backend
npm test
```

### Executar testes com cobertura

```bash
cd backend
npm test -- --coverage
```

### Modo watch (testes em tempo real)

```bash
cd backend
npm run test:watch
```

## 💡 API REST

### Endpoints disponíveis

#### Listar todas as tarefas

```bash
GET /api/tasks
```

**Resposta (200)**
```json
[
  {
    "id": 1,
    "title": "Estudar Node.js",
    "completed": 0,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Obter tarefa por ID

```bash
GET /api/tasks/:id
```

#### Criar nova tarefa

```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Aprender Docker"
}
```

#### Atualizar tarefa

```bash
PUT /api/tasks/:id
Content-Type: application/json

{
  "completed": true
}
```

#### Deletar tarefa

```bash
DELETE /api/tasks/:id
```

#### Health Check

```bash
GET /api/health
```

## 📊 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

## 🔄 GitHub Actions CI/CD

O pipeline CI/CD automatiza:

1. **Build & Test**
   - Instala dependências
   - Executa testes
   - Gera cobertura de testes

2. **Docker Build**
   - Constrói imagem Docker multi-stage
   - Publica no GitHub Container Registry (GHCR)
   - Usa cache para otimizar builds

3. **Notificações**
   - Notifica status do build
   - Integração com codecov para cobertura

### Visualizar workflows

Acesse: https://github.com/cesarolavo/todo-list-app/actions

## 🚀 Deploy no Render

### Opção 1: Deploy automático

1. Conectar repositório ao Render
2. Selecionar branch `main`
3. Framework: Node
4. Build Command: `cd backend && npm ci`
5. Start Command: `cd backend && npm start`

### Opção 2: Deploy manual via render.yaml

```bash
# Render detectará automaticamente o arquivo render.yaml
# Basta fazer push para o repositório
git push origin main
```

### Variáveis de Ambiente no Render

```
NODE_ENV=production
PORT=3000
DB_PATH=/var/data/tarefas.db
```

## 🔒 Segurança

- ✅ Validação de entrada em todos os endpoints
- ✅ Sanitização de dados HTML
- ✅ CORS habilitado
- ✅ User não-root no Docker
- ✅ Healthcheck implementado
- ✅ Graceful shutdown configurado

## 📈 Monitoramento

### Logs

```bash
# Logs em tempo real
docker-compose logs -f

# Últimas 100 linhas
docker-compose logs --tail=100
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

## 🛠️ Variáveis de Ambiente

Criar arquivo `.env` na pasta `backend`:

```env
NODE_ENV=development
PORT=3000
DB_PATH=/dados/tarefas.db
```

## 📦 Dependências do Projeto

### Runtime
- `express`: Framework web
- `sqlite3`: Banco de dados
- `cors`: CORS middleware
- `body-parser`: Parser JSON/URL-encoded

### Development
- `jest`: Framework de testes
- `supertest`: Testes HTTP

## 🤝 Contribuições

Para contribuir:

1. Fazer fork do projeto
2. Criar branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit as mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💼 Autor

**Trabalho Final de Curso Técnico em Informática**

- GitHub: [@cesarolavo](https://github.com/cesarolavo)

## 📞 Suporte

Para dúvidas ou problemas:

1. Abra uma issue no GitHub
2. Verifique o README e documentação
3. Consulte os logs da aplicação

## 🎓 Aprendizados

Este projeto demonstra:

- ✅ Desenvolvimento full-stack com Node.js
- ✅ Criação de REST API funcional
- ✅ Uso de SQLite para persistência
- ✅ Containerização com Docker
- ✅ CI/CD com GitHub Actions
- ✅ Deploy em plataforma cloud
- ✅ Frontend responsivo com vanilla JS
- ✅ Testes automatizados
- ✅ Boas práticas de desenvolvimento

---

**Desenvolvido com ❤️ para educação técnica**