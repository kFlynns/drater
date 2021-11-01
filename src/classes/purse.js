class Purse
{

    /**
     * Get the actual balance.
     * @returns {float}
     */
    static get balanceUsd()
    {
        return this._balanceUsd
    }

    /**
     * Set the balance.
     * @param balanceUsd
     */
    static set balanceUsd(balanceUsd)
    {
        this._balanceUsd = balanceUsd
    }

    /**
     * Take money out of the purse.
     * @param amount
     */
    static spend(amount)
    {
        this._balanceUsd -= amount
    }

    /**
     * Ratain money to the purse.
     * @param amount
     */
    static retain(amount)
    {
        this._balanceUsd += amount
    }

}

/**
 * internal balance.
 * @type {number}
 * @private
 */
Purse._balanceUsd = 0.0

/**
 *
 * @type {Purse}
 */
module.exports = Purse