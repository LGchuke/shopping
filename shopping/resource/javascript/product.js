var main = function() {
    var $btn = $('.footer.common-btn');
    var userID = localStorage.getItem('userId');
    //初始化swiper
    var mySwiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
    //点击加入购物车
    $('.add-cart').on('click', function() {
        $('.cover').show();
    });

    function checkAdd() {
        var result = 0;
        var attrId = [];
        $('.optional-option').each(function() {
            if ($(this).hasClass('selected')) {
                result = 1;
                attrId.unshift($(this).find('.opt-item.active').data('attribute_id'));
            } else {
                result = 0;
                return false;
            }
        });
        if (result == 1) {
            checkStorage(attrId);
            $btn.addClass('active');
        } else $btn.removeClass('active');
    }
    var goodsId;

    function checkStorage(attrId) {
        var $optActive = $('.opt-item.active');
        var attribute = '';
        $.each(attrId, function() {
            attribute = this + ',' + attribute;
        })
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: {
                name: 'shopping.sys.goods.detail',
                pre_goods_id: $("#container").data('pre_goods_id'),
                attribute: attribute.slice(0, -1)
            },
            method: 'post',
            success: function(data, status) {
                var good = data.data.goods_info;
                var $num = $('.num-edit .num');
                $('.small-img').attr('src', good.picture);
                $('.opt-price').text('￥' + good.price);
                $('.opt-storage').text('库存：' + good.stores);
                $('.num-edit').data('store', good.stores);
                goodsId = data.data.goods_info.goods_id;
                //当选择商品数>库存时
                if ($num.text() >= good.stores) {
                    $num.text(good.stores);
                    if (good.stores == 0) {
                        $('.num-add').addClass('disable');
                        $btn.removeClass('active');
                    }
                } else if ($num.text() == 0) {
                    $num.text(1);
                    $('.num-add').removeClass('disable');
                }
            }
        });
    }
    //选择颜色尺码
    $('#option .main').on('click', '.opt-item', function() {
        var option = $(this).parents('.optional-option');
        if (!$(this).hasClass('disabled')) {
            if ($(this).hasClass('active')) {
                option.removeClass('selected');
            } else {
                option.addClass('selected');
            }
            $(this).siblings().removeClass('active');
            $(this).toggleClass('active');
            checkAdd();
        }
    });
    //增减数量
    $('.num-edit').numEditor();
    //点击关闭按钮
    $('.opt-close').on('click', function() {
        $('.cover').hide();
    });
    //商品加入购物车
    $btn.on('click', function() {
        if ($(this).hasClass('active')) {
            $.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                data: {
                    name: 'shopping.sys.add.goods',
                    user_id: 100039,
                    goods_id: goodsId,
                    goods_num: $('.num-edit .num').text()
                },
                method: 'post',
                success: function(data, status) {
                    if (data.code == 1000) {
                        myAlert('加入购物车成功!')
                    }
                }
            });
        }
    })

    function collection(name, gesture) {
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: {
                name: name,
                for_type: 'pre_goods',
                for_id: $("#container").data('pre_goods_id'),
            },
            method: 'post',
            success: function(data, status) {
                if (data.code == 1000) {
                    if(gesture == false) myAlert('取消收藏成功!');
                    else myAlert('收藏成功!')
                }
            }
        });
    }
    //点击收藏/取消收藏
    $('.collection').on('click', function() {
        if ($(this).hasClass('active')) {
            collection('shopping.sys.collect.cancel', false);
        } else {
            collection('shopping.sys.collect', true);
        }
        $(this).toggleClass('active');
    })
    //点击购物车
    $('#cart').on('click',function(){
        if(userID == null){
            window.location.href='login.html';
        } else {
           window.location.href='cart.html';
        }
    })
}
$(document).ready(main);