const OrderList = require("./orderList")
const Purse = require("./purse")
const moment = require("moment")
const crypto = require("crypto")
const Db = require("./db")
const Broker = require("./broker")

class Order
{

    /**
     * Create an order.
     * @param {float} price
     * @param {float} amount
     * @param {int} type
     */
    constructor(price, amount, type) {
        this._time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        this._openPrice = price
        this._amount = amount
        this._value = price * amount
        this._openValue = this._value
        this._change = 0.0
        this._type = type
        this._tp = false
        this._sl = false
        this._profit = 0.0
        this._id = crypto
            .randomBytes(4)
            .toString('hex')
        this.updateDatabase()
        Purse.spend(this._value)
        console.log(`Opened new ${type === Order.TYPE_LONG ? 'long' : 'short'} order ${this._id} at ${price}...`)

    }



    updateDatabase()
    {
        Db.getConnection(async connection => {
            try {
                connection.beginTransaction().then(async () => {

                    connection.query(`INSERT INTO trades (
                        amount,
                        maker_fee,
                        taker_fee,
                        open_course,
                        open_time,
                        type)
                    VALUES (?, ?, ?, ?, ?, ?)`, [
                        this._amount,
                        Broker.makerFee,
                        Broker.takerFee,
                        this._openPrice,
                        this._time,
                        this._type === Order.TYPE_SHORT ? 'SHORT' : 'LONG'
                    ])

                    connection.query("UPDATE balances SET amount = amount - ? WHERE asset = 'USD' AND type = 'trade'", [
                        this._openValue
                    ])

                    await connection.commit()
                    OrderList.add(this)

                })
            } catch (err) {
                console.log(err)
                await connection.rollback()
            }


        })
    }




    /**
     * Update order by actual course, return false if order get closed.
     * @param {float} price
     * @returns {boolean}
     */
    update(price)
    {
        this._profit =
            (this._openValue - (price * this._amount)) *
            (this._type === Order.TYPE_LONG ? -1 : 1)

        this._value = this._openValue + this._profit
        this._change = (100.0 - (100 / this._openValue * this._value)) * -1

        // close on tp
        if (
            this._tp !== false && (
                this._type === Order.TYPE_LONG  && price >= this._tp ||
                this._type === Order.TYPE_SHORT && price <= this._tp
            )
        ) {
            console.log(`Take profit ${this._profit} for ${this._id} at ${price}...`)
            this.close()
            return false
        }

        // close on sl
        if (
            this._sl !== false && (
                this._type === Order.TYPE_LONG  && price <= this._sl ||
                this._type === Order.TYPE_SHORT && price >= this._sl
            )
        ) {
            console.log(`Stop loss ${this._profit} for ${this._id} at ${price}...`)
            this.close()
            return false
        }

        return true
    }

    /**
     * Close order and retain money in purse.
     */
    close()
    {
        Purse.retain(this._value)
    }

    /**
     * Set TP.
     * @param {float} takeProfit
     */
    set tp(takeProfit)
    {
        this._tp = takeProfit
    }

    /**
     * Get TP.
     * @returns {boolean|float}
     */
    get tp()
    {
        return this._tp
    }

    /**
     * Set SL.
     * @param {float} stopLoss
     */
    set sl(stopLoss)
    {
        this._sl = stopLoss
    }

    /**
     * Get SL.
     * @returns {boolean|float}
     */
    get sl()
    {
        return this._sl
    }

    /**
     * Get actual value.
     * @returns {float}
     */
    get value()
    {
        return this._value
    }

    /**
     * Get percentual change.
     * @returns {number}
     */
    get change()
    {
        return this._change
    }


}

/**
 *
 * @type {number}
 */
Order.TYPE_SHORT = 0

/**
 *
 * @type {number}
 */
Order.TYPE_LONG =  1

/**
 *
 * @type {Order}
 */
module.exports = Order