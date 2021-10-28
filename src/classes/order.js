const OrderList = require('./orderList')
const Purse = require('./purse')
const moment = require("moment");

class Order
{

    constructor(price, amount) {
        this._time = moment(Date.now()).format("DD.MM.YYYY HH:mm")
        this._openPrice = price
        this._amount = amount
        this._value = price * amount
        this._openValue = this._value
        this._change = 0.0
        this._listPosition = OrderList.add(this)
        Purse.spend(this._value)
    }

    update(price)
    {
        this._value = price * this._amount
        this._change = (100.0 - (100 / this._openValue * this._value)) * -1
    }

    close()
    {
        Purse.retain(this._value)
        OrderList.remove(this._listPosition)
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

module.exports = Order