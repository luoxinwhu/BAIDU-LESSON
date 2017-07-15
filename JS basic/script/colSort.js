/**
 * Created by LX on 2017/7/14.
 */


var btnCreate = document.getElementById('btnCreate'),
    btnClear = document.getElementById('btnClear'),
    btnInput = document.getElementById('btnInput'),
    rowNum = document.getElementById('rowIn').value,
    colNum = document.getElementById('colIn').value,
    dataText = document.getElementById('dataText'),
    table1 = document.getElementById('autoTable'),
    tr = document.getElementsByTagName('tr');

var MINROW = 3,
    MINCOL = 5;

var dataInit = [
    ['name', 'English', 'Math','Chinese', 'score'],
    ['Diana', 90, 80, 90, 260],
    ['Mike', 80, 60, 90, 230]
];

function createTable() {
    var tr = [];

    if(rowNum<MINROW || colNum<MINCOL) {
        alert('#warning：表格行列数太少！')
    }
    else {
        for(var i=0; i<rowNum; i++) {
            tr[i] = document.createElement('tr');
            if(i>=1) {
                tr[i].className = 'tbody';
            }
            table1.appendChild(tr[i]);

            var td = [];
            for(var j=0; j<colNum; j++) {
                td[j] = document.createElement('td');
                td[j].innerHTML = dataInit[i][j];
                tr[i].appendChild(td[j]);
            }
        }

        //给表头增加样式
        tr[0].className = 'thead';
        //给表头增加排序图标
        for(var j=1; j<colNum; j++) {
            tr[0].childNodes[j].innerHTML += '<img src="images/sort.png" id="iconSort" width="15px" height="15px" style="margin-left: 5px; cursor: pointer">';
        }
        //绑定排序函数
        var iconSort = document.getElementById('iconSort');
        iconSort.addEventListener('click', function (event) {
            sortTable(table1, 1, 'int');
        });
    }
}

function dataSplit() {
    var dataOrignal = dataText.value.trim();
    var dataTR = dataOrignal.split('\n');
    console.log(dataTR);
    console.log(dataTD);

    for(var i=0; i<dataTR.length; i++) {
        var dataTD = dataTR[i].split(/,|\，/);
        for(var j=0; j<dataTD.length; j++) {
            tr[i].childNodes[j].innerHTML = dataTD[j];
        }
    }
}

/**
 * 表格列排序
 * @param tableId   表格ID
 * @param iCol      第几列
 * @param dataType  数据类型
 */
function sortTable(tableId, iCol, dataType) {
    var table = tableId,
        colRows = table.rows,
        aTrs = [];

    //将得到的列放入数组,aTrs[0]存放的是第1行的数据
    for(var i=0; i<colRows.length; i++) {
        aTrs[i] = colRows[i+1];
    }

    //判断上次排序的列和现在需要排序的是否是同一个
    if(table.sortCol === iCol) {
        aTrs.reverse();
    }
    else{
        aTrs.sort(sortFn(iCol, dataType));
    }

    //创建新的table存放排序后的结果
    var oFragment = document.createDocumentFragment(); //创建了一虚拟的节点对象
    for(var i=0; i<aTrs.length; i++) {
        oFragment.innerHTML += aTrs[i];
    }
    table.appendChild(oFragment);
    table.sortCol = iCol;   //记录最后一次排序的列索引
}

/**
 * 排序函数
 * @param iCol
 * @param dataType
 */
function sortFn(iCol, dataType) {

    return function (oTR1, oTR2) {
       /* var data1 = dataConvert(oTR1.cells[iCol], dataType);
        console.log(oTR1.cells[iCol]);
        var data2 = dataConvert(oTR2.cells[iCol], dataType);*/

       var data1 = oTR1.cells[iCol];
       var data2 =oTR2.cells[iCol];

        if(data1 < data2) {
            return -1;
        }
        else if(data1 > data2) {
            return 1;
        }
        else
            return 0;
    };
}

/*function dataConvert(data, dataType) {
    switch (dataType) {
        case 'int':
            return parseInt(data);
            break;
        case 'float':
            return parseFloat(data);
            break;
        case 'date':
            return new Date(Date.parse(data)); //解析一个日期时间字符串,并返回 1970/1/1 午夜距离该日期时间的毫秒数。
        default:
            return data.toString();
            break;
    }
}*/

//================ EVENT BIND ======================//

btnClear.addEventListener('click', function () {
    rowNum = 3;
    colNum = 5;
    dataText.value = '';
    /*var td = document.getElementsByTagName('td');
    td.innerHTML = '';*/
});
btnCreate.addEventListener('click', function () {
    createTable(dataInit);
});
btnInput.addEventListener('click', function () {
    dataSplit();
});




