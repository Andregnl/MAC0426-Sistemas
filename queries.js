import { promisify } from 'util';
import fs from 'fs';
import { constants } from 'fs/promises';


export class Queries {
    constructor(pgPool, myPool) {
        this.pgPool = pgPool;
        this.myPool = myPool;
        this.myPool.query = promisify(this.myPool.query).bind(this.myPool);
    }

    async getidsbadges() {
        const result = await this.myPool.query('SELECT * From Badges')
        return result
    }

    async genericQuery(qry) {
        const result = await this.pgPool.query(qry)
        return result
    }

    async dropAllIndexFromTable(table, db='pg'){
        if(db == 'mysql'){
        const sql = 'SHOW INDEX FROM ' + table
        const result = await this.myPool.query(sql)
        console.log(result)}
        else if (db =='pg'){
            const sql = `SELECT indexname FROM pg_indexes WHERE tablename = "${table}"`
            const result = await this.pgPool.query(sql)
            console.log(result)
        }
        return

        //results[0].RowDataPacket.Column_name
        //results[0].RowDataPacket.Key_name
        // let dropIndex = []
        // for (let i = 0; i < result.length; i++) {
        //     dropIndex.push(`DROP INDEX ${result[i].Key_name}`)
        // }
    }

    async testMany(tests = 10, qry, db = 'pg') {
        let tempoDiff = []
        console.log("consulta: ", qry)
        let results = {}

        for (let i = 0; i < tests; i++) {
            for (let sql of qry) {
                const iniTime = process.hrtime();
                let res;
                if (db === 'pg')
                    await this.pgPool.query(sql);
                else if (db === 'mysql') {
                    res = await this.myPool.query(sql)
                }
                // const endDate = new Date();
                const diff = process.hrtime(iniTime); // Calculate the time difference
                tempoDiff.push(diff);
                console.log(`Teste ${i} demorou: ${diff} ms`);
                if (!results[sql]) results[sql] = [];
                results[sql].push(diff);
            }

        }
        console.log(results)
        fs.appendFileSync(`tempo_${db}.txt`, JSON.stringify(results) + '\n');

    }
}
