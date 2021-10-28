const OrderList = require("./orderList");
const Order = require("./order");

class Trader
{

    static trade(price, bidSize, askSize)
    {

        OrderList.update(price)
        let delta = bidSize - askSize

        // do nothing if threshold was not reached
        if (delta < Trader._orderThreshold)
        {
            return
        }

        // don't buy in to the last price
        if (Math.abs(Trader._lastBuyingPrice - price) <= 10)
        {
            return
        }

        if (
            OrderList.averagePrice === false ||
            price < OrderList.averagePrice - 10
        ) {
            Trader._lastBuyingPrice = price
            new Order(price, delta * 0.0001)
            console.log(`Opened new order at ${price}...`)
        }
    }
}

/**
 * Min delta that must be reached to trigger a buy.
 */
Trader._orderThreshold = 5.0
Trader._lastBuyingPrice = 0.0

module.exports = Trader