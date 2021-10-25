(function($, window) {

    var update = function () {
        $.ajax({
            url: '/purse',
            method: 'post',
            data: {
                nc: Date.now()
            }
        }).done(function (response) {
            divOpen.text(response.open.toFixed(4))
            divValue.text(response.value.toFixed(4))
        });

        $.ajax({
            url: '/orders',
            method: 'post',
        }).done(function (response) {
            tblOrders.find('*').remove();
            $.each(response, function () {
                var tr = $(`<tr>
                    <td>${this['date']}</td>
                    <td class="text-right">${this['open'].toFixed(4)}</td>
                    <td class="text-right">${this['value'].toFixed(4)}</td>
                    <td class="text-right">${this['percent'].toFixed(4)}</td>
                    <td>${this['closed']}</td>
                `);
                tblOrders.append(tr);
            });
        });

    };

    var divOpen;
    var divValue;
    var tblOrders;

    $(document).ready(function() {
        divOpen = $('div#div-open');
        divValue = $('div#div-value');
        tblOrders = $('table#tbl-orders tbody');
        setInterval(
            update,
            5000
        );
        update();
    });

})(jQuery, window);