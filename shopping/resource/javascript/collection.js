var main = function() {
    var page = 1;
    var $container = $('#collection-container');
    $('.item').each(function() {
       // $(this).slideCommon();
    })
    $(window).checkScroll();
    $(window).on('loadMore', function() {
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: {
                name: 'shopping.sys.collect.list',
                for_type: 'pre_goods',
                page: page
            },
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data, status) {
                var item = data.data.list;
                $.each(item, function() {
                    $container.append('<div class="item slide-common" data-slide="off" data-goods_id="' + this.goods_id + '"><div class="slide-common-show order-item"><div class="order-detail"><img class="order-img" src="' + this.picture + '"/><div class="order-info"><div class="title">' + this.description + '</div><div class="price">￥' + this.price + '</div></div></div></div><div class="delete slide-common-hide">删除</div></div>')
                    var $thisItem = $container.find('.item').last();
                    //var mcDetail = new Hammer($thisItem.find('.order-detail')[0]);
                    console.log($thisItem.data('goods_id'))
                    //mcDetail.on('tap', function(ev) {
                        //window.location.href = 'product.html?data=' + $thisItem.data('goods_id');
                    //})
                })
                page++;
                $('#loading').hide();
                if (item.length == 0) {
                    $('#no-more').show();
                }
            },
            error: function() {}
        })
    })
    $(window).trigger('loadMore')
}
$(document).ready(main);