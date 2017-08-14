/**
 * Created by LX on 2017/7/10.
 */

//================= GLOBAL PARAMETERS ===================//
var table = document.getElementsByTagName('table')[0],
    tr = document.getElementsByTagName('tr'),
    wall_number = document.getElementById('wall_number'),
    cmdText = document.getElementById('cmdText'),
    btn_opt = document.getElementById('btn_opt'),
    btn_clear = document.getElementById('btn_clear'),
    btn_build = document.getElementById('btn_build'),
    cmdRowNum = document.getElementById('cmdRowNum');


var randPosX = Math.floor(Math.random()*10)+1, //产生1~10之间的随机整数，用于方块初始化定位坐标
    randPosY = Math.floor(Math.random()*10)+1,
    posX = randPosX,    //棋子的行坐标
    posY = randPosY,    //棋子的列坐标
    dir = 0,            //初始化方向值: DIRECTION[dir]
    ROW = 10,           //棋盘行数
    COL = 10,           //棋盘列数
    DIRECTION = ["TOP", "RIGHT", "BOTTOM", "LEFT"];


//============= init ==================================//
//绘制棋盘
(function createTable() {

    var tr = [];

    for(var i=0; i<=ROW; i++) {
        tr[i] = document.createElement('tr');
        table.appendChild(tr[i]);
        var td = [];

        for(var j=0; j<=COL; j++) {

            td[j] = document.createElement('td');
            if(i===0 || j===0) {
                td[j].style.border = 'none';
            }
            if(i===0 && j>0) {
                //标注列号
                td[j].innerHTML = j;
                td[j].className = 'number';
            }
            if(j===0 && i>0) {
                //标注行号
                td[j].innerHTML = i;
                td[j].className = 'number';
            }
            tr[i].appendChild(td[j]);
        }
    }
})();

//绘制图标
render(randPosX, randPosY);

//绑定事件
cmdText.addEventListener('keyup', function () {
    rowHasChange();
});
cmdText.addEventListener('scroll', function () {
    cmdRowNum.scrollTop = cmdText.scrollTop;
});

btn_opt.onclick = function () {
    cmdSplit();
};
btn_clear.onclick = function () {
    cmdText.value = '';
    cmdRowNum.innerHTML = '';
};
btn_build.onclick = function () {

    for(var i=0; i<wall_number.value; i++) {
        var wallX = Math.floor(Math.random()*10)+1,
            wallY = Math.floor(Math.random()*10)+1;
        if(!isWall(wallX, wallY)) {
            if(!(wallX===posX && wallY===posY)) {
                //图标所在之处不能建墙
                renderWall(wallX, wallY);
            }
        }
    }
};


// ============= COMMANDS FUNCTIONS =====================//

/**
 * 监控命令输入区域的变化
 */
function rowHasChange() {
    var cmd = cmdText.value.trim(),
        cmdArr = cmd.split('\n'),
        arr = [],
        top = cmdText.scrollTop;

    for(var i=0; i<cmdArr.length; i++) {
        arr.push('<div class="rowNum">' + (i+1) + '</div>');
    }
    cmdRowNum.innerHTML = arr.join(''); //将arr数组内容拼接成字符串
    cmdRowNum.scrollTop = top;
}

/**
 * 切分多条命令
 * @ cmdArr{array}  每个元素存放切割后的单条命令
 */
function cmdSplit() {
    var cmd = cmdText.value.trim(),
        cmdArr = cmd.split('\n');

    cmdCheck(cmdArr[0], 0);

    var index = 1;  //待执行的命令索引
    var timer = setInterval(function () {
        if(cmdArr.length>index) {   //命令不止一条
            cmdCheck(cmdArr[index], index);  //执行指定单条命令
            ++index;
        }
        else {
            clearInterval(timer);
        }
    }, 500);
}

/**
 * 单条指令合法性检测
 * @param cmd   命令
 * @param index 命令索引
 */
