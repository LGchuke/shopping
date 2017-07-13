var main = function() {
    //forget-pw:输入框
    function step1Check() {
        var phone = $('.phone').val();
        var verify = $('.verify').val();
        if (/^1[3|4|5|7|8]\d{9}$/.test(phone) && verify.length > 3) {
            $('#forget-pw .common-btn').addClass('active');
        } else{
        	$('#forget-pw .common-btn').removeClass('active');
        }
    }
    //输入框keyup事件
    $('.phone,.verify').on('keyup', function() {
        $('.reset-pw-reminder').removeClass('wrong-verify');
        step1Check();
    })
    //获取验证码
    $('.resend-veri').resendVeri({
        name: 'shopping.sys.forget.sms.send'
    });
    //点击下一步/验证验证码
     $('#forget-pw .common-btn').on('click',function(){
     	if($(this).hasClass('active')){
     		$.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                data: {
                    name: 'shopping.sys.forget.sms.confirm',
                    mobile: $('.phone').val(),
                    code:$('.verify').val()
                },
                success: function(data, status) {
                    console.log(data)
                    if(data.success == true){
                    	$('.container.active').removeClass('active');
                    	$('#reset-pw').show();
                    } else{
                    	$('.reset-pw-reminder').addClass('wrong-verify');
                    }
                },
                error: function() {}
            })
     	}
     })
     //reset-pw
     $('#reset-pw').passwordCheck({
        submit: function(password) {
            $.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                data: {
                    name: 'shopping.sys.reset.password',
                    mobile: $('.phone').val(),
                    password:  $('#reset-pw input').first().val()
                },
                success: function(data, status) {
                    console.log(data)
                    if(data.code == 1000){
                         alert('重置成功')
                    } else if(data.code == 1012){
                        $('.reset-pw-reminder').addClass('not-exist');
                        setTimeout(function(){
                            window.location.href = 'sign-up.html';
                         },2000)
                    }
                },
                error: function() {}
            })
        }
     });
}
$(document).ready(main);