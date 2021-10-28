class Purse
{

    static get balanceUsd()
    {
        return this._balanceUsd
    }

    static set balanceUsd(balanceUsd)
    {
        this._balanceUsd = balanceUsd
    }

    static spend(amount)
    {
        this._balanceUsd -= amount
    }

    static retain(amount)
    {
        this._balanceUsd += amount
    }

}

Purse._balanceUsd = 0.0
module.exports = Purse