function cmdCheck(cmd, index) {

    //合法的命令格式为 “GO 4”, "TRALEF 4", "MOVLEF 4", "BRU #000", "BRU #F23002", "MOVETO 4,5"
    var regGo = /^GO(\s+\d+)?$/,
        regTUN = /^TUN(LEF|RIG|BAC)$/,
        regTRAMOV = /^(TRA|MOV)(LEF|RIG|TOP|BOT)(\s\d+)?$/,
        regBUILD = /^BUILD$/,
        regBRU = /^BRU\s+(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})$/,
        regMOVTO = /^MOVTO\s\d+,\d+$/;

    var result = !regGo.test(cmd) && !regTUN.test(cmd) && !regTRAMOV.test(cmd) && !regBUILD.test(cmd) && !regBRU.test(cmd) && !regMOVTO.test(cmd);

    //当cmd为合法指令时，6个test结果只有一个是TRUE，取反后为FALSE，与运算只要有一个FALSE结果为FALSE
    //当cmd为非法指令，所有结果为FALSE，取反后为TRUE，结果为TRUE
    if(result === true) {
        console.log('error1: command is not legal!');
        document.getElementsByClassName('rowNum')[index].className = 'error';
    }
    else {
        cmdParse(cmd);  //解析命令
    }
}

/**
 * 单条命令解析
 * @param cmd 命令
 */
function cmdParse(cmd) {

/*    console.log('cmdParse() is running...');*/

    var newCmd = cmd,
        color = '',
        number = 1,
        targetPos = {x: -1, y: -1},
        lastSpace;

    if(/#/.test(cmd)) {  //这是一个BRU指令，删除'BRU'
        console.log('这是一个BRU指令');
        lastSpace = cmd.lastIndexOf(' '); //寻找最后出现的空格的位置
        color = cmd.substring(lastSpace+1, cmd.length); //截取字符串from ... to
        newCmd = cmd.substring(0, lastSpace);
    }
    else if(/,/.test(cmd)) { //必须在判断数字之前判断逗号，否则因为坐标含有数字而判定为第三种情况
        console.log('这是一个MOVETO指令');
        lastSpace = cmd.lastIndexOf(' ');
        targetPos.x = cmd.substr(lastSpace+1, 1);
        targetPos.y = cmd.substr(lastSpace+3, 1);
        newCmd = cmd.substring(0, lastSpace);
    }
    else if(/\d/.test(cmd)) {
        console.log('这是一个多步指令');
        lastSpace = cmd.lastIndexOf(' '); //寻找最后出现的空格的位置
        number = cmd.substring(lastSpace+1, cmd.length);
        newCmd = cmd.substring(0, lastSpace);
    }
    operation(newCmd, number, color, targetPos);
}

/**
 * 根据路径搜索结果翻译指令
 * @param path{array}    路径搜索结果
 * @param start{obj}    路径的起点
 * @return{array or bool}
 */
function cmdTranslate(path, start) {
    if(path!==false) {
        var p = start,
            cmdArr = [];

        for(var i=0; i<path.length; i++) {
            if(p.x === path[i].x) {
                if(p.y < path[i].y)
                    cmdArr.push('TRARIG');
                else if(p.y > path[i].y)
                    cmdArr.push('TRALEF');
            }
            else if(p.x < path[i].x){
                cmdArr.push('TRABOT');
            }
            else if(p.x > path[i].x)  {
                cmdArr.push('TRATOP');
            }
            p = path[i];
        }

        return cmdArr;
    }

    else {
        console.log('不存在路径，无法翻译成指令！');
        return false;
    }
}

/**
 * operation 执行命令的主函数
 * @ cmd{str}           命令
 * @ num{number}        命令的重复执行次数
 * @ color{str}         粉刷的颜色
 * @ targetPos{Obj}     目标点的坐标
 * */
