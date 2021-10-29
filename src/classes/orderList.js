class OrderList
{

    static add(order)
    {
        return OrderList._list.push(order) - 1
    }

    static remove(listPosition)
    {
        delete OrderList._list[listPosition]
        OrderList._list.splice(listPosition, 1)
    }

    static update(price)
    {
        OrderList._value = 0.0
        OrderList._list = OrderList._list.filter(order => {
            if (order.update(price))
            {
                OrderList._value += order.value
                return true
            }
            return false
        })
    }

    static get value()
    {
        return OrderList._value
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

OrderList._value = 0.0
OrderList._list = []
module.exports = OrderList