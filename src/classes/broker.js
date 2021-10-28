const axios = require("axios");

class Broker
{

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


}

module.exports = Broker