function operation(cmd, num, color, targetPos) {

    if(cmd==='') {
        alert('请输入指令');
    }
    else {
        switch (cmd) {
            case 'GO':
                for(var i=0; i<num; i++) {
                    Go();
                }
                break;
            case 'TRABOT':
                for(var i=0; i<num; i++) {
                    GoBottom();
                }
                break;
            case 'TRATOP':
                for(var i=0; i<num; i++) {
                    GoTop();
                }
                break;
            case 'TRALEF':
                for(var i=0; i<num; i++) {
                    GoLeft();
                }
                break;
            case 'TRARIG':
                for(var i=0; i<num; i++) {
                    GoRight();
                }
                break;
            case 'TUNLEF':
                for(var i=0; i<num; i++) {
                    calDirection(-1);
                }
                break;
            case 'TUNRIG':
                for(var i=0; i<num; i++) {
                    calDirection(1);
                }
                break;
            case 'TUNBAC':
                for(var i=0; i<num; i++) {
                    calDirection(2);
                }
                break;
            case 'MOVLEF':
                switch (DIRECTION[dir]) {
                    case "TOP":
                        calDirection(-1);
                        for(var i=0; i<num; i++) {
                            GoLeft();
                        }
                        break;
                    case "RIGHT":
                        calDirection(2);
                        for(var i=0; i<num; i++) {
                            GoLeft();
                        }
                        break;
                    case "BOTTOM":
                        calDirection(1);
                        for(var i=0; i<num; i++) {
                            GoLeft();
                        }
                        break;
                    case "LEFT":
                        for(var i=0; i<num; i++) {
                            GoLeft();
                        }
                        break;
                }
                break;
            case 'MOVRIG':
                switch (DIRECTION[dir]) {
                    case "TOP":
                        calDirection(1);
                        for(var i=0; i<num; i++) {
                            GoRight();
                        }
                        break;
                    case "RIGHT":
                        for(var i=0; i<num; i++) {
                            GoRight();
                        }
                        break;
                    case "BOTTOM":
                        calDirection(-1);
                        for(var i=0; i<num; i++) {
                            GoRight();
                        }
                        break;
                    case "LEFT":
                        for(var i=0; i<num; i++) {
                            GoRight(2);
                        }
                        break;
                }
                break;
            case 'MOVTOP':
                switch (DIRECTION[dir]) {
                    case "TOP":
                        for(var i=0; i<num; i++) {
                            GoTop();
                        }
                        break;
                    case "RIGHT":
                        calDirection(-1);
                        for(var i=0; i<num; i++) {
                            GoTop();
                        }
                        break;
                    case "BOTTOM":
                        calDirection(2);
                        for(var i=0; i<num; i++) {
                            GoTop();
                        }
                        break;
                    case "LEFT":
                        calDirection(1);
                        for(var i=0; i<num; i++) {
                            GoTop();
                        }
                        break;
                }
                break;
            case 'MOVBOT':
                console.log('MOVBOT IS RUNNING...');
                switch (DIRECTION[dir]) {
                    case "TOP":
                        calDirection(2);
                        for(var i=0; i<num; i++) {
                            GoBottom();
                        }
                        break;
                    case "RIGHT":
                        calDirection(1);
                        for(var i=0; i<num; i++) {
                            GoBottom();
                        }
                        break;
                    case "BOTTOM":
                        for(var i=0; i<num; i++) {
                            GoBottom();
                        }
                        break;
                    case "LEFT":
                        calDirection(-1);
                        for(var i=0; i<num; i++) {
                            GoBottom();
                        }
                        break;
                }
                break;
            case 'MOVTO':
                /*console.log('起点为：('+posX+','+posY+')');
                console.log('终点为：('+targetPos.x+','+targetPos.y+')');*/
                MOVTO(tr, {x: posX, y: posY}, targetPos);
                break;
            case 'BUILD':
                build();
                break;
            case 'BRU':
                changeWallColor(color);
                break;
            default:
                break;
        }
    }

}


//================= ACTION FUNCTIONS ======================//

//根据图标的方向移动一格
function Go() {
    switch (DIRECTION[dir]) {
        case "TOP":
            if(posX>1) {
                cleanBlock(posX, posY);
                posX--;
                render(posX, posY);
            }
            break;
        case "RIGHT":
            if(posY<10) {
                cleanBlock(posX, posY);
                posY++;
                render(posX, posY);
            }
            break;
        case "BOTTOM":
            if(posX<10) {
                cleanBlock(posX, posY);
                posX++;
                render(posX, posY);
            }
            break;
        case "LEFT":
            if(posY>1) {
                cleanBlock(posX, posY);
                posY--;
                render(posX, posY);
            }
            break;
        default:
            break;
    }
}

//向屏幕的下面移动一格，方向不变
function GoBottom() {
    if(posX<10) {
        cleanBlock(posX, posY);
        posX++;
        render(posX, posY);
    }
}

//向屏幕的上面移动一格，方向不变
function GoTop() {
    if(posX>1) {
        cleanBlock(posX, posY);
        posX--;
        render(posX, posY);
    }
}

//向屏幕的左侧移动一格，方向不变
function GoLeft() {
    if(posY>1) {
        cleanBlock(posX, posY);
        posY--;
        render(posX, posY);
    }
}

//向屏幕的右侧移动一格，方向不变
function GoRight() {
    if(posY<10) {
        cleanBlock(posX, posY);
        posY++;
        render(posX, posY);
    }
}

function MOVTO(points, start, end) {
/*    console.log('MOVTO() IS RUNNING...');*/
    var path = findWay(points, start, end);
    var transCmd = cmdTranslate(path, start);
    if(transCmd) {
        runMOVTO(transCmd, end);
    }
}

