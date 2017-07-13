var main = function() {
    //初始化radio
    var $radio = $('.radio');
    $radio.radioBox();
    $radio.on('checkSelected', function() {
        if ($(this).hasClass('active')) {
            $(this).data('default', '1');
        } else {
            $(this).data('default', '0');
        }
    });
    //绑定选择框
    $('#address-select-box').addressSelect(initial);
    //初始化页面
    var initialData = JSON.parse(localStorage.getItem('addressInfo'));
    $('.name').val(initialData.receive_name);
    $('.phone').val(initialData.receive_mobile);
    $('.road').val(initialData.receive_address);
    initialData.default ? $radio.addClass('active').data('default', '1'): $radio.data('default', '0');

    function initial() {
        $('.province .item[data-name="' + initialData.receive_province + '"]').click();
        $('.city .item[data-name="' + initialData.receive_city + '"]').click();
        $('.district .item[data-name="' + initialData.receive_area + '"]').click();
    }
    //删除-弹出层
    var $dialog = $('.weui_dialog_alert');
    $('label.delete').on('click', function() {
        $dialog.show();
    })
    $dialog.on('click', function() {
        $dialog.hide();
    });
    //真的删除
    $dialog.find('.weui_btn_dialog').on('click', function() {
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: {
                name: 'shopping.sys.address.del',
                address_id: initialData.address_id
            },
            method: 'post',
            success: function(data, status) {
                window.location.href = 'address-select.html';
            }
        })
    });
    //保存并使用
    $('.common-btn').click(function() {
        if ($(this).hasClass('active')) {
            var newAddress = {
            name: 'shopping.sys.address.update',
            address_id:initialData.address_id,
            receive_name: $('.name').val(),
            receive_mobile: $('.phone').val(),
            receive_province: $('.province .selected').text(),
            receive_city: $('.city .selected').text(),
            receive_area: $('.district .selected').text(),
            receive_address: $('.address').val(),
            selected: $('.radio').data('default')
        }
            $.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                method: 'post',
                data:newAddress,
                success: function(data, status) {
                    localStorage.setItem('addressInfo', JSON.stringnify(newAddress));
                    window.location.href = 'address-select.html';
                },
                error: function() {}
            })
        }
    })
}
$(document).ready(main);