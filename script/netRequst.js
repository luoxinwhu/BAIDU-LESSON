/**
 * Created by Administrator on 2017/7/27.
 */

var page = require('webpage').create(),
    url = 'http://www.baidu.com';

page.onResourceRequested = function (request) {
    console.log('request ' + JSON.stringify(request, undefined, 4));
};
page.onResourceReceived = function (response) {
    console.log('receive '+ JSON.stringify(response, undefined, 4));
};
page.open('http://www.baidu.com');