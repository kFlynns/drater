const OrderList = require("./orderList");
const Order = require("./order");
const Purse = require("./purse")

class Trader
{

    /**
     * Calculate momentum of course movement
     * @param {float} price
     * @returns {number}
     */
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
                return 0.0
            }
            momentum += velocity * -1
            lastDirection = direction

        }
        return 100 / price * momentum

    }



    static openOrder(price, amount, type, tp, sl)
    {
        // more money in purse -> higher risk
        let purseFactor = Purse.balanceUsd / 10000
        let order = new Order(
            price,
            amount * purseFactor,
            type
        )
        order.tp = tp
        order.sl = sl
        Trader._priceHistory = []
    }


    /**
     * Main method for trading.
     * @param {float} price
     */
    static trade(price)
    {

        OrderList.update(price)
        let momentum = Trader.calculateMomentum(price)

        // use a moderate momentum as trigger
        if (Math.abs(momentum) >= 0.02 && Math.abs(momentum) <= 0.1)
        {
            if (momentum < 0)
            {
                // momentum points in short, open buy order
                Trader.openOrder(
                    price,
                    momentum / 10 * -1,
                    Order.TYPE_LONG,
                    price * (1 + momentum * -1 / 50),
                    false // we're bullish in btc, so no sl for long positions
                )
                return
            }
            // open sell order
            Trader.openOrder(
                price,
                momentum / 10,
                Order.TYPE_SHORT,
                price * (1 + momentum * -1 / 100),
                price * (1 - (momentum * -10) / 100) // risk ten times the reward
            )
        }
    }
}

Trader._priceHistory = []
module.exports = Trader