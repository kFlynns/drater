const Bank = require("./bank")
const Broker = require("./broker")

class Trader
{

    /**
     * Calculate momentum of course movement
     * @returns {float}
     */
    static calculateMomentum()
    {

        let history = Trader._priceHistory
        history.push(Broker.course)

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
        return 100 / Broker.course * momentum

    }


    /**
     * open new order
     * @param {float} amount
     * @param {int} type
     * @param {float} tp
     * @param {float} sl
     */
    static openOrder(amount, type, tp, sl)
    {
        console.log(amount)
        // more money in purse -> higher risk
        let purseFactor = 1//Purse.balanceUsd / 10000 todo
        Bank.openOrder(
            amount,
            type,
            tp,
            sl
        )
        Trader._priceHistory = []

    }


    /**
     * Main method for trading.
     */
    static trade()
    {

        let momentum = Trader.calculateMomentum()

        // use a moderate momentum as trigger
        if (Math.abs(momentum) >= 0.02 && Math.abs(momentum) <= 0.1)
        {
            if (momentum < 0)
            {
                // momentum points in short, open buy order
                Trader.openOrder(
                    momentum / 10 * -1,
                    Bank.ORDER_TYPE_LONG,
                    Broker.takerCourse * (1 + momentum * -1 / 50),
                    false // we're bullish in btc, so no sl for long positions
                )
                return
            }
            // open sell order
            Trader.openOrder(
                momentum / 10,
                Bank.ORDER_TYPE_SHORT,
                Broker.makerCourse * (1 + momentum * -1 / 100),
                Broker.makerCourse * (1 - (momentum * -10) / 100) // risk ten times the reward
            )
        }
    }
}

Trader._priceHistory = []
module.exports = Trader