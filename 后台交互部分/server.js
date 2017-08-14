
var http = require('http');
var url = require('url');
var exec = require('child_process').exec;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
// 建立数据库连接(必须在全局作用域连接）
var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误'));
db.on('open', function() {
    console.log("db open");
});
// 建立数据模型骨架
var searchSchema = new mongoose.Schema({
    code: Number,
    msg: String,
    word: String,
    time: Number,
    device: String,
    dataList: [{
        info: String,
        link: String,
        pic: String,
        title: String
    }]
});
// 数据模型
var searchModel = mongoose.model('search', searchSchema);



http.createServer(function(request, response) {
    console.log('request received');
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=gb2312' });

    if (request.url !== '/favicon.ico') {

        var parseUrl = url.parse(request.url, true);
        var device = parseUrl.query.device || '';
        var word = parseUrl.query.word || '';

        // 使用node子进程模块来调用phantomjs
        exec('phantomjs catchWeb.js ' + word + ' ' + device, {encoding: 'gb2312'}, (err, stdout) => {
            if (err) {
                console.log('#exec error: ' + err);
                response.end();
            }
            else {
                response.write(stdout);

                try {
                    JSON.parse(stdout);
                } catch (err) {
                    return response.end(JSON.stringify({ code: 0, msg: "请确认查询参数是否正确" }))
                }

                var stdout_p = JSON.parse(stdout);
                // 数据实体
                var searchEntity = new searchModel(stdout_p);
                // 对合理的数据进行保存
                searchEntity.save(function (err,result) {
                    if(err){
                        console.error('save failed!');
                        console.error(err);
                    }else{
                        console.error('save success!');
                    }
                });



                response.end();
            }


        });
    }
    else {
        console.log('页面请求的是网页图标，不合理请求被终止！');
        response.end();
    }

}).listen(8888);

//终端打印如下信息,并打开本地测试URL
// "?"后面携带的是传入catchWeb.js的参数word, device
console.log('server started at http://localhost:8888/?word=MATLAB2013&device=ipad');


