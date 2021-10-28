class OrderList
{

    static add(order)
    {
        return OrderList._list.push(order) - 1
    }

    static remove(listPosition)
    {
        OrderList._list.splice(listPosition, 1)
    }

    static update(price)
    {
        this._list.forEach(order => order.update(price))
    }

    static get value()
    {
        let value = 0.0
        OrderList._list.forEach(order => {
            value += order.value
        })
        return value
    }

    static get averagePrice()
    {
        if (OrderList._list.length === 0)
        {
            return false
        }
        let length = 0
        let summary = 0.0
        OrderList._list.forEach(order => {
            summary += order.openPrice
            length++
        })
        return summary / length
    }

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

OrderList._list = []
module.exports = OrderList