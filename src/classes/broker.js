const axios = require("axios");

class Broker
{

    /**
     *
     * @param {float} takerFee
     * @param {float} makerFee
     */
    constructor(takerFee, makerFee) {
        this._takerFee = takerFee
        this._makerFee = makerFee
    }


    /**
     * Fee on open.
     * @returns {float}
     */
    get makerFee()
    {
        return this._makerFee
    }

    /**
     * Fee on close.
     * @returns {float}
     */
    get takerFee()
    {
        return this._takerFee
    }

    /**
     * Update state from broker.
     * @param {function} callback
     */
    update(callback)
    {
        axios({
            url: "https://api-pub.bitfinex.com/v2/ticker/tBTCUSD",
            method: "GET"
        }).then(response => {
            this._price = response.data[6]
            this._bidSize = response.data[1]
            this._askSize = response.data[3]
            callback(
                this._price,
                this._bidSize,
                this._askSize,
                this._makerFee,
                this._takerFee
            )
        });
    }

    /**
     * Get course including maker fee.
     * @returns {float}
     */
    get makerCourse()
    {
        return this._price * (1 + this._price * this._makerFee)
    }

    /**
     * Get course including taker fee.
     * @returns {float}
     */
    get takerCourse()
    {
        return this._price * (1 + this._price * this._takerFee)
    }

    /**
     * Get course without fees.
     * @returns {float}
     */
    get course()
    {
        return this._price
    }

}

/**
 *
 * @type {Broker}
 */
module.exports = Broker