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

const Broker = require('./src/classes/broker')
const Trader = require('./src/classes/trader')
const OrderList = require('./src/classes/orderList')
const Purse = require('./src/classes/purse')
const Express = require('express')
const App = Express()
const Config = require('./src/modules/config')


/**
 * Set initial balance.
 * @type {number}
 */
Purse.balanceUsd = Config.startBalance;


/**
 * Bitfinex Broker inc. fees.
 */
const broker = new Broker(
    Config.broker.fees.maker,
    Config.broker.fees.taker
);



/**
 * Main thread.
 */
const trade = () => {
    broker.update(Trader.trade)
}
trade()
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


App.get('/history', (req, res) => {
    res.json(OrderList.history)
})

App.set('view engine', 'pug')
App.use(Express.static('public'))
App.listen(8080)
