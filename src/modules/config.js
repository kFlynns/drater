module.exports = {
    taxRate: 25.0,
    startBalance: 10000.0,
    broker: {
        fees: {
            maker: 0.1,
            taker: 0.2
        }
    },
    database: {
        host: 'localhost',
        user: 'dbuser',
        password: 'dbpass',
        name: 'drater'
    }
}