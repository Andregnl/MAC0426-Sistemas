export class Queries {
    constructor(pgPool, myPool) {
        this.pgPool = pgPool;
        this.myPool = myPool;
    }

    async getidsbadges() {
        const result = await this.pgPool.query('SELECT * From "Badges" ')
        console.log(result) 
        return result
    }
}