/**
 * 接收来自MOVETO（）返回的处理好的单指令序列
 * 递归调用自身，每秒执行一条指令
 * @param cmdArr
 */
function runMOVTO(cmdArr, end) {
    /*console.log('runMOVTO() is running...');*/

    var cmdNow = cmdArr.shift(); //从队首弹出一个指令并执行
    if(cmdNow) {
        operation(cmdNow, 1, '', end);
        setTimeout(function () {
            runMOVTO(cmdArr);
        }, 500);
    }
}

/**
 * build    建立墙
 * @ wallX  墙的行坐标
 * @ wallY  墙的列坐标
 * */
function build() {
    var wallX = posX,
        wallY = posY;

    switch (DIRECTION[dir]) {
        case "TOP":
            if(wallX>1) {
                --wallX;
            }
            else{
                console.log('error5: building position is over the range!')
            }
            break;
        case "RIGHT":
            if(wallY<10) {
                ++wallY;
            }
            else{
                console.log('error5: building position is over the range!')
            }
            break;
        case "BOTTOM":
            if(wallX<10) {
                ++wallX;
            }
            else{
                console.log('error3: building position is over the range!')
            }
            break;
        case "LEFT":
            if(wallY>1) {
                --wallY;
            }
            else{
                console.log('error3: building position is over the range!')
            }
            break;
    }

    renderWall(wallX, wallY);
}

//================ CACULATION and JUDGEMENT FUNCTIONS =========//

//计算图标的方向值
function calDirection(val) {
    //顺时针 val>0

    var d = (dir+val>=0 ? dir+val : 3) % 4;
    dir = d;
    tr.item(posX).childNodes.item(posY).firstChild.className = DIRECTION[d];
}

/**
 * 寻路算法
 * @param points{array}
 * @param start{obj}
 * @param end{obj}
 * @return path{array or bool}
 */
function findWay(points, start, end) {
    console.log('findway() is running...');


    if(isWall(end.x,end.y)) {
        console.log('error4: 目标点是墙！');
        return false;
    }
    else if(start===end) {
        console.log('error5: 目标点和起点重叠！');
        return false;
    }
    else {
        resetP();

        var opens = [],     //可检索的方块（开启列表）
            closes = [],    //已检索的方块（关闭列表）
            cur = null,     //当前点的指针
            bFind = true;   //是否还需要寻找

        start.F = 0;    // F = G+H
        start.G = 0;    // G 表示从起点 A 移动到网格上指定方格的移动耗费
        start.H = 0;    // H 表示从指定的方格移动到终点 B 的预计耗费

        closes.push(start);
        cur = start;

        // 如果起始点紧邻结束点则不计算路径直接将起始点和结束点压入closes数组
        if(Math.abs(start.x - end.x) + Math.abs(start.y - end.y) === 1) {
            end.P = start;  //P表示父级
            closes.push(end);
            bFind = false;
        }

        //计算路径
        while (cur && bFind) {

            //如果当前元素cur不在closes列表中，则将其压入closes列表中
            if(!inList(cur, closes)) {
                closes.push(cur);
            }

            var rounds = getRounds(cur); //获取当前点cur的周围点
            for(var i=0; i<rounds.length; i++) {
                if(isWall(rounds[i].x, rounds[i].y) || inList(rounds[i], closes) || inList(rounds[i], opens)) {
                    continue;
                }
                else { //当四周点不在opens, closes数组中并且可移动，设置G、H、F和父级P，并压入opens数组
                    rounds[i].G = cur.G + 1;    //不算斜的，只算横竖路径，每格耗费1
                    rounds[i].H = Math.abs(rounds[i].y - end.y) + Math.abs(rounds[i].x - end.x);
                    rounds[i].F = rounds[i].G + rounds[i].H;
                    rounds[i].P = cur;
                    opens.push(rounds[i]);
                }
            }

            //若获取完四周点后opens列表为空，表示无路可走，终止路径计算
            if(opens.length===0) {
                cur = null;
                opens = [];
                closes = [];
                break;
            }

            //将opens列表根据F的值进行从小到大排序
            opens.sort(function (a,b) {
                return a.F - b.F;
            });

            var oMinF = opens[0],   //opens列表中F值最小的元素
                arrMinF = [];       //存放opens数组中F值最小的元素的集合

            //找出和最小F值相同的元素有多少
            for(var i=0; i<opens.length; i++) {
                if(opens[i].F === oMinF.F) {
                    arrMinF.push(opens[i]);
                }
            }

            if(arrMinF.length>1) {
                //计算arrMinF数组中每个元素与cur的曼哈顿距离(arrMinF[i].D)
                for(var i=0; i<arrMinF.length; i++) {
                    arrMinF[i].D = Math.abs(arrMinF[i].x - cur.x) + Math.abs(arrMinF[i].y - cur.y);
                }
                // 将aMinF按照D曼哈顿距离由小到大排序
                arrMinF.sort(function (a,b) {
                    return a.D - b.D;
                });
                oMinF = arrMinF[0]; //opens列表中曼哈顿距离、F值都最小的元素
            }

            cur = oMinF;
            if(!inList(cur, closes)) {
                closes.push(cur);
            }

            // 将cur从opens数组中删除
            for(var i=0; i<opens.length; i++) {
                if(opens[i]===cur) {
                    opens.splice(i, 1); //将第i个值删除
                    break;
                }
            }

            // 找到目标点，并将目标点压入closes数组
            if(cur.H===1) {
                end.P = cur;
                closes.push(end);
                cur = null;
            }

        }

        //找回路径
        if(closes.length) {
            var dotCur = closes[closes.length-1], //从结尾开始
                path = []; //存放最终路径
            while(dotCur) {
                path.unshift(dotCur);   //在path首部添加元素
                dotCur = dotCur.P;
                if(!dotCur.P){  //如果没有父级
                    dotCur = null;
                }
            }
            return path;
        }
        else {
            console.log('无路可走！');
            return false;
        }
    }
}

