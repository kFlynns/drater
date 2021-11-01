const axios = require("axios");

class Broker
{

    /**
     * Set maker fee.
     * @param {float} fee
     */
    static set makerFee(fee)
    {
        Broker._makerFee = fee / 100
    }

    /**
     * Set taker fee.
     * @param {float} fee
     */
    static set takerFee(fee)
    {
        Broker._takerFee = fee / 100
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
            Broker._course = response.data[6]
            callback()
        });
    }

    /**
     * Get course including maker fee.
     * @returns {float}
     */
    static get makerCourse()
    {
        return parseFloat(Broker.course + Broker.course * Broker._makerFee).toFixed(9)
    }

    /**
     * Get course including taker fee.
     * @returns {float}
     */
    static get takerCourse()
    {
        return parseFloat(Broker.course + Broker.course * Broker._takerFee).toFixed(9)
    }

    /**
     * Get course without fees.
     * @returns {float}
     */
    static get course()
    {
        return parseFloat(Broker._course).toFixed(9)
    }

}

/**
 *
 * @type {Broker}
 */
module.exports = Broker