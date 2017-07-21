/**
 * Created by LX on 2017/7/10.
 */

//================= GLOBAL PARAMETERS ===================//
var table = document.getElementsByTagName('table')[0],
    tr = document.getElementsByTagName('tr'),
    search = document.getElementsByTagName('input')[0],
    btn_opt = document.getElementById('btn_opt'),
    btn_clear = document.getElementById('btn_clear');

//产生1~10之间的随机整数，用于方块初始化定位坐标
var randPosX = Math.floor(Math.random()*10)+1,
    randPosY = Math.floor(Math.random()*10)+1,
    posX = randPosX,
    posY = randPosY,
    dir = 0,
    DIRECTION = ["TOP", "RIGHT", "BOTTOM", "LEFT"];


//============= init ==================================//
(function createTable() {

    var number = 11,
        tr = [];

    for(var i=0; i<number; i++) {
        tr[i] = document.createElement('tr');
        table.appendChild(tr[i]);
        var td = [];

        for(var j=0; j<number; j++) {

            td[j] =document.createElement('td');
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
render(randPosX, randPosY);
btn_opt.onclick = function () {
    var cmd = search.value.trim();
    operation(cmd);
};
btn_clear.onclick = function () {
    search.value = '';
};



// ============= FUNCTIONS ============================//
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

function operation(cmd) {

    if(cmd==='') {
        alert('请输入指令');
    }
    else {
        switch (cmd) {
            case 'GO':
                Go();
                break;
            case 'TRABOT':
                GoBottom();
                break;
            case 'TRATOP':
                GoTop();
                break;
            case 'TRALEF':
                GoLeft();
                break;
            case 'TRARIG':
                GoRight();
                break;
            case 'TUNLEF':
                calDirection(-1);
                break;
            case 'TUNRIG':
                calDirection(1);
                break;
            case 'TUNBAC':
                calDirection(2);
                break;
            case 'MOVLEF':
                switch (DIRECTION[dir]) {
                    case "TOP":
                        calDirection(-1);
                        GoLeft();
                        break;
                    case "RIGHT":
                        calDirection(2);
                        GoLeft();
                        break;
                    case "BOTTOM":
                        calDirection(1);
                        GoLeft();
                        break;
                    case "LEFT":
                        GoLeft();
                        break;
                }
                break;
            case 'MOVRIG':
                switch (DIRECTION[dir]) {
                    case "TOP":
                        calDirection(1);
                        GoRight();
                        break;
                    case "RIGHT":
                        GoRight();
                        break;
                    case "BOTTOM":
                        calDirection(-1);
                        GoRight();
                        break;
                    case "LEFT":
                        GoRight(2);
                        break;
                }
                break;
            case 'MOVTOP':
                switch (DIRECTION[dir]) {
                    case "TOP":
                        GoTop();
                        break;
                    case "RIGHT":
                        calDirection(-1);
                        GoTop();
                        break;
                    case "BOTTOM":
                        calDirection(2);
                        GoTop();
                        break;
                    case "LEFT":
                        calDirection(1);
                        GoTop();
                        break;
                }
                break;
            case 'MOVBOT':
                switch (DIRECTION[dir]) {
                    case "TOP":
                        calDirection(2);
                        GoBottom();
                        break;
                    case "RIGHT":
                        calDirection(1);
                        GoBottom();
                        break;
                    case "BOTTOM":
                        GoBottom();
                        break;
                    case "LEFT":
                        calDirection(-1);
                        GoBottom();
                        break;
                }
                break;
            default:
                break;
        }
    }
}


