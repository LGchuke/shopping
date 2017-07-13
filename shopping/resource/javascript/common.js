var viewport = document.querySelector("meta[name=viewport]");
var winWidths = $(window).width();
var densityDpi = 640 / winWidths;
densityDpi = densityDpi > 1 ? 300 * 640 * densityDpi / 640 : densityDpi;
if (isWeixin()) {
    viewport.setAttribute('content', 'width=640, target-densityDpi=' + densityDpi + ',           user-scalable=no');
}

function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function setRem() {
    var dpr = window.devicePixelRatio;
    /*var layout = window.innerWidth;
    var screen = layout/dpr;
    console.log(layout)
    console.log(dpr)
    console.log(screen)*/
    /*console.log(screen.width)*/
    //$(window).width() 屏幕的像素宽度
    // console.log(document.documentElement.clientWidth)
    //console.log($(window).width()/2)
    //console.log($('body').width())
    $('html').css('font-size', $(window).width() / 10);
}
setRem();
//回退操作
$('.search-container label.back, #second-header-container label.back').on('click', function() {
    history.back();
});
//简单验证一个为电话+一个不为空的input框
function checkInput(inputNum, inputText) {
    if ((parseInt(inputNum.val()) && inputNum.val().toString().length == 11) && inputText.val() != '') {
        $('.common-btn').removeClass('disable');
    }
}
//radio框 //如何让它可以作为页面里的几块来呢？那应该绑在container上？
$.fn.radioBox = function(select) {
    var $thisRadio = $(this);
    var mc = new Hammer($thisRadio[0]);
    if (select === 'single') {
        mc.on("tap", function(ev) {
            $('.radio').removeClass('active');
            $thisRadio.addClass('active');
            $thisRadio.trigger('radioCb');
        });
    } else {
        mc.on("tap", function(ev) {
            $thisRadio.toggleClass('active');
            $thisRadio.trigger('checkSelected');
        });
    }
};
//加減框
$.fn.numEditor = function() {
    var $this = $(this);
    var $num = $this.find('.num');
    var $numAdd = $this.find('.num-add');
    var $numMinus = $this.find('.num-minus');
    if (parseInt($num.text()) === 1) $numMinus.addClass('disable');
    //点击事件
    $numAdd.on('click', function() {
        var maxNum = $this.data('store');
        var number = parseInt($num.text(), 10);
        if (!$numAdd.hasClass('disable')) {
            $num.text(++number);
            if (number >= maxNum) $numAdd.addClass('disable');
            $numMinus.removeClass('disable');
            $this.trigger('editNum', number);
        }
    });
    $numMinus.on('click', function() {
        var maxNum = $this.data('store');
        var number = parseInt($num.text(), 10);
        if (!$numMinus.hasClass('disable')) {
            $num.text(--number);
            if (number === 1) $numMinus.addClass('disable');
            $numAdd.removeClass('disable');
            $this.trigger('editNum', number);
        }
    })
};
//左滑删除插件
$.fn.slideCommon = function(obj) {
        var x, y, startX, startY, moveX, moveY;
        var $this = $(this);
        var $width = $this.find('.slide-common-hide').width();
        $this.on('touchstart', function(e) {
            e.preventDefault();
            startX = e.originalEvent.changedTouches[0].pageX;
            startY = e.originalEvent.changedTouches[0].pageY;
        })
        $this.on('touchmove', function(e) {
            var $slideStatus = $this.data('slide');
            e.preventDefault();
            moveX = e.originalEvent.changedTouches[0].pageX;
            moveY = e.originalEvent.changedTouches[0].pageY;
            x = moveX - startX;
            y = moveY - startY;
            if (Math.abs(x) > Math.abs(y)) {
                //right to left. Start from the initial state.
                if (x < 0 && $slideStatus == 'off') {
                    $this.css('transform', 'translate3d(' + x + 'px,0,0)');
                }
                //Start from the end state. Right to left/Left to right
                else if ($slideStatus == 'on') {
                    $this.css('transform', 'translate3d(' + (x - $width) + 'px,0,0)');
                }
            }
        })
        $('body').on('touchend', function(e) {
            var $slideStatus = $this.data('slide');
            e.preventDefault();
            //unsuccessfully move
            if (Math.abs(x) < $width / 3) {
                //right to left. From the start state.
                if ($slideStatus == 'off' && x < 0) {
                    $this.css('transform', 'translate3d(0,0,0)');
                }
                //left to right. From the end state.
                else if ($slideStatus == 'on' && x > 0) {
                    $this.css('transform', 'translate3d(' + (-$width) + 'px,0,0)');
                }
            }
            //successfully move.
            else if (Math.abs(x) > $width / 3) {
                //right to left. From the start state.
                if ($slideStatus == 'off' && x < 0) {
                    $this.css('transform', 'translate3d(' + (-$width) + 'px,0,0)');
                    $this.data('slide', 'on');
                }
                //left to right. From the end state.
                else if ($slideStatus == 'on' && x > 0) {
                    $this.css('transform', 'translate3d(0,0,0)');
                    $this.data('slide', 'off');
                }
            }
            //Wobble move. Right to left. From the end state.
            if (Math.abs(x) > Math.abs(y) && (x < 0 && $slideStatus == 'on')) {
                $this.css('transform', 'translate3d(' + (-$width) + 'px,0,0)');
            }
        })
    }
    //检测下拉
