import express from 'express'
import { createPgConnectionPool, createMySqlConnectionPool } from './database.js'
import { Queries } from './queries.js'
import fs from 'fs';


let pgPool;
let myPool;


const app = express()
const port = 3080 //port in which the server will run

async function startApplication() {
    try {
        // Abre o pool de conexões
        pgPool = await createPgConnectionPool();
        myPool = await createMySqlConnectionPool();
        // Inicia a aplicação Express
        app.listen(port, () => {
            console.log("Servidor rodando na porta " + port);
        });
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}


await startApplication()

const db = new Queries(pgPool, myPool)


app.get('/', async (req, res) => {
    //let data;
    //for (let i = 0; i < 20; i++) {
    //    const iniDate = new Date();
    //    data = await db.getidsbadges()
    //    console.log(data)
    //    const endDate = new Date();
    //    const diff = endDate - iniDate;
    //    console.log(`${i}: Tempo de resposta: ${diff} ms`);
    //}
    //res.send("Ok")
    let basicQueries = [
        "SELECT * FROM Posts WHERE Id = 777;",
        "SELECT * FROM Comments WHERE Id = 10;",
        "SELECT * FROM Badges WHERE Id = 83663;",
        "Select * FROM Users WHERE Id = 7670379;",
        "Select * FROM Votes WHERE Id = 5503;",
        "SELECT * FROM Posts WHERE Id > 30 AND Id < 1000;",
        "SELECT * FROM Comments WHERE Id > 10 AND Id < 50;",
        "SELECT * FROM Badges WHERE Id > 83663 AND Id < 725012;",
        "Select * FROM Users WHERE Id > 4 AND Id < 7670379;",
        "Select * FROM Votes WHERE Id > 5503 AND Id < 1001375624;",
    ]

    
  
    fs.writeFileSync('tempo_mysql.txt', '\n');
    for (let qry of basicQueries) {
        res = await db.testMany(20, qry, "mysql");
    }
})
