var main = function() {
    var $textarea = $('textarea'),
        $imgComment = $('.img-comment'),
        $starItem = $('.star-item'),
        $btn = $('.common-btn');
    //取待评价商品信息
    var commentInfo = JSON.parse(localStorage.getItem('commentStorage'));
    $('.good-pic').attr('src',commentInfo.pic);
    //点击小星星~
    $('.star-item').on('click', function() {
        $(this).addClass('active');
        $(this).prevAll().addClass('active');
        $(this).nextAll().removeClass('active');
    });
    //上传图片
    $('.select-img').on('click', function() {
        $('input').click();
    });

    //检查上传图片是否达到最大限制
    function checkImg() {
        var $imgItem = $('.img-comment .img-item');
        if ($imgItem.length == 5) {
            $('.img-item.input-container').hide();
        } else if ($imgItem.length == 4) {
            $('.img-item.input-container').show();
        }
    }
    //上传图片
    var imgFile = [];
    $("input[type=file]").change(function() {
        var file = $("input[type=file]")[0].files[0];
        imgFile.push(file);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
                $imgComment.prepend('<li class="img-item"><div class="close">×</div><img src="' + this.result + '" /></li>');
            }
            //若在这里console.log 那么这里的console.log先运行完上一步才会完成
        checkImg();
    });
    //点开上传图片
    $imgComment.on('click', '.img-item', function() {
        if (!$(this).hasClass('input-container')) {
            var imgSrc = $(this).find('img').attr('src');
            var $cover = $('#cover.cover1');
            $cover.append('<img src="' + imgSrc + '" />');
            $cover.fadeIn();
        }
    })
    $('#cover').on('click', function() {
        $('#cover').fadeOut();
        $('#cover img').remove();
    });
    //点击X删除图片
    $imgComment.on('click','.close',function(e){
        e.stopPropagation();
        var $this = $(this).parent();
        var index = $this.index();
        $this.remove();
        imgFile.splice(index,1);
    });
        //检查评论是否有内容
    function checkComment() {
        var text = $textarea.val();
        var star = false;
        $starItem.each(function() {
            if ($(this).hasClass('active')) star = true;
        })
        if (text !== '' && star == true) {
            $btn.addClass('active');
        } else {
            $btn.removeClass('active');
        }
    }
    $textarea.on('keyup', function() {
        checkComment();
    });
    $starItem.on('click', function() {
        checkComment();
    });
    //step1:发送图片
    $btn.click(function() {
        var formData = new FormData();
        formData.append('name', 'shopping.sys.upload.multi.img');
        $.each(imgFile, function() {
            formData.append('img[]', this);
        })
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            method: 'post',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data, status) {
                var commentPic = '';
                console.log(data.data.list)
                $.each(data.data.list, function() {
                    console.log(this)
                    commentPic = this.original + ',' + commentPic;
                })
                commentPic = commentPic.slice(0, -1);
                sendComment(commentPic);
            }
        })
    });
    //step2: 发送评论
    function sendComment(commentPic) {
        $.ajax({
            url: "http://121.40.91.157/shopping/php/PcApi",
            method: 'post',
            data: {
                name: 'shopping.sys.comment.order',
                user_id: localStorage.getItem('userId'),
                order_id: 1, //commentInfo.orderId,
                goods_id: 1, //commentInfo.goodsId,
                content: $textarea.val(),
                comment_picture: commentPic,
                star_num: $('.star-item.active').length
            },

            success: function(data, status) {
                if (data.code == 1000) {
                    window.location.href = 'order-detail.html';
                }
            }
        })
    }
}
$(document).ready(main);