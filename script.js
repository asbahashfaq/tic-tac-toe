
var tacArray = [];//[[null,null,null],[null,null,null],[null,null,null]];

var board = document.querySelector('.board'); 
var players = ['asbah', 'pinnochio'];
var avatars = ['o','x']; 
var whoseTurn = Math.floor(Math.random()*2) //gives index of player who will play next;
var turns = 0;
var score = [0,0];

var playerDisplay = document.querySelector(".yourTurn");
playerDisplay.textContent = players[whoseTurn];

var gridSize = 4;
board.style.gridTemplateColumns = '1fr '.repeat(gridSize)//"1fr "*gridSize;
tacArray = new Array(gridSize);

for ( var i = 0; i < gridSize; i++ ){
    tacArray[i] = new Array(gridSize);
    for (var j = 0; j < gridSize; j++){
        var box = document.createElement("span");
        box.setAttribute("x",i)
        box.setAttribute("y",j)
        box.setAttribute("status","empty")
        board.appendChild(box);
        box.addEventListener('click',turn);
    }
}


var X, Y;
function turn(event){
    event.preventDefault();
    //console.log(event.target.getAttribute("status"))
    if (event.target.getAttribute("status") == "empty"){
        X = Number(event.target.getAttribute("x"));
        Y = Number(event.target.getAttribute("y"));
        turns = turns + 1;

        console.log("WHO " + whoseTurn);
        tacArray[X][Y] = avatars[whoseTurn] 
        event.target.textContent = avatars[whoseTurn];
        playerDisplay.textContent = players[whoseTurn];
        event.target.setAttribute("status", "full");

        if (turns > 4){
            if (checkWin() == 1){
                console.log("Player " + whoseTurn + " wins\nCongratulations " + players[whoseTurn]);
                score[whoseTurn] ++;

            }

        }
        
        if (whoseTurn == 0){
            whoseTurn = 1;
        }else {
            whoseTurn = 0; 
        }
        playerDisplay.textContent = players[whoseTurn];
    }
 

}


var unequal = 0;
var unequalVal = null;
function checkWin(){
    console.log("CHECKING IF ANYONE WON")
    var pDEquals = 0, sDEquals = 0;
    for (x = 0; x < gridSize; x++){
        var equalRow = 0, equalCol = 0; 
        for (y=0; y < gridSize; y++){
            //rowCheck
            if( tacArray[x][y] == avatars[whoseTurn] ){
                equalRow++
                if (equalRow == tacArray[x].length){
                    return 1 //"RWin " + avatars[whoseTurn] //WIN;
                }
            } 

            //colCheck
            if( tacArray[y][x] == avatars[whoseTurn] ){
                equalCol++
                if (equalCol == tacArray.length){
                    return 1 //"CWin : " + avatars[whoseTurn] //WIN;
                }
            } 

            //primaryDiagonalCheck
            //x+y = tacArray.length
            if ( (x == y) && tacArray[y][x] == avatars[whoseTurn] ){
                pDEquals++
                if (pDEquals == tacArray.length){
                    return 1 //"PWin : " + avatars[whoseTurn] //WIN;
                }
            }

            //secondaryDiagonalCheck
            //x==y = tacArray.length
            if ( x + y == tacArray.length -1  && (tacArray[y][x] == avatars[whoseTurn]) ){
                sDEquals++
                if (sDEquals == tacArray.length){
                    return 1 //"SWin : " + avatars[whoseTurn] //WIN;
                }
            } 
           // console.log( "CHECK:  "+tacArray[x][y]+" "+avatars[whoseTurn]+" "+sDEquals);
            
        }
    }
    return 0 // "win scenario not found";
}
