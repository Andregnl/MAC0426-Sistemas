import { promisify } from 'util';
import fs from 'fs';


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

    async testMany(tests = 10, qry, db = 'pg') {
        let tempoDiff = []
        fs.appendFileSync(`tempo_${db}.txt`, `Consulta: ` + qry+'\n' );
        console.log("consulta: ", qry)
        for (let i = 0; i < tests; i++) {
            const iniTime = process.hrtime();
            let res;
            if (db === 'pg')
                await this.pgPool.query(qry);
            else if (db === 'mysql'){
               res = await this.myPool.query(qry)
            }
            // const endDate = new Date();
            const diff = process.hrtime(iniTime); // Calculate the time difference
            tempoDiff.push(diff);
            console.log(`Teste ${i} demorou: ${diff} ms`);
            fs.appendFileSync(`tempo_${db}.txt`, `${diff}: ${res.length}\n`);

        }
        const avg = tempoDiff.reduce((a, b) => a + b, 0) / tempoDiff.length;
        console.log(`Média: ${avg}`);
    }
}
