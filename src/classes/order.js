const OrderList = require("./orderList")
const Purse = require("./purse")
const moment = require("moment")
const crypto = require("crypto")
const Db = require("./db")
const Broker = require("./broker")

class Order
{




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


}


/**
 *
 * @type {Order}
 */
module.exports = Order