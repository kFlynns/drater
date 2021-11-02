const Db = require("./db")
const Broker = require("./broker")

class Bank
{

    /**
     * Update trades table.
     */
    static update()
    {
        /**
         * Order where opened to maker course (btc usd + maker fee) and closed if
         */
        Db.getConnection(async connection => {
            try
            {
                let ordersToClose = []
                connection
                    .beginTransaction()
                    // close tp
                    .then(async () => {
                        (await connection
                            .query("SELECT * FROM `trades` WHERE `take_profit` <= ? AND `close_time` IS NULL", [
                                Broker.course
                            ])
                        ).forEach(row => {
                            ordersToClose.push([
                                Broker.course,
                                row["trade_id"]
                            ])
                        })

                    })
                    // close sl
                    .then(async () => {
                        (await connection
                            .query("SELECT * FROM `trades` WHERE `stop_loss` >= ? AND `close_time` IS NULL", [
                                Broker.course
                            ])
                        ).forEach(row => {
                            ordersToClose.push([
                                Broker.course,
                                row["trade_id"]
                            ])
                        })
                    })
                    .finally(async () => {
                        if (ordersToClose.length > 0)
                        {
                            await this.closeOrders(ordersToClose)
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


    static async closeOrders(ordersToClose)
    {
        try
        {

            connection
                .beginTransaction()
                .then(async () => {

                    await connection
                        .batch(
                            "UPDATE `trades` SET `close_time` = NOW(), `close_course` = ? WHERE `trade_id` = ?",
                            ordersToClose
                        )

                    await connection
                        .batch(
                            "UPDATE `balances` SET `amount` = `amount` - :amountBtc WHERE `type` = 'trade' AND `asset` = 'btc'",
                            ordersToClose
                        )

                })
                .finally(await connection.commit())

        }
        catch (err)
        {
            await connection.rollback()
            console.log(err)
        }
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
                            market_course,
                            open_course,
                            open_time,
                            take_profit,
                            stop_loss,
                            type
                        ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)`, [
                            amount,
                            Broker.makerFee,
                            Broker.takerFee,
                            Broker.course,
                            Broker.makerCourse,
                            Broker.makerCourse * tp * (1 + Broker.takerFee / 100),
                            sl,
                            type
                        ])

                        await connection.query(
                            "UPDATE balances SET amount = amount - ? WHERE asset = 'USD' AND type = 'trade'", [
                                Broker.makerCourse * amount
                            ]
                        )
                        await connection.query(
                            "UPDATE balances SET amount = amount + ? WHERE asset = 'BTC' AND type = 'trade'", [
                                amount
                            ]
                        )


                        console.log(`Opened ${type} order for ${amount.toFixed(9)} BTC at ${Broker.makerCourse.toFixed(9)} USD with fee ${Broker.makerFee} % ...`)

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