/**
 * 重置所有棋盘格子的父级指针P
 */
function resetP() {
    for(var i=1; i<=ROW; i++) {
        for(var j=1; j<COL; j++) {
            tr.item(i).childNodes.item(j).P = null;
        }
    }
}

/**
 * 判断元素是否在列表中
 * @param elem  元素
 * @param list{array}  列表
 * @return{bool}
 */
function inList(elem, list) {
    var result = false;

    for(var i=0, len=list.length; i<len; i++) {
        if((elem===list[i]) || (elem.x===list[i].x && elem.y===list[i].y)) {
            result = true;
            break;
        }
    }

    return result;
}

/**
 * 获取四周点
 * @param up, right, down, left{obj}    周围的点
 * @param cur{obj}                      当前的点
 * @return rounds{array{obj}}
 */
function getRounds(cur) {
    /*console.log('getRounds() is running...');*/
    /*console.log('当前点坐标是('+cur.x+','+cur.y+')');*/

    var up = {},
        right = {},
        down = {},
        left = {},
        rounds = [];

    // up
    if(cur.x > 1) {
        up.x = cur.x-1;
        up.y = cur.y;
        rounds.push(up);
    }
    //right
    if(cur.y+1< COL) { // points[0].length是一行的总格子数
        right.x = cur.x;
        right.y = cur.y+1;
        rounds.push(right);
    }
    //down
    if(cur.x+1< ROW) {
        down.x = cur.x+1;
        down.y = cur.y;
        rounds.push(down);
    }
    //left
    if(cur.y > 1) {
        left.x = cur.x;
        left.y = cur.y-1;
        rounds.push(left);
    }

    return rounds;
}

/**
 * 判断当前位置所指方向相邻点是否已经有墙
 * @param x 当前位置的行坐标
 * @param y 当前位置的列坐标
 */
function isWall(x, y) {
    return tr[x].childNodes[y].className === 'wall_normal';
}


//================ UI FUNCTIONS ===========================//
//添加图标的样式
function render(x, y) {
    var div = document.createElement('div');
    div.className = DIRECTION[dir];
    tr.item(x).childNodes.item(y).appendChild(div);
}

//清除图标的样式
function cleanBlock(x, y) {
    tr.item(x).childNodes.item(y).innerHTML = '';
}

//添加墙的样式
function renderWall(x, y) {
    if(isWall(x, y)) {
        console.log('error2：here has a wall!');
    }
    else {
        tr[x].childNodes[y].className = 'wall_normal';
    }
}

function changeWallColor(color) {
    var wallX = posX,
        wallY = posY;

    switch (DIRECTION[dir]) {
        case "TOP":
            --wallX;
            break;
        case "RIGHT":
            ++wallY;
            break;
        case "BOTTOM":
            ++wallX;
            break;
        case "LEFT":
            --wallY;
            break;
        default:
            break;
    }

    if(isWall(wallX, wallY)) {
        tr[wallX].childNodes[wallY].style.backgroundColor = color;
    }
    else{
        console.log('error3: there is no wall, can not do painting!');
    }
}