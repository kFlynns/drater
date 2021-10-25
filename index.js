"use strict"

const axios = require('axios')
const express = require('express')
const app = express()
app.set('view engine', 'pug')
app.use(express.static('public'));

let orders = []
let lastDelta = 0.0


/**
 *
 * @param price
 * @param amount
 * @returns {{update: (function(*): {profit: number|*, value}), close: close}}
 */
let orderFactory = (price, amount) => {
    let closed = false
    return {
        update: actualPrice => {
            return {
                open: price * amount,
                spend: actualPrice * amount,
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
    let spend = 0.0;
    let open = 0.0;
    return {
        print: () => {
            return {
                spend: spend,
                open: open
            }
        },
        update: price => {
            spend = 0.0
            open = 0.0
            orders = orders.filter(order => {
                let state = order.update(price)
                spend += state.spend
                open += state.open
                return true
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
        method: "GET",
        headers: {},
        data: {}
    }).then(response => {

        let price = response.data[6]
        let bidSize = response.data[1]
        let askSize = response.data[3]
        let delta = bidSize - askSize

        if (delta - lastDelta > 1)
        {
            lastDelta = delta
            orders.push(orderFactory(
                price,
                delta / 10000
            ))
            console.log(`New order on ${price} ...`)
        }
        purse.update(price)
    })

}
setInterval(trade, 5000)
trade()



app.get('/', (req, res) => {
    res.render('index')
})

app.post('/get', (req, res) => {
    res.json(purse.print())
})
app.listen(8080)