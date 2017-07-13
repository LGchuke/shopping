var main = function() {
    $.ajax({
        url: "http://121.40.91.157/shopping/php/PcApi",
        data: {
            name: 'shopping.sys.sms.search',
            id: getParameterByName('id')
        },
        success: function(data, status) {
            if (data.success == true) {
                $('.company').text(data.data['com']);
                $('.num').text(data.data['nu']);
                var detail = data.data['data'];
                $.each(detail, function(index) {
                    $('#delivery-step-container').prepend('<div class="fr step-item"><p class="step-detail">' + this.context + '</p><p class="step-time">' + this.time + '</p><div class="side"><div class="dot"></div><div class="line"></div></div></div>');
                });
            } else if(data.success == false){
                $('#delivery-num-container').remove();
                nothingAlert('暂时查询不到订单~><');
            }
        },
        error: function() {}
    })
}
$(document).ready(main);