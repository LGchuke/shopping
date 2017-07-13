var main = function() {
    var type = 1,
        page = 1;
    var $container = $('#search-result-container ul');
    var $orderItem = $('.order-item');
    var $orderPrice = $('.order-item.price'),
        $cheap = $('.cheap'),
        $expen = $('.expensive');
    //改变layout格式
    $('.search-container .layout').click(function() {
        $(this).toggleClass('pinterest').toggleClass('list');
        $('#search-result-container').toggleClass('common-list').toggleClass('pinterest').toggleClass('list');
    });
    //切换tab
    $orderItem.on('click', function(ev) {
        $expen.removeClass('active');
        $cheap.removeClass('active');
        $orderItem.removeClass('active');
        $(this).addClass('active');

        function orderCheap() {
            $expen.removeClass('active');
            $cheap.addClass('active');
            type = 4;
            $orderPrice.addClass('active').data('type', 5);
        }

        function orderExpen() {
            $expen.addClass('active');
            $cheap.removeClass('active');
            type = 5;
            $orderPrice.addClass('active').data('type', 4);
        }
        if ($(ev.target).hasClass('cheap')) orderCheap();
        else if ($(ev.target).hasClass('expensive')) orderExpen();
        else {
            type = $(this).data('type');
            if (type == 4) orderCheap();
            else if (type == 5) orderExpen();
        }
        page = 1;
        $('.item').remove();
        $(window).trigger('loadMore');
    });
    //初始化滚动条
    $(window).checkScroll();
    //查询是分类页进来的还是搜索页进来的
    var search = getParameterByName('search');
    var classAppendId = getParameterByName('class_append_id');
    $(window).on('loadMore', function() {
        var data;
        if (search == null) {
            data = {
                name: 'shopping.sys.catagory.goods',
                class_append_id: classAppendId
            }
        } else {
            data = {
                name: 'shopping.sys.search.goods',
                search: search
            }
        }
        data.type = type;
        data.page = page;
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: data,
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data, status) {
                var item = data.data.goods_list;
                $.each(item, function() {
                    $container.append('<li class="item"><img src="' + this.cover_pic + '"/><div class="item-detail"><span class="title">' + this.description + '</span><span class="price">￥' + this.price + '</span><span class="more-info"><span class="comments">' + this.comment_num + '</span>条评论 <span class="buyers">' + this.sales_num + '</span>人付款</span></div></li>')
                })
                page++;
                $('#loading').hide();
                if (item.length == 0) {
                    $('#no-more').show();
                }
            },
            error: function() {}
        })
    });
    $(window).trigger('loadMore');
}
$(document).ready(main);