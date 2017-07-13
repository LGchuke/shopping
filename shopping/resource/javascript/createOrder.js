var main = function() {
    var $address = $('#address-container');
    var totalPrice;
    //拉取信息
    $.ajax({
        url: "http://mozhishi.com/shopping/php/PcApi",
        method: 'post',
        data: {
            name: 'shopping.sys.settle.account',
            user_id: 100039,
            goods_id: localStorage.getItem('goosIdOrder')
        },
        success: function(data, status) {
            var goodsInfo = data.data.goods_info;
            var addressInfo = data.data.address_info;

            function fillAddress(addressInfo) {
                $address.data('id', addressInfo.address_id);
                $address.append(' <p><span>' + addressInfo.receive_name + '</span><span>' + addressInfo.receive_mobile + '</span></p><img class="fl" src="resource/image/member/shoppingcart_location@2x.png" /><span class="fl road">' + addressInfo.address + '</span>');
            };
            //地址部分
            var addressInfoStorage = localStorage.getItem('addressInfo');
            if (addressInfoStorage !== null) {
                fillAddress(addressInfoStorage);
            } else if (data.data.is_address == 0) {
                $('#address-container').append('<img class="fl" src="resource/image/member/shoppingcart_location@2x.png" /><p style="margin-left:.5rem">请填写收货地址</p>')
            } else {
                fillAddress(addressInfo);
            }
            //商品部分
            $.each(goodsInfo, function() {
                $('#createOrder-container').append('<div class="order-item" data-id="' + this.goods_id + '"><span class="pic"><img src="' + this.goods_pic + '" /></span><div class="detail"><p>' + this.goods_name + '</p><p>' + this.description + '</p><span class="price">￥' + this.price + '</span><span class="fr">X' + this.goods_num + '</span></div></div>');
            })
            price = data.data.sum_price;
            $('.total-price').text('￥' + price);
            $('#createOrder-credit .fr').append(data.data.available_score);
            $('#createOrder-delivery .fr').append('￥' + data.data.postage);
        }
    });
    //去付款
    $('.pay').on('click', function() {
        $.ajax({
            url: "http://mozhishi.com/shopping/php/PcApi",
            method: 'post',
            data: {
                name: 'shopping.sys.submit.order',
                address_id: $address.data('id'),
                goods_id: localStorage.getItem('goosIdOrder'),
                is_selected: 0
            },
            success: function(data, status) {
                if (data.code == 1000) {
                    //提交成功
                    console.log(data)
                    pay(data.data.order_form_log_id);
                }
            }
        });
    });

    function pay(id) {
        console.log(id)
        $.ajax({
            url: "http://mozhishi.com/shopping/php/PcApi",
            method: 'post',
            data: {
                name: 'shopping.sys.goods.pay',
                user_id: localStorage.getItem('userId'),
                channel: 'wx_pub',
                amount: price*100,
                order_no: '23564585122',
                type: 1,
                add_scores: $('#createOrder-credit .fr').text(),
                reduce_scores: 0,
                description: id
            },
            success: function(data, status) {
                console.log(data);
                if (data.code == 1000) {
                    var charge = data.data.charge;
                    //提交成功
                    pingpp.createPayment(charge, function(result, err) {
                        console.log(result);
                        console.log(err.msg);
                        console.log(err.extra);
                        if (result == "success") {
                            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                        } else if (result == "fail") {
                            // charge 不正确或者微信公众账号支付失败时会在此处返回
                        } else if (result == "cancel") {
                            // 微信公众账号支付取消支付
                        }
                    });
                }
            }
        });
    };
}
$(document).ready(main);