/**
 * Created by LX on 2017/7/8.
 */

//全局变量
var tagInput = document.getElementById('tag_input'),
    tagList = document.getElementById('tag_list'),
    hobbyInput = document.getElementById('hobby_input'),
    hobbyList = document.getElementById('hobby_list'),
    hobbyBtn = document.getElementsByTagName('button')[0];


//事件绑定兼容性句柄函数
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
 * CreatList 构造标签结果表
 * @param divList
 * @constructor
 */

function CreatList(divList) {
    this.queue = [];

    //添加子节点
    this.render = function () {
        var str = '';
        this.queue.forEach(function (e) {
            str += '<span>' + e + '</span>';
        });
        divList.innerHTML = str;
    }
}
//从右侧入队列
CreatList.prototype.rightPush = function(str) {
    this.queue.push(str);
    this.render();
};
//删除数组的第一个元素
CreatList.prototype.leftShift = function() {
    this.queue.shift();
    this.render();
};
//实例对象
var tagObj = new CreatList(tagList);
var hobbyObj = new CreatList(hobbyList);




/**
 * splitInput : 分割输入数据
 * @param str - 输入字符串
 * @returns {Array} - 分割后的字符串数组
 */
function splitInput(str) {
    var inputArray = str.trim().split(/,|，|、|\s|\t|\r|\n/);
    return inputArray;
}


/**
 * showTag : 显示标签
 * @param event
 */
function showTag(event) {
    if (/(,| |\，)$/.test(tagInput.value) || event.keyCode == 13) {
        var data = splitInput(tagInput.value);
        var newTag = data[0];

        //如果newTag在字符串队列中未出现过
        if (tagObj.queue.indexOf(newTag) === -1) {
            tagObj.rightPush(newTag);
            if (tagObj.queue.length > 10) {
                tagObj.leftShift();
            }
        }
        tagObj.render();
        tagInput.value = '';
    }
}


/**
 * showHobby: 显示爱好
 */
function showHobby() {
    var data = splitInput(hobbyInput.value);
    data.forEach(function (e) {
        if (hobbyObj.queue.indexOf(e) === -1) {
            hobbyObj.rightPush(e);
            if (hobbyObj.queue.length > 10) {
                hobbyObj.leftShift();
            }
        }
        hobbyObj.render();
        hobbyInput.value = "";
    });
}


window.onload = function () {
//事件绑定
    addEventHandler(tagInput,'keyup',showTag);
    addEventHandler(hobbyBtn,'click',showHobby);

    addEventHandler(tagList,'mouseover',function (e) {
        if(e.target && e.target.nodeName == "SPAN") {
            //向鼠标所在标签的文本节点（firstchild）的第0个位置开始插入数据
            e.target.firstChild.insertData(0,'点击删除');
            e.target.style.background = 'red';
        }
    });
    addEventHandler(tagList,'mouseout',function(e) {
        if(e.target && e.target.nodeName == "SPAN") {
            e.target.firstChild.deleteData(0,4);
            e.target.style.backgroundColor = '#78BCFB';
        }
    });
    addEventHandler(tagList,'click',function (e) {
        if(e.target && e.target.nodeName == "SPAN") {
            tagList.removeChild(e.target);
        }
    });
    addEventHandler(hobbyList, 'mouseover', function (e) {
        if(e.target && e.target.nodeName == "SPAN") {
            //向鼠标所在标签的文本节点（firstchild）的第0个位置开始插入数据
            e.target.firstChild.insertData(0, '点击删除');
            e.target.style.background = 'red';
        }
    });
    addEventHandler(hobbyList, 'mouseout', function (e) {
        if(e.target && e.target.nodeName == "SPAN") {
            e.target.firstChild.deleteData(0,4);
            e.target.style.backgroundColor = '#ffb30c';
        }
    });
    addEventHandler(hobbyList,'click',function (e) {
        if(e.target && e.target.nodeName == "SPAN") {
            hobbyList.removeChild(e.target);
        }
    });
};



