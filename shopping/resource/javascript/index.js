var main = function() {
    //初始化swiper
    var mySwiper1 = new Swiper('.swiper-container.banner-container', {
        pagination: '.swiper-pagination',
        loop: true,
        paginationClickable: true,
        autoplay: 4000,
        autoplayDisableOnInteraction: false
    })
    var mySwiper2 = new Swiper('.sale-container .swiper-container', {
        slidesPerView: '4',
        paginationClickable: true
    });
    //给下拉刷新部分加入‘第一页’的data
    $('.recommend-container').data('page', 1);
    //下拉刷新
    $(window).checkScroll();
    $(window).on('loadMore', function() {
        var $container = $('.recommend-container');
        var page = $container.data('page') + 1;
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: {
                name: 'shopping.sys.hot.goods',
                page: page
            },
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data, status) {
                var goods = data.data.hotgoods;
                $.each(goods, function(index) {
                    $container.find('ul').append('<li class="item"><img src="' + this.cover_pic + '" /><div class="item-detail"><span class="title">' + this.description + '</span><span class="price">+' + this.price + '</span></div></li>');
                })
                $container.data('page', page);
                $('#loading').hide();
                if (data.data.hotgoods.length == 0) {
                    $('#no-more').show();
                    $(window).off('touchmove');
                }
            },
            error: function() {}
        })
    })
}
$(document).ready(main);