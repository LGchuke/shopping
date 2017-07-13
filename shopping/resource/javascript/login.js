var main = function(){
	$('.common-input-group-A').on('keyup',function(){
		check();
		$('.reminder').removeClass('wrong-pw');
	})
	function check(){
		var phone = $('.phone').val();
		var pw = $('.pw').val();
		if((parseInt(phone) && phone.toString().length == 11) && pw.length >5){
			$('.common-btn').addClass('active');
		} else{
			$('.common-btn').removeClass('active');
		}
	}
	//点击登录按钮
	$('.common-btn').on('click',function(){
		if($(this).hasClass('active')){
			$.ajax({
                url: "http://121.40.91.157/shopping/php/PcApi",
                method: 'post',
                data: {
                    name: 'shopping.sys.pc.login',
                    mobile: $('.phone').val(),
                    password: $('.pw').val()
                },
                beforeSuccess:function(){
                	$('.weui_loading_toast').show();
                },
                success: function(data, status) {
                	$('.weui_loading_toast').hide();
                     if(data.code == 1000){
                     	localStorage.setItem('user',JSON.stringify(data.data));
                        localStorage.setItem('userId',data.data.user_id);
                        myAlert('登录成功!');
                     	window.location.href = 'index.html';
                     } else if(data.code == 1014){
                     	$('.reminder').addClass('wrong-pw');
                     }
                },
                error: function() {}
            })
		}
	})
}
$(document).ready(main);