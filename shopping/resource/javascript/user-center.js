var main = function() {
    var $avatar = $('.avatar'),
        $username = $('.user-name'),
        $status = $('.level-metal'),
        $level = $('.level-member');
    var userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo == null) {
        //未登录时 点击头像登录
        $avatar.on('click', function() {
            window.location.href = 'login.html';
        });
         $('.order-item img,a').on('click',function(){
            window.location.href='login.html';
         })
    } else {
        //初始化
        $avatar.attr('src', userInfo.head);
        $username.text(userInfo.nickname);
        switch (userInfo.status) {
            case 0:
                $status.text('未加盟');
                break;
            case 1:
                $status.text('已加盟');
                break;
        }
        switch (userInfo.level) {
            case 0:
                $level.text('普通会员');
                break;
            case 1:
                $level.text('黄金会员');
                break;
            case 2:
                $level.text('白金会员');
                break;
            case 3:
                $level.text('钻石会员');
                break;
        }
        //点击待付款待发货…
        $('.order-item img').on('click',function(){
            window.location.href='order.html?status='+$(this).data('status');
        })
    }
}
$(document).ready(main);