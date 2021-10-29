(function($, window) {

    var update = function () {
        $.ajax({
            url: '/info',
            method: 'get',
            data: {
                nc: Date.now()
            }
        }).done(function (response) {

            $('td#td-course').text(response.course.toFixed(4));
            $('td#td-start-balance').text(response.startBalance.toFixed(4));
            $('td#td-balance').text(response.balanceUsd.toFixed(4));
            $('td#td-value').text(response.value.toFixed(4));
            $('td#td-summary').text(
                (response.value + response.balanceUsd).toFixed(4)
            );
            $('td#td-change').text(response.change.toFixed(4));

            tblOrders.find('*').remove();
            $.each(response.orders, function () {
                var tr = $(`<tr>
                    <td>${this['_id']}</td>
                    <td>
                        ${this['_time']}
                    </td>
                    <td>
                        ${this['_type'] === 1 ? 'LONG' : 'SHORT'}
                    </td>
                    <td class="text-right">
                        ${this['_openPrice'].toFixed(4)}
                    </td>
                    <td class="text-right">
                        ${this['_tp'].toFixed(4)}
                    </td>
                    <td class="text-right">
                        ${this['_amount'].toFixed(4)}
                    </td>
                    <td class="text-right">
                        ${this['_openValue'].toFixed(4)}
                    </td>
                    <td class="text-right">
                        ${this['_value'].toFixed(4)}
                    </td>
                    <td class="text-right">
                        ${this['_change'].toFixed(4)}
                    </td>
                `);
                tblOrders.append(tr);
            });
        });


    };


    var tblOrders;

    $(document).ready(function() {
        tblOrders = $('table#tbl-orders tbody');
        setInterval(
            update,
            2500
        );
        update();
    });

})(jQuery, window);