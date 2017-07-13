var main = function() {
    var $sumPrice = $('.sum-price');
    var userID = localStorage.getItem('userId');
    //检测是否全选中的function
    function checkSelected(objs) {
        var select = 0;
        objs.each(function() {
            if ($(this).hasClass('active')) select = 1;
            else {
                select = 0;
                return false;
            }
        })
        return select;
    }
    //计算价格的function
    function calPrice() {
        var price = 0;
        $('.radio.active').each(function() {
            var $cartItem = $(this).parents('.cart-item');
            var unitPrice = $cartItem.find('.price').text(),
                unit = $cartItem.find('.num').text();
            price = price + unitPrice * unit;
        })
        $sumPrice.text(price.toFixed(2))
    }

    function initial() {
        //增减数量
        $('.num-edit').each(function() {
            var $this = $(this);
            var $cartItem = $(this).parents('.cart-item');
            var $storeWarn = $this.find('.store-warn');
            $this.numEditor();
            $this.on('editNum', function(event, num) {
                $.ajax({
                    url: "http://mozhishi.com/shopping/php/PcApi",
                    method: 'post',
                    data: {
                        name: 'shopping.sys.shopcart.num.change',
                        user_id: userID,
                        goods_id: $cartItem.data('goods_id'),
                        goods_num: num,
                        is_selected: $cartItem.data('selected')
                    },
                    success: function(data, status) {
                        console.log(data)
                        var store = data.data.store;
                        if (data.code == 1000) {
                            //成功
                        } else if (data.code == 1035) {
                            $cartItem.find('.num').text(store);
                        }
                        $this.data('store', store)
                        calPrice();
                        if (store < num + 3) {
                            $storeWarn.text('（库存仅' + store + '件）');
                        } else {
                            $storeWarn.text('');
                        }
                    }
                })
            });
        });
        //多選radioBox
        $('.cart-item .radio').each(function() {
            var thisRadioKids = $(this).parents('.cart-cart').find('.radio');
            var cart = $(this).parents('.cart').find('.shop').find('.radio');
            var allRadioKids = $('#cart-container .cart-item').find('.radio');
            $(this).radioBox('multiple');
            thisRadioKids.on('checkSelected', function(e) {
                if (checkSelected(thisRadioKids) == 1) cart.addClass('active');
                else cart.removeClass('active');
                if (checkSelected(allRadioKids) == 1) $('#select-all').addClass('active');
                else $('#select-all').removeClass('active');
                calPrice();
            })
        });
        //选择店铺名的时候
        $('.shop .radio').on('click', function() {
            var cart = $(this).parents('.cart');
            var thisRadioKids = cart.find('.radio');
            var allCart = $('#cart-container .shop .radio');
            if ($(this).hasClass('active')) {
                thisRadioKids.removeClass('active');
                $('#select-all').removeClass('active');
            } else {
                thisRadioKids.addClass('active');
                if (checkSelected(allCart) == 1) $('#select-all').addClass('active');
            }
            calPrice();
        });
        //选择全选按钮
        $('#select-all').on('click', function() {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $('.cart .radio').addClass('active');
            } else {
                $('.cart .radio').removeClass('active');
            }
            calPrice();
        })
    }
    //获取购物车信息
    $.ajax({
        url: "http://mozhishi.com/shopping/php/PcApi",
        method: 'post',
        data: {
            name: 'shopping.sys.shop.cart',
            user_id: userID
        },
        success: function(data, status) {
            if (data.code == 1000) {
                var item = data.data.shop_cart_info;
                if (item.length == 0) {
                    $('#cart-container,#cart-footer,label.edit').remove();
                    $('#empty-container').show();
                } else {
                    $('#cart-container').append('<div class="cart"><div class="shop"><div class="common-radio-group"><div class="radio"></div></div><span class="shop-name">XXX自营</span></div><div class="cart-cart"></div></div>')
                    $.each(item, function() {
                        $('.cart-cart').append('<div class="cart-item" data-goods_id="' + this.goods_id + '" data-pre_goods_id="' + this.pre_goods_id + '" data-selected=0><div class="common-radio-group"><div class="radio"></div></div><img class="" src="' + this.goods_pic + '"/><div class="detail"><p class="name">' + this.goods_name + '</p><p>' + this.description + '</p><p class="price">' + this.price + '</p><div class="fr num-edit"><span class="num-minus"></span><span class="num">' + this.goods_num + '</span><span class="num-add"></span><p class="store-warn"></p></div></div></div>')
                    })
                    initial();
                }
            }
        }
    });
    //去生成订单
    $('.go-pay').on('click',function(){
        var goodsIdOrder = [];
        $('.cart-item .radio.active').each(function(){
            goodsIdOrder.push($(this).parents('.cart-item').data('goods_id'));
        })
        if(goodsIdOrder.length > 0){
            localStorage.setItem('goosIdOrder',goodsIdOrder.join(','));
            window.location.href = 'createOrder.html'
        } else {
            alert('你还没选择任何商品喔!');
        }
    })
    //切换编辑完成按钮
    $('#second-header-container .edit').on('click', function() {
        $(this).toggleClass('editing');
        if ($(this).hasClass('editing')) {
            $('#cart-footer').addClass('editing');
            $(this).text('完成');
        } else {
            $('#cart-footer').removeClass('editing');
            $(this).text('编辑');
        }
    });
    //移入收藏夹
    function toCollect(item) {
        $.ajax({
            url: "http://mozhishi.com/shopping/php/PcApi",
            method: 'post',
            data: {
                name: 'shopping.sys.collect',
                for_id: item.data('goods_id'),
                for_type: 'pre_goods'
            },
            success: function(data, status) {
                if (data.code == 1000) {
                    //-->>不用再从购物车删除该商品？
                    console.log('收藏成功');
                }
            }
        });
    }
    //删除
    function toDelete(item) {
        $.ajax({
            url: "http://mozhishi.com/shopping/php/PcApi",
            method: 'post',
            data: {
                name: 'shopping.sys.del.goods',
                user_id: userID,
                goods_id: item.data('goods_id'),
                is_selected: 1
            },
            success: function(data, status) {
                if (data.code == 1000) {
                    item.remove();
                    calPrice();
                    console.log('删除成功');
                }
            }
        });
    }
    var $cover = $('.weui_dialog_confirm');
    $cover.on('click', '.weui_btn_dialog.primary', function() {
        var activeItems = $('.radio.active').parents('.cart-item');
        if ($cover.hasClass('collect')) {
            activeItems.each(function() {
                toCollect($(this));
            })
        } else {
            activeItems.each(function() {
                toDelete($(this));
            })
        }
    });
    //点击删除按钮
    $('.footer-item .delete').on('click', function() {
            $cover.addClass('delete').show();
        })
        //点击收藏按钮
    $(".footer-item .collect").on("click", function() {
        $cover.addClass('collect').show();
    });
    //取消弹出层
    $cover.on('click', function() {
        $cover.removeClass('collect').removeClass('delete').hide();
    })
}
$(document).ready(main);