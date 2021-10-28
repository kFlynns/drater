const OrderList = require('./orderList')
const Purse = require('./purse')
const moment = require("moment");

class Order
{

    constructor(price, amount, type) {
        this._time = moment(Date.now()).format("DD.MM.YYYY HH:mm")
        this._openPrice = price
        this._amount = amount
        this._value = price * amount
        this._openValue = this._value
        this._change = 0.0
        this._type = type
        this._listPosition = OrderList.add(this)
        this._tp = false
        Purse.spend(this._value)
    }

    update(price)
    {
        this._value = price * this._amount
        this._change = (100.0 - (100 / this._openValue * this._value)) * (this._type === Order.TYPE_LONG ? -1 : 1)
        if (this._tp !== false && this._value.toFixed(1) === price.toFixed(1))
        {
            this.close()
        }
    }

    close()
    {
        Purse.retain(this._value * (this._type === Order.TYPE_LONG ? 1 : -1))
        OrderList.remove(this._listPosition)
    }

    set tp(takeProfit)
    {
        this._tp = takeProfit
    }

    get tp()
    {
        return this._tp
    }

    get openPrice()
    {
        return this._openPrice
    }

    get value()
    {
        return this._value
    }

    get amount()
    {
        return this._amount
    }

    get change()
    {
        return this._change
    }


}

Order.TYPE_SHORT = 0
Order.TYPE_LONG =  1
module.exports = Order