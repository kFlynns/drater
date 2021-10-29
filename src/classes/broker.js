const axios = require("axios");

class Broker
{

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
            this._price = response.data[6]
            this._bidSize = response.data[1]
            this._askSize = response.data[3]
            callback(
                this._price,
                this._bidSize,
                this._askSize
            )
        });
    }

    /**
     *
     * @returns {float}
     */
    static get course()
    {
        return this._price
    }

}

/**
 *
 * @type {Broker}
 */
module.exports = Broker