var main = function() {
    //初始化radio
    $('.radio').radioBox();
    $('.radio').on('checkSelected', function() {
        if ($(this).hasClass('active')) {
            $(this).data('default', '1');
        } else {
            $(this).data('default', '0');
        }
    });
    //保存地址
    $('.common-btn').on('click', function() {
        var newAddress = {
            name: 'shopping.sys.address.add',
            receive_name: $('.name').val(),
            receive_mobile: $('.phone').val(),
            receive_province: $('.province .selected').text(),
            receive_city: $('.city .selected').text(),
            receive_area: $('.district .selected').text(),
            receive_address: $('.address').val(),
            selected: $('.radio').data('default')
        }
        if ($(this).hasClass('active')) {
            $.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                method: 'post',
                data: newAddress,
                success: function(data, status) {
                    newAddress.address_id = data.address_id;
                    localStorage.setItem('addressInfo', JSON.stringnify(newAddress));
                    window.location.href = 'order.html';
                },
                error: function() {}
            })
        }
    });
    //绑定选择框
    $('#address-select-box').addressSelect();
    //检测input框
    $('input').on('keyup', function() {
        var phone = $('.phone').val();
        var name = $('.name').val();
        var address = $('.address').val();
        if (/^1[3|4|5|7|8]\d{9}$/.test(phone) && (name !== '' && address !== '')) {
            $('.common-btn').addClass('active');
        } else {
            $('.common-btn').removeClass('active');
        }
    })
}
$(document).ready(main);