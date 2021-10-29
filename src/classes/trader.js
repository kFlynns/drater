const OrderList = require("./orderList");
const Order = require("./order");

class Trader
{


    static calculateMomentum(price)
    {

        let history = Trader._priceHistory
        history.push(price)

        if (history.length === 6)
        {
            history.splice(0, 1)
        }

        let direction = 0
        let lastDirection = false
        let momentum = 0

        for (let i = history.length - 1;  i > 0; i--)
        {

            let velocity = history[i - 1] - history[i]
            if (velocity === 0)
            {
                // there was no movement
                continue
            }

            // > 0: up, < 0: down
            direction = (velocity / Math.abs(velocity)) * -1

            if (!(lastDirection === false || direction === lastDirection ))
            {
                // direction has changed
                continue
            }
            momentum += velocity * -1
            lastDirection = direction

        }
        return 100 / price * momentum

    }



    static trade(price)
    {

        OrderList.update(price)
        let momentum = Trader.calculateMomentum(price)
        console.log(momentum)
        if (Math.abs(momentum) >= 0.01)
        {
            if (momentum < 0)
            {
                // momentum points in short, open buy order
                let order = new Order(
                    price,
                    momentum / 20 * -1,
                    Order.TYPE_LONG
                )
                order.tp = price * (1 + momentum * -1 / 100)
                Trader._priceHistory = []
                return
            }
            // open sell order
            let order = new Order(
                price,
                momentum / 20,
                Order.TYPE_SHORT
            )
            order.tp = price * (1 + momentum * -1 / 100)
            Trader._priceHistory = []
        }
    }
}

/**
 * Min delta that must be reached to trigger a buy.
 */
Trader._orderThreshold = 5.0
Trader._lastBuyingPrice = 0.0
Trader._priceHistory = []

module.exports = Trader