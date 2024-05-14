import express from 'express'
import { createConnectionPool } from './database.js'

const app = express()
const port = 3000


async function startApplication() {
    try {
        // Abre o pool de conexões
        createConnectionPool();
        // Inicia a aplicação Express
        app.listen(port, () => {
            console.log("Servidor rodando na porta "+ port);
        });
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}



app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  startApplication()