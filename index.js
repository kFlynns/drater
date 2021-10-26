"use strict"

const moment = require('moment')
const axios = require('axios')
const express = require('express')
const app = express()

// min delta that must be reached to trigger a buy
const orderThreshold = 2.0

// factor on bid ask delta to create position size
const positionSizeFactor = 0.0001

// step to the last course to buy in (buy the dip)
const buyInThreshold = 10.0

/**
 * exchange data
 * @type {{
 *   price: number,
 *   bidSize: number,
 *   delta: number,
 *   orders: *[],
 *   askSize: number,
 *   lastDelta: number
 * }}
 */
let exchange = {
    price: 0.0,
    bidSize: 0.0,
    askSize: 0.0,
    delta: 0.0,
    lastPrice: 0.0,
    orders: []
}



/**
 * create new orders
 * @param price
 * @param amount
 * @returns {{update: (function(*): {profit: number|*, value}), close: close}}
 */
let orderFactory = (price, amount) => {
    let closePrice = 0.0
    let closed = false
    let date = moment(Date.now()).format('DD.MM.YYYY HH:mm:ss')
    return {
        update: () => {
            return {
                price: price,
                amount: amount,
                date: date,
                open: price * amount,
                value: (closed ? closePrice : exchange.price) * amount,
                closed: closed,
                percent: (100 - 100 / ((price * amount) / ((closed ? closePrice : exchange.price) * amount))) *-1
            }
        },
        close: () => {
            closed = true
            closePrice = exchange.price
        }
    }
}


/**
 *
 * @type {{print: (function(): void), update: purse.update}}
 */
let purse = (function () {
    let value = 0.0;
    let open = 0.0;
    return {
        print: () => {
            return {
                value: value,
                open: open
            }
        },
        update: close => {
            value = 0.0
            open = 0.0
            exchange.orders = exchange.orders.filter(order => {
                let state = order.update()
                if (close && state.percent > 1.0)
                {
                    order.close();
                }
                value += state.value
                open += state.open
                return true // close orders at TP?
            })
        }
    }
})();



/**
 *
 */
const trade = () => {
    axios({
        url: "https://api-pub.bitfinex.com/v2/ticker/tBTCUSD",
        method: "GET"
    }).then(response => {

        exchange.price = response.data[6]
        exchange.bidSize = response.data[1]
        exchange.askSize = response.data[3]
        exchange.delta = exchange.bidSize - exchange.askSize
console.log(exchange.delta, exchange.lastPrice + buyInThreshold, exchange.price)


        if (
            exchange.delta > orderThreshold &&
            exchange.lastPrice + buyInThreshold <= exchange.price
        ) {
            let positionSize = exchange.delta * positionSizeFactor
            exchange.orders.push(orderFactory(
                exchange.price,
                positionSize
            ))
            exchange.lastPrice = exchange.price
            console.log(`New order on ${exchange.price}, ${exchange.delta} ...`)
            purse.update(false)
        }
        else if(orderThreshold > exchange.delta)
        {
            purse.update(true)
        }
    })
}

setInterval(trade, 5000)
trade()



app.get('/', (req, res) => {
    res.render('index')
})

app.post('/purse', (req, res) => {
    res.json(purse.print())
})

app.post('/orders', (req, res) => {
    let result = []
    exchange.orders.forEach(order => {
        result.push(order.update())
    })
    res.json(result)
})

app.set('view engine', 'pug')
app.use(express.static('public'))
app.listen(8080)