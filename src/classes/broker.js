const axios = require("axios");

class Broker
{

    /**
     * Set maker fee.
     * @param {float} fee
     */
    static set makerFee(fee)
    {
        Broker._makerFee = fee
    }

    /**
     * Set taker fee.
     * @param {float} fee
     */
    static set takerFee(fee)
    {
        Broker._takerFee = fee
    }

    /**
     * Fee on open.
     * @returns {float}
     */
    static get makerFee()
    {
        return Broker._makerFee
    }

    /**
     * Fee on close.
     * @returns {float}
     */
    static get takerFee()
    {
        return Broker._takerFee
    }

    /**
     * Update state from broker.
     * @param {function} callback
     */
    static update(callback)
    {
        axios({
            url: "https://api-pub.bitfinex.com/v2/ticker/tBTCUSD",
            method: "GET"
        }).then(response => {
            Broker._price = response.data[6]
            Broker._bidSize = response.data[1]
            Broker._askSize = response.data[3]
            callback(
                Broker._price,
                Broker._bidSize,
                Broker._askSize
            )
        });
    }

    /**
     * Get course including maker fee.
     * @returns {float}
     */
    get makerCourse()
    {
        return Broker._price * (1 + this._price * Broker._makerFee)
    }

    /**
     * Get course including taker fee.
     * @returns {float}
     */
    get takerCourse()
    {
        return Broker._price * (1 + this._price * Broker._takerFee)
    }

    /**
     * Get course without fees.
     * @returns {float}
     */
    get course()
    {
        return Broker._price
    }

}

/**
 *
 * @type {Broker}
 */
module.exports = Broker