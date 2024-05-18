import express from 'express'
import { createPgConnectionPool, createMySqlConnectionPool } from './database.js'
import { Queries } from './queries.js'
import fs from 'fs';

import * as c from './consultas/conj_consultas.js'

let pgPool;
let myPool;


const app = express()
const port = 3080 //port in which the server will run

async function runTestBattery(db, queryList, indexList, dbName = "mysql", outFileName, indexType = '') {
    try {
        fs.unlinkSync("results/" + outFileName);
    }
    catch (err) {
        console.error('Nao consegui apagar o arquivo: ' + "results/" + outFileName)
    }

    let results = await db.testManyWithIndex(10, queryList, indexList, dbName, indexType);

    fs.appendFileSync("results/" + outFileName ,JSON.stringify(results, null, 4) + '\n');
}

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
    console.log("Requisição recebida")	

    var testResults = []
    let results = []

    // "Select * FROM Votes WHERE Id > 5503 AND Id < 1001375624;",
    console.log("run mysql queries")
    await runTestBattery(db, c.consultasItem3, c.indexesItem3, "pg", "consultas3NoIndexPG.json", false)
    await runTestBattery(db, c.consultasItem5, c.indexesItem5, "pg", "consultas5NoIndexPG.json", false);
    await runTestBattery(db, c.consultasItem3, c.indexesItem3, "pg", "consultas3BTreePG.json", "BTREE")
    await runTestBattery(db, c.consultasItem5, c.indexesItem5, "pg", "consultas5BTreePG.json", "BTREE")

    console.log("terminei");
    // try {
    //     fs.unlinkSync('tempo_postgres.txt');
    // }
    // catch (err) {
    //     console.error(err)
    // }

    // results = await db.testManyWithIndex(2, allTests, "pg");

    // fs.appendFileSync(`tempo_postgres.txt`, JSON.stringify(results) + '\n');
    res.send("Ok")

})

app.get('/dropIndexes', async (req, res) => {
    console.log(req.query.table)
    await db.dropAllIndexFromTable(req.query.table)
    res.send("OK")
})
