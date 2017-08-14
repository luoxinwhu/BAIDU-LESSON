/**
 * Created by Administrator on 2017/7/27.
 *
 * To evaluate JavaScript code in the context of the web page
 */

var page = require('webpage').create();
page.onConsoleMessage = function (msg) {
    console.log('page title is '+ msg);
};
page.open('http://wwww.baidu.com/', function (status) {
   var title = page.evaluate(function () {
       console.log(document.title);
   }) ;

    phantom.exit();
});