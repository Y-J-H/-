var game={
    RN:4,
    CN:4,
    score:0,
    data:[],

    //开始游戏
    start:function(){
        //第一步：先创建一个空的二维数组，用于存储数据
        for(row=0;row<this.RN;row++){
            this.data[row]=[];
            for(var col=0;col<this.CN;col++){
                this.data[row][col]=0;
            }
        }
        // console.log(this.data);
        this.score=0;   //在每次开始前将score清零
        this.randomNum();
        this.randomNum();
        console.log(this.data);
        this.fillContain();
    },
    //产生2或4
    randomNum:function(){
        while(true){
            var r=parseInt(Math.random()*4);   //随机产生行号和列号
            var c=parseInt(Math.random()*4);
            if(this.data[r][c]==0){
                this.data[r][c]=Math.random()<0.5?2:4;
                break;
            }
        }
    },
    //将二维数组添加到相应的div中去,并添加上相应的分数
    fillContain:function(){
        for(var row=0;row<this.RN;row++){
            for(var col=0;col<this.CN;col++){
                if(this.data[row][col]!=0){  //如果当前的数组值不为0这把相应的样式添加到div上
                    document.getElementById('item'+row+col).innerHTML=this.data[row][col];
                    document.getElementById('item'+row+col).className="item";
                    document.getElementById('item'+row+col).className+=(" n"+this.data[row][col]);
                }else{
                    document.getElementById('item'+row+col).innerHTML=" ";  //清空内容为0的div
                    document.getElementById('item'+row+col).className="item";
                }
            }
        }
        document.getElementById("score").innerHTML=this.score;
        document.getElementById("grade").innerHTML=this.score;
    },
    //左移操作
    moveLeft:function(){
        var before=this.data.toString();
        for(var row=0;row<this.RN;row++){
            for(var col=0;col<this.CN;col++){   //便利每一行的每一个元素，若在该元素以后的所有元素均为0，则直接进行下一行的判断，否则将这个元素与后一个元素相比较，如果相同则将这两个数字相加，如果不同，且当前元素不为0，则什么也不干，如果当前元素为0,则将后一个元素值赋值给当前元素，然后将后一个元素变为0
                var nextValue=this.getMoveLeft(row,col);  //传入当前的元素
                //console.log(this.data[row][nextValue]);  //注意这里的判断次数
                if(nextValue==-1){   //表示在当前元素以后的元素全部都是0,那么跳过这次循环
                    break;
                }else{
                    if(this.data[row][col]==this.data[row][nextValue]){
                        this.data[row][col]*=2;
                        this.data[row][nextValue]=0;
                        this.score+=this.data[row][col];
                    }else if(this.data[row][col]==0){
                        this.data[row][col]=this.data[row][nextValue];
                        this.data[row][nextValue]=0;
                        col--;   //当有一个元素被提前了，那么这里应该将列号减一，即再次从此列开始判断，否则会出现 0，2，2，0 左移时无法合并的问题
                    }
                }
            }
        }
        var after=this.data.toString();
        if(before!=after){   //如果前后两次的二维数组data没有发生变化的话,那么可能是游戏者误按了按键，此时应该不应该产生一个数字,所以只有在before和after不同时才产生数字
            this.randomNum();
            this.fillContain();
            if(this.isOver()){
                document.getElementById("cover").style.display="block";
            }
        }
    },
    getMoveLeft:function(nowRow,nowCol){
        for(var col=nowCol+1;col<this.CN;col++){
            if(this.data[nowRow][col]!=0){
                return col;   //返回列的值
            }
        }
        return -1;
    },

    /*右移操作*/
    moveRight:function(){
        var before=this.data.toString();
        for(var row=0;row<this.RN;row++){
            for(var col=this.CN-1;col>=0;col--) {
                var beforeValue=this.getMoveRight(row,col);
                if(beforeValue==-1){
                    break;
                }
                else{
                    if(this.data[row][col]==0){
                        this.data[row][col]=this.data[row][beforeValue];
                        this.data[row][beforeValue]=0;
                        col++;
                    }else if(this.data[row][col]==this.data[row][beforeValue]){
                        this.data[row][col]*=2;
                        this.data[row][beforeValue]=0;
                        this.score+=this.data[row][col];
                    }
                }
            }
        }
        var after=this.data.toString();
        if(before!=after){
            this.randomNum();
            this.fillContain();
            if(this.isOver()){
                document.getElementById("cover").style.display="block";
            }
        }
    },
    getMoveRight:function(nowRow, nowCol){
        for(var col=nowCol-1;col>=0;col--){
            if(this.data[nowRow][col]!=0){
                return col;
            }
        }
        return -1;
    },

    /*上移操作*/
    moveTop:function(){
        var before=this.data.toString();
        // console.log(this.data[0][0]);
        for(var col=0;col<this.CN;col++){
            for( var row=0;row<this.RN;row++){
                var topAfterValue=this.getMoveTop(col,row);   //返回的是行数或者-1
                // console.log(topAfterValue);
                if(topAfterValue==-1){
                    break;
                }
                else{
                    // console.log(this.data[topAfterValue][col]);
                    if(this.data[row][col]==0){
                        this.data[row][col]=this.data[topAfterValue][col];
                        this.data[topAfterValue][col]=0;
                        row--;
                    }else if(this.data[row][col]==this.data[topAfterValue][col]){
                        this.data[row][col]*=2;
                        this.data[topAfterValue][col]=0;
                        this.score+=this.data[row][col];
                    }
                }
            }
        }
        var after=this.data.toString();
        if(before!=after){
            this.randomNum();
            this.fillContain();
            if(this.isOver()){
                document.getElementById("cover").style.display="block";
            }
        }
    },
    getMoveTop:function(newCol,newRow){
        for(var row=newRow+1;row<this.RN;row++){
            if(this.data[row][newCol]!=0){
                return row;
            }
        }
        return -1;
    },

    /*下移操作*/
    moveBottom:function(){
        var before=this.data.toString();
        for(var col=0; col<this.CN;col++){
            for(var row=this.RN-1;row>=0;row--){
                var bottomBeforeValue=this.getMoveBottom(col,row);   //从后面向前面查找，若查找到某个元素的值不为0,那么则返回这个数的行号
                if(bottomBeforeValue==-1){
                    break;
                }else{
                    if(this.data[row][col]==0){
                        this.data[row][col]=this.data[bottomBeforeValue][col];
                        this.data[bottomBeforeValue][col]=0;
                        row++;
                    }else if(this.data[row][col]==this.data[bottomBeforeValue][col]){
                        this.data[row][col]*=2;
                        this.data[bottomBeforeValue][col]=0;
                        this.score+=this.data[row][col];
                    }
                }
            }
        }
        var after=this.data.toString();
        if(before!=after){
            this.randomNum();
            this.fillContain();
            if(this.isOver()){
                document.getElementById("cover").style.display="block";
            }
        }
    },
    getMoveBottom:function(newcol,newrow){
        for(var row=newrow-1;row>=0;row--){
            if(this.data[row][newcol]!==0){
                return row;
            }
        }
        return -1;
    },
    isFull:function(){
        //判断元素是否已经填满
        for(var row=0;row<this.RN;row++){
            for(var col=0;col<this.CN;col++){
                if(this.data[row][col]==0){   //若其中一个为0，说明当前容器未满
                    return false;
                }
            }
        }
        return true;
    },
    isOver:function(){
        //将每一个元素和他的右边和下边的元素进行比较，若都不相同，则判断游戏结束,
        if(this.isFull()){
            for(var row=0;row<this.RN;row++){
                for(var col=0;col<this.CN;col++){
                    if(row+1<4){
                        if(this.data[row][col]==this.data[row+1][col]){  //将每一个元素和他垂直方向上的下一个元素进行比较,只要有其中一个相同那么说明游戏未结束，返回false
                            return false;
                        }
                    }else if(col+1<4){
                        if(this.data[row][col]==this.data[row][col+1]){  //将每一个元素和它水平方向上的右一个元素进行比较,只要有其中一个相同那么说明游戏未结束，返回false
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    }
}
window.onload=function(){    //document.getElementById()只有当页面加载完成以后再执行才会有效
    game.start();
    var restart=document.getElementById("restart");
    var score=document.getElementById("score");
    document.onkeyup=function(e){
        console.log(e.keyCode);
        if(e.keyCode==37){
            game.moveLeft();
        }else if(e.keyCode==39){
            game.moveRight();
        }else if(e.keyCode==38){
            game.moveTop();
        }else if(e.keyCode==40){
            game.moveBottom();
        }
    }
    restart.onclick=function(){
        this.parentNode.style.display="none";
        score.innerHTML=0;
        game.start();
    }
}
