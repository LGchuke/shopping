var main = function() {
    //初始化swiper
    $.ajax({
        url: "http://121.40.91.157/shopping/php/PcApi",
        data: {
            name: 'shopping.sys.category.info'
        },
        success: function(data, status) {
            var categoryInfo = data.data['CategoryInfo'];
            $.each(categoryInfo, function(index) {
                var menu = this.category_menu;
                var type = 'type' + index;
                $('.swiper-wrapper').append('<a class="tab-item swiper-slide" data-type="' + type + '">' + this.class_name + '</a>');
                $.each(menu, function(index) {
                    $('#category-container ul').append('<li class="ca-item ' + type + '" data-id="' + this.class_append_id + '"><img class="ca-img" src="' + this.imgurl + '"><p class="ca-name">' + this.class_name + '</p></img></li>');
                });
            });
            new Swiper('.swiper-container', {
                direction: 'vertical',
                slidesPerView: 10,
                freeMode: true
            });
            //默认是打开常用分类
            $('.tab-item:first-child').click();
        },
        error: function() {}
    });
    //点击tab
    $('#tab-container').on('click', '.tab-item', function() {
        var type = $(this).data('type');
        $('.tab-item.active').removeClass('active');
        $(this).addClass('active');
        $('.ca-item.active').removeClass('active');
        $('.ca-item.' + type).addClass('active');
    });
    //点击分类
    $('#category-container').on('click','.ca-item',function(){
        var id = $(this).data('id');
        window.location.href='search.html?class_append_id='+id;
    })
}
$(document).ready(main);