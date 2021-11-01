const mariadb = require("mariadb");
const Config = require("../modules/config")

class Db
{

    /**
     * Get Db
     * @returns {Db}
     */
    static get instance()
    {
        if (typeof this._instance === 'undefined')
        {
            this._instance = new Db(
                Config.database.host,
                Config.database.user,
                Config.database.password,
                Config.database.name
            )
        }
        return this._instance
    }

    /**
     *
     * @param {string} host
     * @param {string} user
     * @param {string} password
     * @param {string} database
     */
    constructor(host, user, password, database)
    {
        this._db =  mariadb.createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            connectionLimit: 5
        })
        this.initialize()
    }

    /**
     * Create database tables, set start balance from config value.
     */
    initialize()
    {
        this.getConnection(connection => {
            connection.query("DROP TABLE `trades`");
            connection.query("DROP TABLE `balances`");
            connection.query(`
                CREATE TABLE IF NOT EXISTS trades (
                    trade_id INT PRIMARY KEY AUTO_INCREMENT,
                    amount DECIMAL(18, 9) NOT NULL,
                    maker_fee DECIMAL(5, 2) DEFAULT NULL,
                    taker_fee DECIMAL(5, 2) DEFAULT NULL,
                    open_course DECIMAL(18, 9) NOT NULL,
                    close_course DECIMAL(18, 9) DEFAULT NULL,
                    open_time DATETIME NOT NULL,
                    close_time DATETIME DEFAULT NULL,
                    type VARCHAR(31) NOT NULL
                )
            `)
            connection.query(`
                CREATE TABLE IF NOT EXISTS balances (
                    asset VARCHAR(127) NOT NULL,
                    type  VARCHAR(63) NOT NULL,
                    amount DECIMAL(18, 9) NOT NULL,
                    PRIMARY KEY (asset, type)              
                )
            `)
            connection.query("INSERT INTO `balances` (`asset`, `type`, `amount`) VALUES ('usd', 'trade', ?)", [
                Config.startBalance
            ])
        })
    }



    /**
     * Get a connection that will be sent to callback.
     * @param {function} callback
     */
    getConnection(callback)
    {
        this._db
            .getConnection()
            .then(callback)
    }

}


/**
 *
 * @type {Db}
 */
module.exports = Db.instance