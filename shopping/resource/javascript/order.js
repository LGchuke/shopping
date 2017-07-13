var main = function() {
    var type = 1;
    $('#order-container').data('page', 1);

    //下拉刷新
    $(window).checkScroll();
    $(window).on('loadMore', function() {
        var $container = $('#order-container');
        var page = $container.data('page') + 1;
        $container.data('page', page);
        console.log(type + '哇' + page)
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: {
                name: 'shopping.sys.order.info',
                type: type,
                page: page
            },
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data, status) {
                var allOrder = data.data;
                $.each(allOrder, function() {
                    $('#order-container').append('<div class="order-item to-comment" data-order_id="' + this.order_info.ems_no + '"><div class="order-header"><span class="fl order-shop">自营商城</span><span class="fr order-item-status"></span></div><a class="order-detail" href = "order-detail.html" ><img class="order-img" src ="' + this.goods_info.goods_pic + '" /><div class="order-info"><div class="fl title">' + this.goods_info.goods_name + '</div><div class="fr price">￥<span>' + this.goods_info.price + '</span></div><div class= "fl size">' + this.goods_info.description + '</div><div class = "fr piece">x<span>' + this.goods_info.goods_num + '</span></div><div class = "conclu">共<span class = "conclu-pi">' + this.order_info.goods_count + '</span>件商品 合计<span class = "conclu-pr">' + this.order_info.sum_price + '元</span>（包运费<span class = "conclu-de">' + this.order_info.postage + '</span>元）</div></div></a><div class = "order-footer"></div></div>');
                    var status = this.order_info.status;
                    var $thisOrder = $('.order-item').last();
                    switch (status) {
                        case 1:
                            $thisOrder.find('.order-item-status').text('待付款');
                            $thisOrder.find('.order-footer').append('<a class = "fr btn important pay"></a><a class = "fr btn default cancle"></a>');
                            break;
                        case 2:
                            $thisOrder.find('.order-item-status').text('待发货');
                            break;
                        case 3:
                            $thisOrder.find('.order-item-status').text('待收货');
                            $thisOrder.find('.order-footer').append('<a class = "fr btn important confirm"></a><a class = "fr btn default delivery" href = "delivery.html?id=' + this.order_info.ems_no + '"></a>');
                            break;
                        case 4:
                            $thisOrder.find('.order-item-status').text('待评价');
                            $thisOrder.find('.order-footer').append('<a class = "fr btn default comment"></a>');
                            break;
                        case 5:
                            $thisOrder.find('.order-item-status').text('退款');
                            break;
                        case 6:
                            $thisOrder.find('.order-item-status').text('退货');
                            break;
                        case 7:
                            $thisOrder.find('.order-item-status').text('交易关闭');
                            break;
                        case 8:
                            $thisOrder.find('.order-item-status').text('交易成功');
                            $thisOrder.find('.order-footer').append('<a class = "fr btn important delivery" href = "delivery.html?id=' + this.order_info.ems_no + '"></a>');
                            break;
                        case 9:
                            $thisOrder.find('.order-item-status').text('退款处理中');
                            break;
                        case 10:
                            $thisOrder.find('.order-item-status').text('退货处理中');
                            break;
                        case 11:
                            $thisOrder.find('.order-item-status').text('退款完成');
                            break;
                        case 12:
                            $thisOrder.find('.order-item-status').text('退货完成');
                            break;
                    }
                })
                if (allOrder == '') {
                    $('#no-more').show();
                }
            },
            error: function() {}
        })
    });
     //点击订单状态栏
    $('.order-status').click(function() {
        console.log('hey')
        $('.order-status.active').removeClass('active');
        $(this).addClass('active');
        $('#order-container').data('page', 0);
        type = $(this).data('status');
        $('.order-item').remove();
        $('#no-more').hide();
        $(window).trigger('loadMore');
    });
    //检查一开始是否有订单筛选
    var orderStatus = getParameterByName('status');
    $('.order-status[data-status='+orderStatus+']').trigger('click');
    //确认收货/取消订单-弹出框
    $('#order-container').on('click', '.btn.confirm,.btn.cancle', function() {
        if ($(this).hasClass('confirm')) {
            $('.weui_dialog_confirm').addClass('confirm');
        } else {
            $('.weui_dialog_confirm').addClass('cancle');
        }
        $(this).parents('.order-item').addClass('active');
    });
    //点击弹出框按钮
    $('.weui_btn_dialog').on('click', function() {
        var $dialog = $('.weui_dialog_confirm');
        var $activeOrder = $('.order-item.active');

        function sendRequest(name, cb) {
            $.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                method: 'post',
                data: {
                    name: name,
                    order_id: $('.order-item.active').data('order_id')
                },
                success: function(data, status) {
                    if (data.code == 1000) {
                        cb();
                        $dialog.removeClass('confirm').removeClass('cancle');
                        $activeOrder.removeClass('active');
                    }
                },
                error: function() {}
            })
        }
        //点击确认按钮
        if ($(this).hasClass('primary')) {
            //确认收货
            if ($dialog.hasClass('confirm')) {
                sendRequest('shopping.sys.confirm.order', function() {
                    var $btnChange = $activeOrder.find('.btn.confirm');
                    $activeOrder.find('.order-item-status').text('待评价');
                    $btnChange.removeClass('confirm').addClass('comment');
                })
            }
            //取消订单
            else if ($dialog.hasClass('cancle')) {
                sendRequest('shopping.sys.cancel.order', function() {
                    $activeOrder.find('.order-item-status').text('交易关闭');
                    $activeOrder.find('.btn').remove();
                })
            }
        }
        //点击取消按钮
        else {
            $dialog.removeClass('confirm').removeClass('cancle');
        }
    });
}
$(document).ready(main);