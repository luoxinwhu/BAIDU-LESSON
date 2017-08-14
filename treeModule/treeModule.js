/**
 * Created by LX on 2017/7/9.
 */

//=====================================================//
//               treeNode 类封装                         //
//=====================================================//
function treeNode(obj) {
    this.parent = obj.parent;
    this.childs = obj.childs || [];
    this.data = obj.data || '';
    this.selfElem = obj.selfElem;   //访问对应的DOM节点
    this.selfElem.treeNode = this;  //对应的DOM节点访问回来
}
treeNode.prototype = {

    constructor: treeNode,

    /**
     * render 样式操作
     * 后两个参数可以省略
     * @ arrow      箭头
     * @ visibility 可见性
     * @ hightlight 高亮
     * @ normal    默认
     * */
    render: function (arrow, visibility, hightlight, normal) {
        if(arguments.length<3) {
            hightlight = false;
            normal = false;
        }
        if(arrow) {
            if(this.isLeaf()) {
                //是个叶子节点，设为圆点
                this.selfElem.getElementsByClassName('arrow')[0].className = 'arrow empty-arrow';
            }
            else if(this.isFolded()) {
                //折叠状态，设为右箭头
                this.selfElem.getElementsByClassName('arrow')[0].className = 'arrow right-arrow';
            }
            else {
                //展开状态，设为下箭头
                this.selfElem.getElementsByClassName('arrow')[0].className = 'arrow down-arrow';
            }
        }
        if(visibility) {
            if(this.selfElem.className.indexOf('nodebody-visible') == -1) {
                //用visible替换hidden,改为可见
                this.selfElem.className = this.selfElem.className.replace('hidden', 'visible');
            }
            else{
                this.selfElem.className = this.selfElem.className.replace('visible','hidden');
            }
        }
        if(hightlight) {
            this.selfElem.getElementsByClassName("node-title")[0].className = "node-title node-title-highlight";
        }
        if(normal) {
            this.selfElem.getElementsByClassName("node-title")[0].className = "node-title";
        }

    },

    // 删除节点，DOM会自动递归删除子节点，treeNode递归手动删除子节点
    deleteNode: function () {
        if(!this.isLeaf()) {
            for(var i=0; i<this.childs.length; i++) {
                // 递归删除该节点的所有子节点
                this.childs[i].deleteNode();
            }
        }

        this.parent.selfElem.removeChild(this.selfElem);    //删除对应的DOM节点
        for(var i=0; i<this.parent.childs.length; i++) {
            //从父节点删除此节点
            if(this.parent.childs[i] == this) {
                this.parent.childs.splice(i,1);
                break;
            }
        }

        // 调整父节点箭头样式
        this.parent.render(true, false);
    },

    // 增加节点
    addNode: function (text) {
        if(text==null){
            alert('请输入要添加的节点内容');
            return this;
        }
        if(text.trim()==''){
            alert('节点内容不能为空！');
            return this;
        }
        //若当前节点不是叶子节点，且已折叠，则先将其展开
        if(!this.isLeaf() && this.isFolded()) {
            this.toggleFold();
        }

        //创建新节点并挂树
        var newNode = document.createElement('div');
        newNode.className = 'nodebody-visible';
        var newHeader = document.createElement('label');
        newHeader.className = 'node-header';
        var newSymbol = document.createElement('div');
        newSymbol.className = 'arrow arrow-empty';
        var newTitle = document.createElement('span');
        newTitle.className = 'node-title';
        newTitle.innerHTML = text;
        var space = document.createElement('span');
        space.innerHTML = '&nbsp;&nbsp;';
        var newDelete = document.createElement('img');
        newDelete.className = 'deleteIcon';
        newDelete.src = 'img/delete.png';
        var newAdd = document.createElement('img');
        newAdd.className = 'addIcon';
        newAdd.src = 'img/add.png';

        //<div><label><div><span><img><img></img></img></span></div></label></div>
        //node-header-arrow-title-add-del
        newHeader.appendChild(newSymbol);
        newHeader.appendChild(newTitle);
        newHeader.appendChild(space);
        newHeader.appendChild(newAdd);
        newHeader.appendChild(newDelete);
        newNode.appendChild(newHeader);

        this.selfElem.appendChild(newNode);
        //创建对应的treeNode对象并添加到子节点队列中
        this.childs.push(new treeNode({parent:this, childs:[], data:text, selfElem:newNode}));
        //渲染自身样式
        this.render(true, false);
        //返回自身，以便链式操作
        return this;
    },

    //展开收拢节点
    toggleFold: function () {
        if(this.isLeaf())
            return this;
        for(var i=0; i<this.childs.length; i++) {
            //设置所有子节点为可见状态
            this.childs[i].render(false, true);
        }
        this.render(true, false);
        return this;
    },

    //判断是否是叶子节点
    isLeaf: function () {
        return this.childs.length===0;
    },

    //判断是否折叠
    isFolded: function () {
        if(this.isLeaf())
            return false;
        if(this.childs[0].selfElem.className === 'nodebody-visible')
            return false;
        return true;
    },

    //广度搜索函数
    search: function (query) {
        var resultList = [],
            queue = [],         //“待访问”队列
            current = this;

        queue.push(current);
        while(queue.length>0) {

            //从“待访问”队列取出队首节点访问，并将其所有子节点入队
            //shift() 方法用于把数组的第一个元素从数组中删除,并返回第一个元素的值。
            current = queue.shift();
            current.render(false, false, false, true);
            if(current.data === query) {
                resultList.push(current);
            }
            //将当前节点的所有孩子节点入“当访问”队列
            for(var i=0; i<current.childs.length; i++) {
                queue.push(current.childs[i]);
            }
        }
        return resultList;
    }


};



