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

//产生1~10之间的随机整数，用于方块初始化定位坐标
var randPosX = Math.floor(Math.random()*10)+1,
    randPosY = Math.floor(Math.random()*10)+1,
    posX = randPosX,
    posY = randPosY,
    dir = 0,
    DIRECTION = ["TOP", "RIGHT", "BOTTOM", "LEFT"];


//============= init ==================================//
//绘制棋盘
(function createTable() {

    var number = 11,
        tr = [];

    for(var i=0; i<number; i++) {
        tr[i] = document.createElement('tr');
        table.appendChild(tr[i]);
        var td = [];

        for(var j=0; j<number; j++) {

            td[j] = document.createElement('td');
            if(i===0 && j===0) {
                td[j].style.border = 'none';
            }
            if(i===0 && j>0) {
                //标注列号
                td[j].innerHTML = j;
                td[j].className = 'number';
            }
            if(i>0 && j===0) {
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
        renderWall(wallX, wallY);
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
            console.log('clearInterval is running...');
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

    /*console.log('cmdCheck() is running...');*/

    //合法的命令格式为 “GO 4”, "TRALEF 4", "MOVLEF 4", "BRU #000", "BRU #F23002", "MOVETO 4,5"
    var regGo = /^GO(\s+\d+)?$/,
        regTUN = /^TUN(LEF|RIG|BAC)$/,
        regTRAMOV = /^(TRA|MOV)(LEF|RIG|TOP|BOT)(\s\d+)?$/,
        regBUILD = /^BUILD$/,
        regBRU = /^BRU\s+(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})$/,
        regMOVTO = /^MOVETO\s\d+,\d+$/;

    var result = !regGo.test(cmd) && !regTUN.test(cmd) && !regTRAMOV.test(cmd) && !regBUILD.test(cmd) && !regBRU.test(cmd) && !regMOVTO.test(cmd);

    //当cmd为合法指令时，6个test结果只有一个是TRUE，取反后为FALSE，与运算只要有一个FALSE结果为FALSE
    //当cmd为非法指令，所有结果为FALSE，取反后为TRUE，结果为TRUE
    if(result === true) {
        console.log('error2: command is error!');
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

    /*console.log('cmdParse() is running...');*/

    var newCmd = cmd,
        color = '',
        number = 1,
        lastSpace;

    for(var i in cmd) { //检测cmd的每一个字符
        if(/#/.test(cmd)) {  //cmd字符内含有‘#’,表示这是一个BRU指令，删除'BRU'
            lastSpace = cmd.lastIndexOf(' '); //寻找最后出现的空格的位置
            color = cmd.substring(lastSpace+1, cmd.length);
            newCmd = cmd.substring(0, lastSpace);
        }
        else if(/\d/.test(cmd)) {
            lastSpace = cmd.lastIndexOf(' '); //寻找最后出现的空格的位置
            number = cmd.substring(lastSpace+1, cmd.length);
            newCmd = cmd.substring(0, lastSpace);
        }
        /*else if(/,/.test(cmd)) { //这是一个MOVETO指令
            operation(cmd, 1, '');
        }*/
    }

    operation(newCmd, number, color);
}

/**
 * operation 执行命令的主函数
 * @ cmd    命令
 * @ num    命令的重复执行次数
 * @ index  待执行的命令索引（这是第几条命令）*/
function operation(cmd, num, color) {

    console.log('operation() is running...');

    if(cmd==='') {
        alert('请输入指令');
    }
    else {
        switch (cmd) {
            case 'GO':
                console.log('GO is running...');
                console.log(num);
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
                console.log('TUNRIG is running...');
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
                /* move to (x, y)*/
                break;

            case 'BUILD':
                build();
                break;
            case 'BRU':
                console.log('BRU IS RUNNING...');
                changeWallColor(color);
                break;
            default:
                break;
        }
    }
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
    if(tr.item(x).childNodes.item(y).className === 'wall_normal') {
        console.log('error：here has a wall!');
    }
    else {
        tr.item(x).childNodes.item(y).className = 'wall_normal';
    }
}

function changeWallColor(color) {
    var wallX = posX,
        wallY = posY;

    switch (DIRECTION[dir]) {
        case "TOP":
            --wallX;
            if(tr.item(wallX).childNodes.item(wallY).className === 'wall_normal') {
                tr.item(wallX).childNodes.item(wallY).style.backgroundColor = color;
            }
            else {
                console.log('there is no wall, can not do painting!');
            }
            break;
        case "RIGHT":
            ++wallY;
            if(tr.item(wallX).childNodes.item(wallY).className === 'wall_normal') {
                tr.item(wallX).childNodes.item(wallY).style.backgroundColor = color;
            }
            else{
                console.log('there is no wall, can not do painting!');
            }
            break;
        case "BOTTOM":
            ++wallX;
            if(tr.item(wallX).childNodes.item(wallY).className === 'wall_normal') {
                tr.item(wallX).childNodes.item(wallY).style.backgroundColor = color;
            }
            else{
                console.log('there is no wall, can not do painting!');
            }
            break;
        case "LEFT":
            --wallY;
            if(tr.item(wallX).childNodes.item(wallY).className === 'wall_normal') {
                tr.item(wallX).childNodes.item(wallY).style.backgroundColor = color;
            }
            else{
                console.log('there is no wall, can not do painting!');
            }
            break;
        default:
            break;
    }
}

//================ DIRECTION CACULATION FUNCTIONS =========//

//计算图标的方向值
function calDirection(val) {
    //顺时针 val>0

    var d = (dir+val>=0 ? dir+val : 3) % 4;
    dir = d;
    tr.item(posX).childNodes.item(posY).firstChild.className = DIRECTION[d];
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

function MOVETO(x,y) {
    cleanBlock(posX, posY);
    render(x, y);
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
                renderWall(wallX, wallY);
            }
            else{
                console.log('error3: building position is over the range!')
            }
            break;
        case "RIGHT":
            if(wallY<10) {
                ++wallY;
                renderWall(wallX, wallY);
            }
            else{
                console.log('error3: building position is over the range!')
            }
            break;
        case "BOTTOM":
            if(wallX<10) {
                ++wallX;
                renderWall(wallX, wallY);
            }
            else{
                console.log('error3: building position is over the range!')
            }
            break;
        case "LEFT":
            if(wallY>1) {
                --wallY;
                renderWall(wallX, wallY);
            }
            else{
                console.log('error3: building position is over the range!')
            }
            break;
        default:
            break;
    }
}
