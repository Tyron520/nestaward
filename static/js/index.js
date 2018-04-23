var ZK = {} || '';
// 获取浏览器版本信息
ZK.getVersions = function () {
    var u = window.navigator.userAgent, app = window.navigator.appVersion;
    return {
        //是否为移动终端
        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
        //ios终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        //android终端
        android: u.indexOf('Android') > -1,
        //iPhone
        iPhone: u.indexOf('iPhone') > -1,
        //iPod
        iPod: u.indexOf('iPod') > -1,
        //iPad
        iPad: u.indexOf('iPad') > -1,
        //是否web应该程序，没有头部与底部
        webApp: u.indexOf('Safari') == -1,
        //是否为QQ
        QQ: u.match(/QQ/i) == "qq",
        //是否是微信
        weixin: u.match(/MicroMessenger/i) == "MicroMessenger"
    };
};
$(document).ready(function(){
    function changeWidth(){
        if(ZK.getVersions().mobile){
            $('html').width(1200);
        }
    }
    changeWidth();
    $(window).resize(function(){
        changeWidth();
    });   
    /**配置信息**/
    var Config = {
        "shareCover": 'http://' + location.host + '2018nestaward/static/pic/share.jpg',
        "shareTitle": "第八届筑巢奖学术论坛暨颁奖典礼专题",
        "shareDesc": "2018年4月19日下午（意大利当地时间下午14点30分）第八届筑巢奖颁奖典礼暨金奖作品展首次走进万里之外的欧洲，定位意大利。"
    };
    ZK.goIndex = function(id){
        var device = ZK.getVersions().mobile,
            url = '';
        if(device){
            url = 'http://m.zhuke.com/namecard/'+id
            window.location.href = url;
        }else{
            url = 'http://www.zhuke.com/namecard/'+id;
            window.open(url, "_blank");
        }
    }
    ZK.goIdeabooks = function(id){
        var device = ZK.getVersions().mobile,
            url = '';
        if(device){
            url = 'http://m.zhuke.com/ideabooks/'+id+'.html'
            window.location.href = url;
        }else{
            url = 'http://www.zhuke.com/ideabooks/'+id;+'.html'
            window.open(url, "_blank");
        }
    }
    ZK.goArticle = function(id){
        var device = ZK.getVersions().mobile,
            url = '';
        if(device){
            url = 'http://m.zhuke.com/ideabooks/'+id +'.html'
            window.location.href = url;
        }else{
            url = 'http://www.zhuke.com/ideabooks/'+id +'.html';
            window.open(url, "_blank");
        }
    }    

    // 颁奖嘉宾
    var pres = new Swiper('.presenters-designer .swiper-container', {
        watchSlidesProgress: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        loopedSlides: 25,//元素个数
        autoplay: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            progress: function(progress) {
                for (i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i);
                    var slideProgress = this.slides[i].progress;
                    modify = 1;
                    if (Math.abs(slideProgress) > 1) {
                        modify = (Math.abs(slideProgress) - 1) * 0.1 + 1;
                    }
                    translate = slideProgress * modify * 178 + 'px';
                    scale = 1 - Math.abs(slideProgress) / 7;
                    zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
                    slide.transform('translateX(' + translate + ') scale(' + scale + ')');
                    slide.css('zIndex', zIndex);
                    slide.css('opacity', 1);
                    if (Math.abs(slideProgress) > 3) {
                        slide.css('opacity', 0);
                    }
                }
            },
            setTransition: function(transition) {
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i)
                    slide.transition(transition);
                }

            }
        }

    })

    // 获奖名单
    var awardArr = ['专业类金奖', '专业类提名奖', '公众类金奖', '公众类提名奖', '优秀奖', '优秀奖', '优秀奖'];
    $.getJSON('static/api/winners/winners.json', {}, function(res){
        if(res.success){
            var temp = Handlebars.compile($('#winners-temp').html()),
                html = temp(res);
            $('.award-con').append(html);
            awardWinner();
        }
    });
    function awardWinner(){
        var awardSwiper = new Swiper('.award-list', {
            spaceBetween: 0,
            navigation: {
                prevEl: '.award-list .swiper-button-prev',
                nextEl: '.award-list .swiper-button-next'
            },
            on: {
                slideChangeTransitionStart: function(swiper){
                    var page;
                    switch(this.activeIndex){
                        case 0:
                        case 1:
                        page = 1;break;
                        case 2:
                        case 3:
                        page = 2;break;
                        case 4:
                        case 5:
                        case 6:
                        page = 3;break;
                    }
                    $('.award-tit-text').html(awardArr[this.activeIndex]);
                    $(".winner-tab-item[page ='"+page+"']").addClass("cur").siblings().removeClass("cur") 
                }
            }       
        })
        $(".winner-tab-item").on("click", function(page){
            switch(page.preventDefault(),$(this).index()){
                case 0: awardSwiper.slideTo(0,500);break;
                case 1: awardSwiper.slideTo(2,500);break;
                case 2: awardSwiper.slideTo(4,500);break;
                $('.award-tit-text').html(awardArr[index]);
            }
        })
        $('.winner-button-item').on('click', function(){
            var index = $(this).data('index');
            $('.award-tit-text').html(awardArr[index]);
            awardSwiper.slideTo(index,500);
        });
    }
    // Nest Award
    $.getJSON('static/api/nest_award/nest_award.json', {}, function(res){
        if(res.success){
            var temp = Handlebars.compile($('#nest-award-temp').html()),
                html = temp(res);
                $('.nest-con').append(html);            
        }
    });
    // Nest Forum
    function nestForum(){
        $('.nest-forum-r span').on('click', function(){
            var self = $(this),
                index = parseInt($(this).index())+1;
            self.addClass('cur').siblings('span').removeClass('cur');
            $.getJSON('static/api/nest_forum/nest'+index+'.json', {}, function(res){
                if(res.success){
                    var temp = Handlebars.compile($('#nest-forum-temp').html()),
                        html = temp(res);
                    $('.nest-forum-l').empty().append(html);
                }
            });
        });
    }
    nestForum();
    $('.nest-forum-r span').eq(0).click();
    // judge
    $.getJSON('static/api/judge/judge.json', {}, function(res){
        if(res.success){
            var temp = Handlebars.compile($('#judge-temp').html()),
                html = temp(res);
            $('.judge-con').append(html);
            $('.judge-item').hover(function(){
                var self = $(this);
                self.stop().animate({'width': 447+'px'}, 1000).siblings('.judge-item').stop().animate({'width': 188+'px'}, 1000);
            });
        }
    });
    var handleHelper = Handlebars.registerHelper('addOne', function(index){
        return index+1;
    });
    
    // review
    function toggle(){
        $('.review-r .city').hover(function(){
            var self = $(this),
                index = self.index();
            self.addClass('cur').siblings('.city').removeClass('cur');
            $('.review-m a').eq(index).fadeIn(500).siblings('.review-m a').fadeOut(500);
        });
    }
    $.getJSON('static/api/review/review.json', {}, function(res){
        if(res.success){
            var temp = Handlebars.compile($('#review-temp').html()),
                html = temp(res);
            $('.review-m').append(html);
            toggle();
        }
    });
    // 直击终评
    $.fn.answerSheet = function(options) {
        var defaults={mold:'card',};
        var opts = $.extend({},defaults,options);
        return $(this).each(function(){
            var obj = $(this).find('.item');
            var len = obj.length,
            _b = len -1;
            for(var i = 1; i <= len; i++){
                obj.eq(_b).css({'z-index':i});_b-=1;
            }
            $(this).show();
            if(opts.mold == 'card'){
                var count = 0;
                $('.next').click(function(){
                    count++;
                    if(count >= len){
                        count = 0
                    }
                    var index = $(this).parents('.card').index();
                    obj.eq(count + 2).removeClass('cardn').addClass('card3');
                    obj.eq(count + 1).removeClass('card3').removeClass('cardn').addClass('card2');
                    obj.eq(count-1).removeClass('card1');
                    setTimeout(function(){
                        obj.eq(count).addClass('card1').removeClass('card2');
                    },200);
                })
            }
        });
    };
    $("#final-item-wrap").answerSheet({});   
    // final-review-judge
    $.getJSON('static/api/final_review/final_review.json', {}, function(res){
        if(res.success){
            var temp = Handlebars.compile($('#final-review-judge-temp').html()),
                html = temp(res);
            $('.final-review-judge-con').append(html)
        }
    });
    // 实地考察
    var galleryTop = new Swiper('.gallery-top', {
      spaceBetween: 10,
      loop:true,
      loopedSlides: 5, //looped slides should be the same
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
      direction : 'vertical',
      spaceBetween: 10,
      slidesPerView: 5.1,
      touchRatio: 0.2,
      loop: true,
      loopedSlides: 5, //looped slides should be the same
      slideToClickedSlide: true,
    });
    galleryTop.controller.control = galleryThumbs;
    galleryThumbs.controller.control = galleryTop;    

    /**微信分享**/
    function initShare(){
        wx.ready(function () {
            var shareData = {
                imgUrl: Config.shareCover,
                link: location.href,
                title: Config.shareTitle,
                desc: Config.shareDesc,
                success:function (res) {
                $.scojs_message('已分享',$.scojs_message.TYPE_OK);
                },
                fail:function (res) {
                    $.scojs_message(JSON.stringify(res),$.scojs_message.TYPE_ERROR);
                }
            };
            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareTimeline(shareData);
            wx.onMenuShareQQ(shareData);
            wx.onMenuShareWeibo(shareData);
            wx.onMenuShareQZone(shareData);

        });
    }
    /**获取微信权限**/
    function getWeixinJsTicket(){
        $.ajax({
            url: 'http://weixin.nestaward.com/jsapi_ticket/nestaward',
            type: 'get',
            dataType: 'jsonp',
            data: {
                uri: encodeURIComponent(location.href)
            },
            jsonp: "callback",
            success: function(req){
                if (req){
                    config = {
                        debug: false,
                        appId: req.appId,
                        timestamp: req.timestamp,
                        nonceStr: req.noncestr,
                        signature: req.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone','previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    }
                    wx.config(config);
                    initShare();
                }
            }
        });
    }

    getWeixinJsTicket();            
})