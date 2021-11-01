/**
 * todo:
 *  - calculate risk to evaluate needed capital (max draw down 70 %)
 *  - convert reward to gross reward
 *      - tax 25 % on reward (germany)
 *   - fees (Bitfinex)
 *      - open 0.1 %
 *      - close 0.2 %
 *  - simulate events for testing
 *      - noise (extreme volatility)
 *      - linear increase / decrease (rally / crash)
 */

const Bank = require('./src/classes/bank')
const Broker = require('./src/classes/broker')
const Trader = require('./src/classes/trader')
const Express = require('express')
const App = Express()
const Config = require('./src/modules/config')

/**
 * Bitfinex Broker inc. fees.
 */
Broker.makerFee = Config.broker.fees.maker
Broker.takerFee = Config.broker.fees.taker

/**
 * Main thread.
 */
const trade = () => {
    Broker.update(() => {
        Trader.trade()
        Bank.update()
    })
}
setInterval(trade, 2500)



App.get('/', (req, res) => {
    res.render('index')
})

App.get('/info', (req, res) => {
    let value = OrderList.value
    res.json({
        course: Broker.course,
        startBalance: startBalance,
        balanceUsd: Purse.balanceUsd,
        orders: OrderList.search(),
        averagePrice: OrderList.averagePrice,
        value: value,
        change: (100 - (100 / startBalance * (Purse.balanceUsd + value))) * -1
    })
})


App.set('view engine', 'pug')
App.use(Express.static('public'))
App.listen(8080)