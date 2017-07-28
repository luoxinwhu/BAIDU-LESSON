/**
 * Created by Administrator on 2017/7/27.
 */
var page = require('webpage').create();
page.open('http://example.com', function(status) {
    console.log("Status: " + status);
    if(status === "success") {
        page.render('example.png');
    }
    phantom.exit();
});
