/**
 * Created by Administrator on 2017/8/3.
 */

var koa = require('koa');
var app = koa();

app.use(function () {
    this.body = 'hello world';
});

app.listen(3000);