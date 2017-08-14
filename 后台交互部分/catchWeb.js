
/**
 * Created by LuoXin on 2017/7/28.
 */
(function () {

    var DEVICE = {
        ipad: {
            name: 'ipad',
            ua: "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
            width:"768",
            height:"1024"
        },
        iphone5: {
            name: 'iphone5',
            ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
            width:"320",
            height:"568"
        },
        iphone6: {
            name: 'iphone6',
            ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
            width:"375",
            height:"667"
        }
    };

    var page = require('webpage').create();
    var system = require('system');
    var url = 'https://www.baidu.com/s?wd=';
    var start = Date.now();

    if (system.args.length === 1) {
        console.log('input keyword!');
        console.log('The format like <searchStr> <deviceName>');
        phantom.exit();
    }
    var str = system.args[1];   // 检索的字符串
    var deviceName = system.args[2];
    url += encodeURIComponent(str);
    if(deviceName) {
        page.settings.userAgent = DEVICE[deviceName].ua;
        //网页视口大小
        page.viewportSize = {
            width: DEVICE[deviceName].width,
            height: DEVICE[deviceName].height
        };
        //获取信息时的位置
        page.clipRect = {
            top: 0,
            left: 0,
            width: DEVICE[deviceName].width,
            height: DEVICE[deviceName].height
        }
    }
    else {
        page.settings.userAgent = DEVICE['ipad'].ua;
        page.viewportSize = {
            width: DEVICE['ipad'].width,
            height: DEVICE['ipad'].height
        };
        page.clipRect = {
            top: 0,
            left: 0,
            width: DEVICE['ipad'].width,
            height: DEVICE['ipad'].height
        }
    }

    phantom.outputEncoding = "gb2312";
    phantom.onError = function (msg, trace) {
        var msgStack = ['PHANTOM ERROR: ' + msg];
        if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function (t) {
                msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function+')' : ''));
            });
        }
        console.error(msgStack.join('\n'));
        phantom.exit(1);
    };
    page.onError = function (msg, trace) {
        var msgStack = ['ERROR: ' + msg];
        if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function (t) {
                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
            });
        }
        console.log(msgStack.join('\n'));
    };

    page.open(url, function (status) {
        var result = {
            code:0,
            msg:'fail',
            word: system.args[1],
            time: 0, //任务的时间
            device: deviceName,
            dataList:[]

        };

        if (status !== 'success') {
            console.log('ERROR: 网页获取失败！');
            result.code = 0;
        }
        else {
            console.log('请输入要查询的内容和指定的设备，以空格分隔');
            result = page.evaluate(function () {
                var data = [];
                var dom = $('.result');

                dom.each(function(i,v){
                    var item ={};
                    item.title = $(v).find('.t').text();
                    item.link = $(v).find('.t').children().attr('href');
                    item.info = $(v).find('.c-abstract').text();
                    item.pic = $(v).find('img').attr('src');
                    data.push(item);
                });

                var oo ={};
                oo.code = 1;
                oo.msg = 'OK';
                oo.word = document.getElementById('kw').value;
                oo.dataList = data;
                /*oo.userAgent= window.navigator.userAgent;*/
                return oo;
            });
            result.time = new Date - start;
            result.device = deviceName;
        }
        console.log(JSON.stringify(result, null, 4));
        console.log('网页视口大小：width ' + page.viewportSize.width + ', height ' + page.viewportSize.height);
        console.log('获取信息时的位置：top ' + page.clipRect.top + ', left ' + page.clipRect.left);
        phantom.exit(0);
    });

})();


