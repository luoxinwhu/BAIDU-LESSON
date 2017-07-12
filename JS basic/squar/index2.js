/**
 * Created by LX on 2017/7/10.
 */

//================= GLOBAL PARAMETERS ===================//
var table = document.getElementsByTagName('table')[0],
    tr = document.getElementsByTagName('tr'),
    cmdText = document.getElementById('cmdText'),
    btn_opt = document.getElementById('btn_opt'),
    btn_clear = document.getElementById('btn_clear'),
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
    cmdCheck();
};

btn_clear.onclick = function () {
    cmdText.value = '';
    cmdRowNum.innerHTML = '';
};



// ============= FUNCTIONS ============================//

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

function cmdCheck() {
    var cmd = cmdText.value.trim(),
        cmdArr = cmd.split('\n');

    command(cmdArr[0], 0);

    var index = 1;  //待执行的命令索引
    var timer = setInterval(function () {
        if(cmdArr.length>index) {   //命令不止一条
            command(cmdArr[index], index);  //执行指定命令条
            ++index;
        }
        else {
            clearInterval(timer);
        }
    }, 1000);

}

function command(cmd, index) {
    var cmdArr = cmd.split(' '), //用空格拆分字符串存放在数组中
        finalElem = cmdArr[cmdArr.length-1],
        currentCmd = '';

    if(!isNaN(finalElem)) { //最后一位是数字
        cmdArr.pop();   //删除最后一位元素
        currentCmd = cmdArr.join(' ');  //用空格拼接内容为字符串
        if(    currentCmd!='GO'
            && currentCmd!='TRABOT'
            && currentCmd!='TRATOP'
            && currentCmd!='TRALEF'
            && currentCmd!='TRARIG'
            && currentCmd!='TUNLEF'
            && currentCmd!='TUNRIG'
            && currentCmd!='TUNBAC'
            && currentCmd!='MOVLEF'
            && currentCmd!='MOVRIG'
            && currentCmd!='MOVTOP'
            && currentCmd!='MOVBOT') {

            document.getElementsByClassName('rowNum')[index].className = 'error';
        }
        operation(currentCmd, finalElem, index);
    }
    else{
        currentCmd = cmdArr.join(' ');
        if(    currentCmd!='GO'
            && currentCmd!='TRABOT'
            && currentCmd!='TRATOP'
            && currentCmd!='TRALEF'
            && currentCmd!='TRARIG'
            && currentCmd!='TUNLEF'
            && currentCmd!='TUNRIG'
            && currentCmd!='TUNBAC'
            && currentCmd!='MOVLEF'
            && currentCmd!='MOVRIG'
            && currentCmd!='MOVTOP'
            && currentCmd!='MOVBOT') {

            document.getElementsByClassName('rowNum')[index].className = 'error';
        }
        operation(currentCmd, 1, index);
    }

}

/**
 * operation 执行命令的主函数
 * @ cmd    命令
 * @ num    命令的重复执行次数
 * @ index  待执行的命令索引（这是第几条命令）*/
function operation(cmd, num, index) {

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
            default:

                break;
        }
    }
}

function render(x, y) {
    var div = document.createElement('div');
    div.className = DIRECTION[dir];
    tr.item(x).childNodes.item(y).appendChild(div);
}

function cleanBlock(x, y) {
    tr.item(x).childNodes.item(y).innerHTML = '';
}

function calDirection(val) {
    //顺时针 val>0

    var d = (dir+val>=0 ? dir+val : 3) % 4;
    dir = d;
    tr.item(posX).childNodes.item(posY).firstChild.className = DIRECTION[d];
}

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