//======================================================//
//                  事件绑定                            //
//======================================================//

var root = new treeNode({parent: [], childs:[], data:'luoxin', selfElem: document.getElementsByClassName('nodebody-visible')[0]}),
    btn_search = document.getElementById('btn_search'),
    searchText = document.getElementById('searchText'),
    result = document.getElementById('result'),
    btn_clear = document.getElementById('btn_clear');

/**
 * addEvent 跨浏览器兼容的工具函数
 * @element 对象
 * @type    事件类型
 * @handler 事件句柄
 * */
function addEvent(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    }
    else {
        element["on" + type] = handler;
    }
}


addEvent(root.selfElem, 'click', function (e) {
    //event.srcElement 可以捕获当前事件作用的对象
    //IE下,event对象有srcElement属性,但是没有target属性;
    // Firefox下,event对象有target属性,但是没有srcElement属性.但他们的作用是相当的
    var targetNode = e.target || e.srcElement,
        domNode = targetNode;

    //找类名含有nodebody前缀的DOM节点
    while(domNode.className.indexOf('nodebody') == -1) {
        domNode = domNode.parentNode;
    }

    //如果鼠标在节点文字或箭头上
    selectNode = domNode.treeNode;
    if(targetNode.className.indexOf('node-title')!=-1 || targetNode.className.indexOf('arrow')!=-1) {
        selectNode.toggleFold();
    }
    else if(targetNode.className == 'addIcon') {
        //鼠标在加号上
        //prompt() 方法用于显示可提示用户进行输入的对话框。
        selectNode.addNode(prompt('请输入要添加的节点内容'));
    }
    else if(targetNode.className == 'deleteIcon') {
        //鼠标在删除键上
        selectNode.deleteNode();
    }
});
addEvent(btn_search, 'click', function () {
    var text = searchText.value.trim();
    if(text == '') {
        result.innerHTML = '请输入查询内容！';
        return ;
    }
    var resultList = root.search(text);
    if(resultList.length == 0) {
        result.innerHTML = '没有查询到符合条件的节点！';
    }
    else {
        result.innerHTML = '查询到' + resultList.length + '个符合条件的节点';
        var pathNode;
        for(var i=0; i<resultList.length; i++) {
            pathNode = resultList[i];
            pathNode.render(false, false, true, false);
            while (pathNode.parent != null) {
                if (pathNode.selfElem.className == "nodebody-hidden")
                    pathNode.parent.toggleFold(); // 若是收拢状态，则展开
                pathNode = pathNode.parent;
            }
        }
    }
});
addEvent(btn_clear,'click', function () {
    searchText.value = '';
    result.innerHTML = '';
    root.search(null);  //清除高亮样式
});


//=======================================================//
//                  demo                                 //
//=======================================================//

root.addNode('学习')
    .addNode('娱乐')
    .addNode('生活');

root.childs[0].addNode('研究生')
              .addNode('本科');
root.childs[1].addNode('movie')
              .addNode('music');
root.childs[1].childs[1].addNode('晴天');
root.childs[2].addNode('traveling')
              .addNode('cooking')
              .addNode('shopping');

//初始化查询的demo
searchText.value = 'music';







