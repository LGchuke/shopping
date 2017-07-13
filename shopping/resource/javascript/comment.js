var main = function() {
    var $container = $('#comment');
    var type = 1;
    var page = 1;
    //改下拉刷新部分加入page = 1
    $('#comment').data('page', 1);
    //点击nav-bar
    $('.nav-item').on('click', 'p', function() {
            var $navItem = $(this).parent();
            $('.nav-item.active').removeClass('active');
            $navItem.addClass('active');
            $('.comment-item').remove();
            $('#no-more').hide();
            type = $navItem.data('type');
            page = 1;
            $(window).trigger('loadMore');
        });
        //下拉刷新
    $(window).checkScroll();
    $(window).on('loadMore', function() {
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            data: {
                name: 'shopping.sys.goods.comment',
                type: type,
                pre_goods_id: 1, //$container.data('goods_id'),
                page: page
            },
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data, status) {
                var item = data.data.comment_info;
                $.each(item, function() {
                    var time = dateformat(this.time);
                    var starNum = this.star_num;
                    var $thisComment = $('.comment-item .main').last();
                    $container.append('<li class="comment-item"><div class="header"><img class="avatar" src="' + this.comment_user_head + '"/><span class="name">' + this.comment_user_nickname + '</span><span class="date fr">' + time + '</span></div><div class="main"><div class="star"></div><div class="text">' + this.content + '</div></div></li>')
                    var star = $thisComment.find('.star');
                    for (var i = 0; i < starNum; i++) {
                        star.append('<img src="resource/image/purchase/common_star_selected@2x.png"/>');
                    }
                    if (this.is_picture == 1) {
                        var commentPic = this.comment_pic;
                        $thisComment.append('<div class="show"></div>');
                        $.each(commentPic, function() {
                            $thisComment.find('.show').append('<img src="' + this + '"/>');
                        })
                    }
                    if (this.is_reply == 1) {
                        console.log('hey')
                        $thisComment.append('<div class="fr reply"><span>' + this.reply_comment.content + '</span></div>')
                    }
                })
                page++;
                $('#loading').hide();
                if (item.length == 0) {
                    $('#no-more').show();
                }
            },
            error: function() {}
        })
    })
}
$(document).ready(main);