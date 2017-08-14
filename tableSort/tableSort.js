/**
 * Created by Administrator on 2017/7/21.
 */

/*var dataInit = [
    ['name', 'English', 'Math','Chinese', 'score'],
    ['Diana', 90, 80, 90, 260],
    ['Mike', 80, 60, 90, 230]
];*/

var MINROW = 2;                                         //最小行数
var MINCOL = 2;                                         //最小列数
var rowNum = document.getElementById('rowIn').value;    //用户设置的行数
var colNum = document.getElementById('colIn').value;    //用户设置的列数
var dataInit = [];                                      //表格数据
var table_1 = document.querySelector(".gradeStu");
var btnCreate = document.getElementById('btnCreate');
var btnClear = document.getElementById('btnClear');
var dataText = document.getElementById('dataText');

/**
 * 创建表格
 */
function createTable() {

    if(rowNum<MINROW || colNum<MINCOL) {
        alert('#warning：表格行列数太少！')
    }
    else if(rowNum==dataInit.length && colNum==dataInit[0].length){
        var tr0 = document.createElement('tr');
        table_1.appendChild(tr0);
        for(var j=0; j<dataInit[0].length; j++) {
            //表头行
            var th = '<th>'+ dataInit[0][j] +
                '<div  class="downButt ' + dataInit[0][j] +'"></div>' +
                '<div class="upButt ' + dataInit[0][j] + '"></div></th>';
            tr0.innerHTML += th;
        }

        var trs = [];   //数据行
        for(var i=1; i<dataInit.length; i++) {
            trs[i] = document.createElement('tr');
            trs[i].className = 'stu';
            for(var j=0; j<colNum; j++) {
                var td = document.createElement('td');
                td.innerHTML = dataInit[i][j];
                trs[i].appendChild(td);
            }
            table_1.appendChild(trs[i]);
        }
    }
    else {
        alert('#warning：创建的表格行列数和数据量不匹配！');
    }
}

/**
 * 分割输入的表格数据
 * @param dataOrignal   原始数据
 * @param dataTR        一行数据
 * @param dataTD        数据项数组
 */
function dataSplit() {
    var dataOrignal = dataText.value.trim();
    var dataTR = dataOrignal.split('\n');
    for(var i=0; i<dataTR.length; i++) {
        var dataTD = dataTR[i].split(/,|\，/);
        dataInit.push(dataTD);
    }
}



//================ EVENT BIND ======================//
table_1.addEventListener('click', function (event) {
    var e = event || window.event;
    var target = e.target;
    var classNameList = target.classList;
    var thIdName = ['name', 'English', 'Math','Chinese', 'score'];
    var trObj = document.querySelectorAll(".stu");
    var tr = Array.prototype.slice.call(trObj,0); //从0位置开始截取,将具有length属性的对象转成数组

    for(var clickIndex =0, clickLength=thIdName.length; clickIndex<clickLength; clickIndex++){
        if(classNameList.contains(thIdName[clickIndex])){
            sortClick(clickIndex);
            break;
        }
    }
    for(var j=0; j<tr.length; j++){
        table_1.appendChild(tr[j]);
    }


    function sortClick(index){
        if( classNameList.contains("downButt") ){
            tr.sort(function(ele1,ele2){
                var grade1 = ele1.getElementsByTagName("td")[index].textContent;
                var grade2 = ele2.getElementsByTagName("td")[index].textContent;
                return grade1 - grade2;});
        } else {
            tr.sort(function(ele1,ele2){
                var grade1 = ele1.getElementsByTagName("td")[index].textContent;
                var grade2 = ele2.getElementsByTagName("td")[index].textContent;
                return grade2 - grade1;});
        }
    }
});
btnClear.addEventListener('click', function () {
    rowNum = MINROW;
    colNum = MINCOL;
    dataText.value = '';
});
btnCreate.addEventListener('click', function () {
    dataSplit();
    createTable();
});

