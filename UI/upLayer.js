/**
 * Created by LX on 2017/7/13.
 */

var mouseOffsetX = 0,   //鼠标偏移量
    mouseOffsetY = 0,
    isDraging = false,
    mousePanel,         //鼠标当前控制的需要resize的对象
    mouseCtrl,          //鼠标当前控制的需要resize的对象的边框
    mouseType,          //鼠标拖动边框的类型（右、下、右下角）
    mouseX,             //鼠标当前位置
    mouseY,
    mouseStartX = 0,    //鼠标起始横坐标
    mouseStartY = 0,
    moving = 0;         //移动计时器


var loginLink = document.getElementById('loginLink'),
    mask = document.getElementById('mask'),
    loginBox = document.getElementById('loginBox'),
    loginBoxHeader = document.getElementById('loginBoxHeader'),
    btnClose = document.getElementById('btnClose');


/**
 * 自动居中
 * @param elem
 */
function autoCenter(elem) {
    var bodyW = document.documentElement.clientWidth,  // body内容的宽度
        bodyH = document.documentElement.clientHeight, // body内容的高度
        elemW = elem.offsetWidth,                      //元素的宽度（包括其边框）
        elemH = elem.offsetHeight;
    
    elem.style.left = (bodyW-elemW)/2 + 'px';
    elem.style.top = (bodyH-elemH)/2 + 'px';
}

/**
 * 自动全屏
 * @param elem
 */
function autoFullscreen(elem) {
    elem.style.width = document.documentElement.clientWidth + 'px';
    elem.style.height = document.documentElement.clientHeight + 'px';
}

/**
 * 改变浮出层size
 * @param elem
 */
function resizable(elem) {
    var panel = elem,
        rightBox = document.createElement('div'),
        bottomBox = document.createElement('div'),
        rightBottomBox = document.createElement('div');

    rightBox.class = rightBox.className = 'resizable-box resizable-right';
    bottomBox.class = bottomBox.className = 'resizable-box resizable-bottom';
    rightBottomBox.class = rightBottomBox.className = 'resizable-box resizable-right-bottom';

    panel.appendChild(rightBox);
    panel.appendChild(bottomBox);
    panel.appendChild(rightBottomBox);

    rightBox.addEventListener('mousedown', function (event) {
        onMouseDown(event, panel, rightBox, 'r');
    });
    bottomBox.addEventListener('mousedown', function (event) {
        onMouseDown(event, panel, bottomBox, 'b');
    });
    rightBottomBox.addEventListener('mousedown', function (event) {
        onMouseDown(event, panel, rightBottomBox, 'rb');
    })
}

function onMouseDown(event, panel, ctrl, type) {
    var e = event || window.event;

    mouseStartX = e.pageX - ctrl.offsetLeft;
    mouseStartY = e.pageY - ctrl.offsetTop;

    mousePanel = panel;
    mouseCtrl = ctrl;
    mouseType = type;

    moving = setInterval(onMove, 10);
}

function onMove() {
    if(moving) {
        //鼠标移动的距离
        var toX = mouseX - mouseStartX;
        var toY = mouseY - mouseStartY;

        //限定浮出层最大的size
        var maxToX = document.documentElement.clientWidth - mousePanel.offsetLeft - 100;
        var maxToY = document.documentElement.clientHeight - mousePanel.offsetTop - 100;

        toX = Math.min(maxToX, Math.max(300, toX));
        toY = Math.min(maxToY, Math.max(200, toY));

        // 实现拖拽浮出层右边框或下边框，改变大小
        switch (mouseType) {
            // r - 右侧边框； b - 底部边框； rb - 右下角
            case "r":
                mouseCtrl.style.left = toX + 'px';
                mousePanel.style.width = toX + 'px';
                break;
            case "b":
                mouseCtrl.style.top = toY + 'px';
                mousePanel.style.height = toY + 'px';
                break;
            case "rb":
                console.log(mouseCtrl.style.left);
                mouseCtrl.style.left = toX-8 + 'px';
                mouseCtrl.style.top = toY-8 + 'px';
                mousePanel.style.width = toX + 'px';
                mousePanel.style.height = toY + 'px';
                break;
            default:
                break;
        }
    }
}



//=================== EVENT BIND ================================//

/**
 * 当鼠标在document范围移动时，计算鼠标的移动情况
 */
document.onmousemove = function (event) {
    var e = event || window.event;
    var moveX = 0,          //鼠标在横轴上移动的距离
        moveY = 0;

    mouseX = e.pageX;
    mouseY = e.pageY;

    if(isDraging) {
        moveX = mouseX - mouseOffsetX;
        moveY = mouseY - mouseOffsetY;

        //获取页面大小（不包括页面本身的边框）
        var pageWidth = document.documentElement.clientWidth;
        var pageHeight = document.documentElement.clientHeight;

        //获取浮出层大小（包括边框）
        var loginBoxWidth = loginBox.offsetWidth;
        var loginBoxHeight = loginBox.offsetHeight;

        var maxMoveX = pageWidth-loginBoxWidth;
        var maxMoveY = pageHeight-loginBoxHeight;

        moveX = Math.min(maxMoveX, Math.max(0, moveX));
        moveY = Math.min(maxMoveY, Math.max(0, moveY));
        loginBox.style.left = moveX + 'px';
        loginBox.style.top = moveY + 'px';
    }
};

/**
 * 当鼠标弹起时，停止移动和改变size的功能
 */
document.onmouseup = function () {
    isDraging = false;
    clearInterval(moving);
    moving = 0;

    var resizableBox = document.getElementsByClassName('resizable-box');
    for(var i=0; i<resizableBox.length; i++) {
        resizableBox[i].style.left = '';
        resizableBox[i].style.top = '';
    }
};

/**
 * 鼠标拖拽事件：拖拽浮出层顶部，实现移动
 */
loginBoxHeader.addEventListener('mousedown', function (event) {
    var e = event || window.event;
    mouseOffsetX = e.pageX - loginBox.offsetLeft; //鼠标点击点距离浮出层左边框的距离
    mouseOffsetY = e.pageY - loginBox.offsetTop;  //鼠标点击点距离浮出层上边框的距离
    isDraging = true;
});

/**
 * 点击半透明遮罩和关闭按钮时，使半透明遮罩和登陆框不可见
 */
mask.onclick = btnClose.onclick = function () {
    mask.style.display = 'none';
    loginBox.style.display = 'none';
};

/**
 * 点击页面标题栏“登录”链接时，使半透明遮罩和登陆框可见
 */
loginLink.onclick = function () {
    mask.style.display = 'block';
    loginBox.style.display = 'block';
};

//=============================== RUN ============================//

window.onload = function onResize() {
    autoCenter(loginBox);
    autoFullscreen(mask);
    resizable(loginBox);
};