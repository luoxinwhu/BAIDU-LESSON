/**
 * Created by LX on 2017/8/14.
 */

$(window).bind('scroll', function (e) {
   parallaxScroll();
});

function parallaxScroll() {
    //利用css中的top属性移动每一个展示层
    let scrolled = $(window).scrollTop();
    $('#parall-bg1').css('top', (0-scrolled*0.75)+'px');    //相减，视觉上屏幕向下滚动
    $('#parall-bg2').css('top', (0-scrolled*0.5)+'px');
    $('#parall-bg3').css('top', (0-scrolled*0.25)+'px');
    $('#parall-bg4').css('top', (0-scrolled*0.05)+'px');
}