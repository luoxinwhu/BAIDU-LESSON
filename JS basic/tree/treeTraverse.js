/**
 * Created by LX on 2017/7/9.
 */

var btnTraverse = document.getElementsByClassName('btnTraverse'),
    btnDel = document.getElementsByClassName('btnDel')[0],
    btnAdd = document.getElementsByClassName('btnAdd')[0],
    section = document.getElementsByTagName('section')[0],
    root = document.getElementsByClassName('root')[0],
    foundText = document.getElementById('foundText'),
    timer = null,   //执行变色操作的计时器
    BFindex = 0,    //广度优先算法层次标识符
    lock = false;   //表示未在遍历



/**
 * @ resetStyle 初始化样式
 * @ traverRender 颜色变化函数
 */
var defaultColor = '#ffffff',
    activeColor = 'yellow',
    foundColor = 'red';

function resetStyle() {
    var nodeList = [];
    clearInterval(timer);
    traverseDF(root,nodeList);
    for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].style.backgroundColor = defaultColor;
    }
}
function traverRender(nodeList, foundText) {

    var i = 0;
    var len = nodeList.length;

    if (nodeList[i].firstChild.nodeValue.replace(/(^\s*)|(\s*$)/g, "") == foundText.value) {
        nodeList[i].style.backgroundColor = foundColor;
        lock = false;
        clearInterval(timer);
    } else {
        nodeList[i++].style.backgroundColor = activeColor;
    }
    lock = true;
    timer = setInterval(function(){
        if(i<len){
            nodeList[i-1].style.backgroundColor = defaultColor;
            if(nodeList[i].firstChild.nodeValue.replace(/(^\s*)|(\s*$)/g, "") == foundText.value){
                nodeList[i].style.backgroundColor = foundColor;
                lock = false;
                clearInterval(timer);
            }
            else{
                nodeList[i++].style.backgroundColor = activeColor;
            }
        }
        else{
            nodeList[i-1].style.backgroundColor = defaultColor;
            lock = false;
            clearInterval(timer);
        }

    },500);
}


/**
 * @ traverse 遍历算法
 * @ traverseDF 深度优先算法
 * @ traverseBF 广度优先算法
 */
function  traverseDF(node, nodeList) {
    if(node) {
        nodeList.push(node);
        for(var i=0; i<node.children.length; i++) {
            traverseDF(node.children[i], nodeList);
        }
    }
}

function traverseBF(node, nodeList) {
    if(node) {
        nodeList.push(node);
        traverseBF(node.nextElementSibling, nodeList);
        node = nodeList[BFindex++];
        traverseBF(node.firstElementChild, nodeList);
    }
}

function traverse(index) {
    var nodeList = [],
        foundText = "";

    switch (index) {
        case 0:
            console.log('广度优先搜索正在执行...');
            BFindex = 0;
            foundText = document.getElementById('foundText').value;
            traverseBF(root, nodeList);
            break;
        case 1:
            console.log('深度优先搜索正在执行...');
            foundText = document.getElementById('foundText').value;
            traverseDF(root, nodeList);
            break;
        case 2:
            console.log('广度优先遍历正在执行...');
            BFindex = 0;
            traverseBF(root, nodeList);
            break;
        case 3:
            console.log('深度优先遍历正在执行...');
            traverseDF(root, nodeList);
            break;
    }

    resetStyle();
    setTimeout( traverRender(nodeList, foundText),500);
}


/**
 * 节点操作
 * @ delNode 删除节点
 * @ addNode 添加节点
 * */
function delNode(selectNodes) {
    if(selectNodes.length<1) {
        alert('请选择要操作的节点');
    }
    else {
        for(var i=0; i<selectNodes.length; i++) {
            selectNodes[i].parentNode.removeChild(selectNodes[i]);
        }
    }
}

function addNode(selectNodes) {

    var value = foundText.value.trim();
    if(!value) {
        alert('请填写新节点的内容');
    }
    else if(selectNodes.length<1) {
        alert('请选择要操作的节点');
    }
    else {
        var newNode = document.createElement('div');
        newNode.innerHTML = value;
        newNode.className = 'add';
        for(var i=0; i<selectNodes.length; i++) {
            selectNodes[i].appendChild(newNode);
        }
    }
}


/**
 * 事件绑定
 */
// 绑定选中节点变色的点击事件
section.onclick = function (e) {
    if(!e.target.id) {
        e.target.id = 'focus';
    }
    else {
        e.target.removeAttribute('id');
    }
};

// 绑定搜索和遍历的点击事件
for(var i=0; i<btnTraverse.length; i++) {
    (function (i) {
        btnTraverse[i].onclick = function () {
            if(lock) {
                alert('正在遍历中！');
            }
            else {
                traverse(i);
            }
        };
    }(i));
}

// 绑定节点操作的点击事件
btnDel.onclick = function() {
    delNode(document.querySelectorAll('#focus'));
};
btnAdd.onclick = function() {
    addNode(document.querySelectorAll('#focus'));
};
