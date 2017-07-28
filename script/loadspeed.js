/**
 * Created by Administrator on 2017/7/27.
 */
var page = require('webpage').create(),
    system = require('system'),
    time,
    address;

if(system.args.length ===1) {
    console.log('Usage: loadspeed.js <some URL>');
    phantom.exit();
}
else{ //system.args.length > 1
    time = Date.now();
    address = system.args[1];
    page.open(address, function (status) {
        if(status !== 'success') {
            console.log('fail to load the address');
        }
        else {
            time = Date.now() - time;
            console.log('loading ' + system.args[1]);
            console.log('loading time ' + time + ' msec');
        }
        phantom.exit();
    });
}

