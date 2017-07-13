var main = function() {
    //step1:输入框
    function step1Check() {
        var phone = $('.phone').val();
        var type = $('.radio:first-child').hasClass('active') || $('.radio:last-child').hasClass('active');
        if (/^1[3|4|5|7|8]\d{9}$/.test(phone) && type == true) {
            $('#step1-container .common-btn').addClass('active');
        } else {
            $('#step1-container .common-btn').removeClass('active');
        }
    }
    //step1:radio框
    $('.radio').each(function() {
        $(this).radioBox('single');
    });
    //step1:检测
    $('.common-input-group-A').on('keyup', function() {
        step1Check();
    });
    $('.radio').on('radioCb', function() {
        step1Check();
    });
    //step1:点击下一步
    $('#step1-container .common-btn').on('click', function() {
        if ($(this).hasClass('active')) {
            $('.container.active').removeClass('active');
            $('#step2-container').addClass('active');
            $('#step2-container .tel').text($('.phone').val());
        }
    });
    //step2:获取验证码
    $('#step2-container .getVerify').resendVeri({
        name: 'shopping.sys.register.sms.send'
    });
    //step2:输入框keyup事件
    $('#step2-container .common-input-group-B').on('keyup', function() {
            var $btn = $('#step2-container .common-btn');
            $('.wrong-verify').hide();
            if ($('.verify').val().length > 3) {
                $btn.addClass('active');
            } else {
                $btn.removeClass('active');
            }
        });
        //step2:点击下一步/验证验证码
    $('#step2-container .common-btn').on('click', function() {
        if ($(this).hasClass('active')) {
            $.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                data: {
                    name: 'shopping.sys.register.sms.confirm',
                    mobile: $('.phone').val(),
                    code: $('.verify').val()
                },
                success: function(data, status) {
                    if (data.success == true) {
                        $('.container.active').removeClass('active');
                        $('#step3-container').addClass('active');
                    } else {
                        $('.wrong-verify').show();
                    }
                },
                error: function() {}
            })
        }
    });
    $('#step3-container').passwordCheck({
        submit: function(password) {
             console.log($('.radio.active').data('type'))
            $.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                method: 'post',
                data: {
                    name: 'shopping.sys.pc.register',
                    mobile: $('.phone').val(),
                    password: password,
                    r_password: password,
                    type: $('.radio.active').data('type'),
                    input_code: ''
                },
                success: function(data, status) {
                    if (data.code == 1000) {
                        //注册成功
                        console.log('注册成功')
                    } else if (data.code == 1033) {
                        //用户已存在
                         $('.reset-pw-reminder').addClass('already-exist');
                         setTimeout(function(){
                            window.location.href = 'login.html';
                         },2000)
                    }
                },
                error: function() {}
            })
        }
    });
}
$(document).ready(main);