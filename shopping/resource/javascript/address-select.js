var main = function() {
    //初始化radio
    $('.radio').each(function() {
        $(this).radioBox('single');
    });
    $('.radio').on('radioCb', function() {
        var $item = $(this).parents('.common-line-item');
        var address = $item.find('.address-info').text().replace(/\s/g, '');
        localStorage.setItem('receiveAddress', address);
    });
    //删除
    function deleteAddressQuery(ev) {
        //console.log(this) 出来的是function 那么可以bind(this)吗？
        var $item = $(ev.target).parents('.slide-common');
        $item.addClass('del');
        $dialog.show();
    }
    //真的删除
    function deleteAddress(ev) {
        var $item = $('.slide-common.del');
        if ($(ev.target).hasClass('weui_btn_dialog')) {
            $item.remove();
            $.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                data: {
                    name: 'shopping.sys.address.del',
                    address_id: 1
                },
                method: 'post',
                success: function(data, status) {
                    console.log(data)
                }
            })
        }
        $dialog.hide();
        $item.removeClass('del');
    }
    //获得当前地址的详细信息
    var addressInfo = {};

    function getAddress($item) {
        name: 'shopping.sys.address.update';
        addressInfo.address_id = $item.data('address_id');
        addressInfo.receive_name = $item.find('.name').text().trim();
        addressInfo.receive_mobile = $item.find('.phone').text().trim();
        addressInfo.receive_province = $item.find('.province').text().trim();
        addressInfo.receive_city = $item.find('.city').text().trim();
        addressInfo.receive_area = $item.find('.district').text().trim();
        addressInfo.receive_address = $item.find('.road').text().trim();
    }
    //设置默认
    function setDefault(ev) {
        var $item = $(ev.target).parents('.slide-common');
        getAddress($item);
        $('.default.active').removeClass('active');
        $item.find('.default').addClass('active');
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: addressInfo,
            method: 'post',
            success: function(data, status) {
                console.log(data);
            }
        });
    }
    //选择地址
    function radioCb(){
        var $item = $(this).parents('.slide-common');
        getAddress($item);
        localStorage.setItem('addressInfo', JSON.stringify(addressInfo));
        window.location.href = 'createOrder.html';
    }
    //去编辑页面
    function editAddress(ev) {
        var $item = $(ev.target).parents('.slide-common');
        getAddress($item);
        addressInfo.default = $item.find('.default').hasClass('active');
        localStorage.setItem('addressInfo', JSON.stringify(addressInfo));
        window.location.href = 'address-edit.html';
    }
    //绑定左滑/删除/真的删除/设置默认/点击编辑
    var $dialog = $('.weui_dialog_alert');
    $('.slide-common').each(function() {
        $(this).slideCommon();
        var mcDelQuery = new Hammer($(this).find('.delete')[0]);
        mcDelQuery.on('tap', deleteAddressQuery);
        var mcDel = new Hammer($dialog[0]);
        mcDel.on('tap', deleteAddress);
        var mcDefault = new Hammer($(this).find('.set-default')[0]);
        mcDefault.on('tap', setDefault);
        var mcEdit = new Hammer($(this).find('.detail')[0]);
        mcEdit.on('tap', editAddress);
        var mcLink = new Hammer($('.common-btn')[0]);
        mcLink.on('tap', function() {
            window.location.href = 'address-add.html';
        })
    });
    //滑动部分.slide-common-hide的高度
    $.fn.slideCommonHideHeight = function() {
        var height = $(this).parent().height();
        $(this).css('height', height);
    };
    $('.slide-common-hide').each(function() {
        $(this).slideCommonHideHeight();
    });
}
$(document).ready(main);