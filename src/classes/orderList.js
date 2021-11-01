class OrderList
{

    /**
     * Add a new order to list, return position index in array.
     * @param {Order} order
     * @returns {int}
     */
    static add(order)
    {
        return OrderList._list.push(order) - 1
    }

    /**
     * Update all orders. Remove orders that closes from list.
     * @param {float} price
     */
    static update(price)
    {
        OrderList._value = 0.0
        OrderList._list = OrderList._list.filter(order => {
            if (order.update(price))
            {
                OrderList._value += order.value
                return true
            }
            OrderList._history.push(order)
            return false
        })
    }

    /**
     * Get the summary of values over all orders.
     * @returns {float}
     */
    static get value()
    {
        return OrderList._value
    }

    /**
     * Get order history and flush buffer.
     * @returns {*[]}
     */
    static get history()
    {
        let h = this._history;
        this._history = []
        return h;
    }

    /**
     * Search for orders.
     * @param {[]} criteria
     * @returns {[]|*[]}
     */
    static search(criteria)
    {
        if (typeof criteria === 'undefined' || criteria.length === 0)
        {
            return this._list
        }
        let found = []
        OrderList._list.forEach(order => {
            criteria.forEach(c => {
                if (order[c['key']] === c['value'])
                {
                    found.push(order)
                }
            })
        })
        return found
    }


}

/**
 * Summary of values over all orders.
 * @type {float}
 * @private
 */
OrderList._value = 0.0

/**
 * Internal order list.
 * @type {*[]}
 * @private
 */
OrderList._list = []


/**
 * History of closed orders.
 * @type {*[]}
 * @private
 */
OrderList._history = []

/**
 *
 * @type {OrderList}
 */
module.exports = OrderList