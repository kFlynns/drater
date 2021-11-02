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
        return Broker.course + Broker.course * (Broker._makerFee / 100)
    }

    /**
     * Get course excluding taker fee.
     * @returns {float}
     */
    static get takerCourse()
    {
        return Broker.course - Broker.course * (Broker._takerFee / 100)
    }

    /**
     * Get course without fees.
     * @returns {float}
     */
    static get course()
    {
        return Broker._course
    }

}

/**
 *
 * @type {Broker}
 */
module.exports = Broker