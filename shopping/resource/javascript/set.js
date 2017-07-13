var main = function() {
    var $btn = $('.common-btn');
    var userInfo = JSON.parse(localStorage.getItem('user'));
    console.log(userInfo)
    if (userInfo == null) {
        $btn.text('登录');
        $btn.on('click', function() {
        	window.location.href = 'login.html';
        })
    }
    else {
        $btn.text('退出登录');
        $btn.on('click', function() {
            localStorage.removeItem('user');
            $btn.text('登录');
        })
    }
}
$(document).ready(main);