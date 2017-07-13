var main = function() {
    //开关加盟商列表
    $('.level-item').click(function() {
        $(this).parent().toggleClass('open');
    })
}
$(document).ready(main);