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
            $.each(response, function () {
                tblOrders.find('*').remove();
                var tr = $(`<tr>
                    <td>${this['date']}</td>
                    <td>${this['open'].toFixed(4)}</td>
                    <td>${this['value'].toFixed(4)}</td>
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