/**
 * Created by LX on 2017/7/9.
 */

var btnPrev = document.getElementById('btnPrev'),
    btnMid = document.getElementById('btnMid'),
    btnPost = document.getElementById('btnPost'),
    root = document.getElementsByClassName('root')[0];
    divList = [];
    timer = null;   //执行变色操作的计时器

/*
* 遍历函数
* @ prevOrder   前序遍历
* @ midOrder    中序遍历
* @ postOrder   后序遍历
* @ node        某一个需要遍历的节点
* */
function prevOrder(node) {

    if(node != null) {
        divList.push(node);
        prevOrder(node.firstElementChild);
        prevOrder(node.lastElementChild);   //因为每个节点只有2个孩子，右子树根节点也就是最后一个孩子
    }
}

function midOrder(node) {

    if(node != null) {
        midOrder(node.firstElementChild);
        divList.push(node);
        midOrder(node.lastElementChild);
    }
}

function postOrder(node) {

    if(node != null) {
        postOrder(node.firstElementChild);
        postOrder(node.lastElementChild);
        divList.push(node);
    }
}

// 初始化样式
function resetStyle() {

    divList = [];
    clearInterval(timer);
    var divs = document.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i++) {
        divs[i].style.backgroundColor = '#ffffff';
    }
}



// 颜色变化函数
function changeColor() {

    var i=0;
    divList[i].style.backgroundColor = '#FFF5B9';
    timer = setInterval(function () {
        i++;
        if(divList.length > i) {
            divList[i-1].style.backgroundColor = '#ffffff';
            divList[i].style.backgroundColor = '#FFF5B9';
        }
        else {
            clearInterval(timer);
            divList[divList.length-1].style.backgroundColor = '#ffffff';
        }
    }, 800);


}

// 事件绑定兼容性句柄函数
function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+event, hanlder);
    } else  {
        ele["on" + event] = hanlder;
    }
}



/**
 * 绑定按钮点击事件
 */

window.onload = function () {

   addEventHandler(btnPrev, 'click', function () {
       resetStyle();
       prevOrder(root);
       changeColor();
   });

   addEventHandler(btnMid,'click', function () {
       resetStyle();
       midOrder(root);
       changeColor();
   });
   addEventHandler(btnPost, 'click', function () {
        resetStyle();
        postOrder(root);
        changeColor();
   });


};