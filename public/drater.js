(function($, window) {

    var update = function () {
        $.ajax({
            url: '/get',
            method: 'post',
            data: {
                nc: Date.now()
            }
        }).done(function (response) {
            divOpen.text(response.open.toFixed(4))
            divSpend.text(response.spend.toFixed(4))
        });
    };

    var divOpen;
    var divSpend;

    $(document).ready(function() {
        divOpen = $('div#div-open');
        divSpend = $('div#div-spend');
        setInterval(
            update,
            5000
        );
        update();
    });

})(jQuery, window);