$.fn.checkScroll = function() {
        $(window).on('scroll', function() {
            var scrollTop = $(window).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(window).height();
            if (scrollTop + windowHeight == scrollHeight - 1) {
                $(window).trigger('loadMore');
            }
        })
    }
    // 密码输入
$.fn.passwordCheck = function(options) {
        var maxLength = options.maxLength || 20;
        var minLength = options.minLength || 6;
        var submit = options.submit;
        var $this = $(this);
        var $input = $this.find('input');
        $input.on('keyup', function() {
            var pw0 = $input.first().val();
            var pw1 = $input.last().val();
            $('.wrong-pw').removeClass('wrong-pw');
            if ((pw0.length >= minLength && pw0.length <= maxLength) && (pw1.length >= minLength && pw1.length <= maxLength)) {
                $this.find('.common-btn').addClass('active');
            } else {
                $this.find('.common-btn').removeClass('active');
            }
        });
        $this.find('.common-btn').on('click', function() {
            if ($(this).hasClass('active')) {
                if ($input.first().val() !== $input.last().val()) {
                    $('.reset-pw-reminder').addClass('wrong-pw');
                } else {
                    submit($input.first().val());
                }
            }
        });
    }
    //获取验证码
$.fn.resendVeri = function(obj) {
        var $verify = $(this);
        $verify.on('click', function() {
            if (!$(this).hasClass('disable')) {
                $.ajax({
                    url: "http://121.40.91.157/shopping/php/PcApi",
                    data: {
                        name: obj.name,
                        mobile: $('.phone').val()
                    },
                    success: function(data, status) {
                        $verify.addClass('disable');
                        $verify.find('.access').hide();
                        $verify.find('.resend').show();
                        var countdown = setInterval(function() {
                            var time = parseInt($('.time').text());
                            time--;
                            $('.time').text(time);
                            if (time == 0) {
                                clearInterval(countdown);
                                $verify.removeClass('disable');
                                $verify.find('.access').text('重新发送').show();
                                $verify.find('.resend').hide();
                                $('.time').text('60');
                            }
                        }, 1000)
                    },
                    error: function() {}
                })
            }
        });
    }
    //地区选择三联框
$.fn.addressSelect = function(cb) {
    //地址库初始化
    var database, dataProvince, dataCity, dataDistrict;
    var initial = 0;
    $.getJSON("resource/lib/areas.json", function(json) {
        database = json;
        dataProvince = Object.keys(database);
        addArea(dataProvince, $('.province'));
    });
    //点击选择框
    $(this).find('ul.select-container').on('click', function(e) {
        var $optionContainer = $(this).find('.option-container');
        if (!($optionContainer).hasClass('active')) {
            $('.option-container.active').removeClass('active');
        }
        $optionContainer.toggleClass('active');
        console.log(e, '点击选择框') //为什么是反着进行的？
    });
    $(this).find('.option-container').on('click', '.item', selectData);
    //加入并初始化选择列表
    function addArea(array, $area) {
        $.each(array, function() {
            $area.find('.option-container').append('<li class="item" data-name="' + this + '">' + this + '</li>');
        });
        //默认点击第一项选择列表
        $area.find('.item').first().click();
    }
    //点击选择列表
    function selectData(e) {
        e.stopPropagation(); //不用冒泡!!
        var $selectContainer = $(this).parents('.select-container');
        var $optionContainer = $selectContainer.find('.option-container');
        var area = $(this).text();
        //通用部分 选择点击列表名字
        $selectContainer.find('.item.active').removeClass('active');
        $(this).addClass('active');
        $selectContainer.find('.selected').text(area);
        //各自部分
        if ($selectContainer.hasClass('province')) {
            $('.city .item').remove();
            $('.district .item').remove();
            $('.city .selected').text('');
            $('.district .selected').text('');
            dataCity = database[area];
            addArea(Object.keys(dataCity), $('.city'));
        } else if ($selectContainer.hasClass('city')) {
            $('.district .item').remove();
            $('.district .selected').text('');
            dataDistrict = dataCity[area];
            addArea(dataDistrict, $('.district'));
        } else {
            if (initial == 0) {
                initial = 1;
                cb();
            }
        }
        $optionContainer.removeClass('active');
    }
};
//时间戳转为标准时间
function dateformat(unix) {
    var time = new Date(unix);
    var y = time.getFullYear();
    var m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    var d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    return y + '-' + m + '-' + d;
};
//获取href的信息
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
//当页无内容
function nothingAlert(text){
    $('body').append('<p class="nothing-alert">'+text+'</p>');
};
//自制alert
function myAlert(text){
    $('body').append('<p class="my-alert">'+text+'</p>');
    setTimeout(function(){
        $('.my-alert').remove();
    },2000)
};
//点击搜索框进搜索
$('#search').on('focus',function(){
    window.location.href='searchAll.html';
})