const Broker = require('./src/classes/broker')
const Trader = require('./src/classes/trader')
const OrderList = require('./src/classes/orderList')
const Purse = require('./src/classes/purse')
const express = require('express')
const app = express()


const startBalance = 10000.0

/**
 * Set initial balance.
 * @type {number}
 */
Purse.balanceUsd = startBalance;

/**
 * Main thread.
 */
const trade = () => {
    Broker.update(Trader.trade)
}
trade()
setInterval(trade, 2500)



app.get('/', (req, res) => {
    res.render('index')
})

app.get('/info', (req, res) => {

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

app.post('/orders', (req, res) => {
    res.json()
})

app.set('view engine', 'pug')
app.use(express.static('public'))
app.listen(8080)
