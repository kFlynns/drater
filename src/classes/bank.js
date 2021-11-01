const Db = require("./db")
const Broker = require("./broker")

class Bank
{

    /**
     * Update trades table.
     */
    static update()
    {
        Db.getConnection(async connection => {
            try
            {
                let toClose = []
                connection
                    .beginTransaction()
                    // close tp
                    .then(async () => {
                        (await connection
                            .query("SELECT * FROM `trades` WHERE `take_profit` <= ? AND `close_time` IS NULL", [
                                Broker.takerCourse
                            ])
                        ).forEach(row => {
                            toClose.push([
                                Broker.takerCourse,
                                row["trade_id"]
                            ])
                        })

                    })
                    // close sl
                    .then(async () => {
                        (await connection
                            .query("SELECT * FROM `trades` WHERE `stop_loss` >= ? AND `close_time` IS NULL", [
                                Broker.takerCourse
                            ])
                        ).forEach(row => {
                            toClose.push([
                                Broker.takerCourse,
                                row["trade_id"]
                            ])
                        })
                    })
                    .finally(async () => {
                        if (toClose.length > 0)
                        {
                            await connection
                                .batch(
                                    "UPDATE `trades` SET `close_time` = NOW(), `close_course` = ? WHERE `trade_id` = ?",
                                    toClose
                                )
                        }
                        await connection.commit()
                    })
            }
            catch (err)
            {
                await connection.rollback()
                console.log(err.message)
            }
            connection.end()
        })
    }

    /**
     * Open trade order.
     * @param {float} amount
     * @param {string} type
     * @param {float} tp
     * @param {float} sl
     */
    static openOrder(amount, type, tp, sl)
    {

        Db.getConnection(async connection => {
            try
            {
                connection
                    .beginTransaction()
                    .then(async () => {

                        await connection.query(`INSERT INTO trades (
                            amount,
                            maker_fee,
                            taker_fee,
                            open_course,
                            open_time,
                            take_profit,
                            stop_loss,
                            type
                        ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)`, [
                            amount,
                            Broker.makerFee,
                            Broker.takerFee,
                            Broker.makerCourse,
                            tp,
                            sl,
                            type
                        ])

                        await connection.query(
                            "UPDATE balances SET amount = amount - ? WHERE asset = 'USD' AND type = 'trade'", [
                                Broker.makerCourse * amount
                            ]
                        )

                        console.log(`Opened order ${amount.toFixed(9)} at ${Broker.makerCourse} with fee ${Broker.makerFee} ...`)

                    }).finally(async () => await connection.commit())

            } catch (err) {
                await connection.rollback()
                console.log(err.message)
            }
            connection.end()

        })

    }




}

/**
 * Definition for long order type.
 * @type {string}
 */
Bank.ORDER_TYPE_LONG = 'LONG'

/**
 * Definition for short order type.
 * @type {string}
 */
Bank.ORDER_TYPE_SHORT = 'SHORT'

/**
 *
 * @type {Bank}
 */
module.exports = Bank