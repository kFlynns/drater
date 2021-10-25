"use strict"

const moment = require('moment')
const axios = require('axios')
const express = require('express')
const app = express()

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
    lastDelta: 0.0,
    delta: 0.0,
    orders: []
}



/**
 * create new orders
 * @param price
 * @param amount
 * @returns {{update: (function(*): {profit: number|*, value}), close: close}}
 */
let orderFactory = (price, amount) => {
    let closed = false
    let date = moment(Date.now()).format('DD.MM.YYYY HH:mm:ss')
    return {
        update: () => {
            return {
                date: date,
                open: price * amount,
                value: exchange.price * amount,
                closed: closed
            }
        },
        close: () => {
            closed = true
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
        update: () => {
            value = 0.0
            open = 0.0
            exchange.orders = exchange.orders.filter(order => {
                let state = order.update()
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

        if (exchange.delta - exchange.lastDelta > 1)
        {
            let positionSize = exchange.delta / 10000
            exchange.lastDelta = exchange.delta
            exchange.orders.push(orderFactory(
                exchange.price,
                positionSize
            ))
            console.log(`New order on ${exchange.price} ...`)
        }
        purse.update(exchange.price)
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