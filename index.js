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
    console.log("Requisição recebida")	
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

    var testResults = []
    let results = []

    "Select * from \"<table>\" where \"<Id>\" "


    /*
        {
            query: `SELECT * FROM "Posts" WHERE "Id" = 777;`,
            index: [
                { column_name: `column_name`, table_name:`table_name` },
                { column_name: `column_name`, table_name:`table_name` }
            ]
        },
        
        */

    let allTests = [
        {
            query: `SELECT * FROM "Posts" WHERE "Id" = 777;`,
            index: [
            ]
        },
        `SELECT * FROM "Comments" WHERE "Id" = 10;`,
        `SELECT * FROM "Badges" WHERE "Id" = 83663;`,
        `Select * FROM "Users" WHERE "Id" = 7670379;`,
        `Select * FROM "Votes" WHERE "Id" = 5503;`,
        `SELECT * FROM "Posts" WHERE "Id" > 30 AND "Id" < 1000;`,
        `SELECT * FROM "Comments" WHERE Id > 10 AND "Id" < 50;`,
        `SELECT * FROM "Badges" WHERE "Id" > 83663 AND "Id" < 725012;`,
        `SELECT * FROM "Users" WHERE "Id" > 4 AND "Id" < 7670379;`,
    ]

    allTests = [
        {
            query: `SELECT "Posts"."Id", "Posts"."Body", "PostTypes"."Type" FROM "Posts" JOIN "PostTypes" ON "Posts"."PostTypeId" = "PostTypes"."Id" WHERE "PostTypes"."Type" LIKE 'Question'`,
            index:  [
                        { column_name: `"PostTypeId"`, table_name: `"Posts"` }
                    ]
        }]
    /*    
    allTests = [
        {
            query: `SELECT "Posts"."Id", "Posts"."Body", "PostTypes"."Type" FROM "Posts" JOIN "PostTypes" ON "Posts"."PostTypeId" = "PostTypes"."Id" WHERE "PostTypes"."Type" LIKE 'Question'`,
            index:  [
                        { column_name: `"PostTypeId"`, table_name: `"Posts"` }
                    ]
        },  
        {
            query: `SELECT "Id", "CreationDate" FROM "Posts" WHERE "CreationDate" >= '2010-01-01' AND "CreationDate" < '2010-05-11';`,
            index : [
                        {column_name: `"CreationDate"`, table_name: `"Posts"`}
                    ]
        },
        {
            query: `SELECT "Users"."Id" FROM "Users" WHERE "UpVotes" > 50 AND "Upvotes" < 60;`,
            index : [
                        {column_name: `"UpVotes"`, table_name: `"Users"`}
                    ]
        },
        {
            query: `SELECT "Comments"."Id", "Views" FROM "Comments" JOIN "Users" ON "Comments"."UserId" = "Users"."Id" ORDER BY "Views" DESC;`,
            index : [
                        {column_name: `"UserId"`, table_name: `"Comments"`},
                        {column_name: `"Views"`, table_name: `"Users"`}
                    ]
        },
        {
            query: `SELECT "P"."Id", "V"."VoteTypeId" FROM "Posts" as "P" JOIN "Votes" as "V" ON "P"."Id" = "V"."PostId" WHERE "V"."VoteTypeId" = 3;
            `,
            index : [
                        {column_name: `"PostId"`, table_name: `"Votes"`},
                        {column_name: `"VoteTypeId"`, table_name: `"Votes"`}
                    ]
        },
        {
            query: `SELECT Users.Id, Users.DisplayName, UserBadges1.Name, UserBadges2.Name FROM (( Users JOIN Badges AS UserBadges1 ON Users.Id = UserBadges1.UserId) JOIN Badges AS UserBadges2 ON (UserBadges1.UserId = UserBadges2.UserId AND UserBadges1.Name != UserBadges2.Name)) WHERE UserBadges1.Name = 'Editor' AND UserBadges2.Name = 'Supporter';`,
            index : [
                        {column_name: `"UserId"`, table_name: `"Badges"`},
                        {column_name: `"Name"`, table_name: `"Badges"`}
                    ]
        }    
    ]
    */

    // "Select * FROM Votes WHERE Id > 5503 AND Id < 1001375624;",

    try {
        fs.unlinkSync('tempo_mysql.txt');
    }
    catch (err) {
        console.error('Nao consegui apagar o arquivo tempo_mysql.txt')
    }

    results = await db.testManyWithIndex(2, allTests, "mysql");

    fs.appendFileSync(`tempo_mysql.txt`, JSON.stringify(results) + '\n');
    
    try {
        fs.unlinkSync('tempo_postgres.txt');
    }
    catch (err) {
        console.error(err)
    }

    results = await db.testManyWithIndex(2, allTests, "pg");

    fs.appendFileSync(`tempo_postgres.txt`, JSON.stringify(results) + '\n');
    res.send("Ok")
})

app.get('/dropIndexes', async (req, res) => {
    await db.dropAllIndexFromTable("Posts")
    res.send("OK")
})
