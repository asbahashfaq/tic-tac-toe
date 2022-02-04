
var tacArray;//[[null,null,null],[null,null,null],[null,null,null]];

var board = document.querySelector('.board'); 
var players = [,];
var avatars = ['o','x'];
var images = ['images/oo1.svg','images/xx1.svg'];
var whoseTurn = Math.floor(Math.random()*2) //gives index of player who will play next;
var turns = 0;
var score = [0,0];
var result = document.querySelector(".result");
var playerDisplay = [document.querySelector(".player1"), document.querySelector(".player2")];
//playerDisplay.textContent = players[whoseTurn];
var chalkSound = [document.querySelector("#chalkOSound"), document.querySelector("#chalkXSound")] 
chalkSound[0].volume = 0.3;
chalkSound[1].volume = 0.3;

var gridSize = 4;

var computerX, computerY;

var manualSelector = document.querySelector("#diff").addEventListener('change',function(event){
    var size = Number(event.target.value);
    if ( size == -1){
        document.querySelector('.manual').classList.remove('hide');
        gridSize = 0;
    }
    else{
        document.querySelector('.manual').classList.add('hide');
        gridSize = size;
    }
}) 

var gameStartButton = document.querySelector("#start");
gameStartButton.addEventListener('click', function(event){
    if (gridSize == 0){
        gridSize = Number(document.querySelector(".manual input").value);
    }
    
    playerDisplay[whoseTurn].classList.add("turn");
    setBoard(event);

})
var rank;
function setBoard(e){
    if (e) e.preventDefault();

    players[0] = document.querySelector('.p1').value;
    players[1] = document.querySelector('.p2').value;


    board.style.gridTemplateColumns = '1fr '.repeat(gridSize)//"1fr "*gridSize;
    tacArray = new Array(gridSize);
    rank = new Array(gridSize);

    for ( var i = 0; i < gridSize; i++ ){
        tacArray[i] = new Array(gridSize);
        rank[i] = new Array(gridSize);
        for (var j = 0; j < gridSize; j++){
            rank[i][j]=0
            var box = document.createElement("span");
            box.setAttribute("x",i)
            box.setAttribute("y",j)
            //box.setAttribute("status","empty")
            board.appendChild(box);
            box.addEventListener('click',turn);
        }
    }
    if (players[0] == ""){players[0]= "Player 1"}
    if (players[1] == ""){players[1]= "Player 2"}
    playerDisplay[0].innerHTML = "<span class='name'>" + players[0] + "</span><span class='score'>" + score[0] + "</span>";
    playerDisplay[1].innerHTML = "<span class='score'>" + score[1] + "</span><span class='name'>" + players[1] + "</span>";

    document.querySelector(".welcomeScreen").classList.add("hide")
    document.querySelector(".gameScreen").classList.remove("hide")

    playerDisplay[whoseTurn].classList.add("turn");
    if (players[whoseTurn] == "Computer"){
        computerX = "";
        computerY = ""

        setTimeout(function() { computerSays()}, 700); 
        //console.log("Computer's turn, " + computerX + "," + computerY); 
    }
}

var X, Y;
var won = false;
function turn(event){
    if(event) event.preventDefault();
    //console.log(event.target.getAttribute("status"))

    if(players[whoseTurn] == "Computer")
    {
        X = computerX
        Y = computerY
    }
    else{
        X = Number(event.target.getAttribute("x"));
        Y = Number(event.target.getAttribute("y"));
    } 
    if (tacArray[X][Y] == null && won == false){
        turns = turns + 1;

        playerDisplay[whoseTurn].classList.remove("turn");

        //console.log("WHO " + whoseTurn);
        tacArray[X][Y] = avatars[whoseTurn]
        var entry = document.createElement("object");
        entry.setAttribute("type", "image/svg+xml")
        entry.setAttribute("data", images[whoseTurn])
        entry.setAttribute("class", "alive")
        document.querySelector(".board span[x='"+X+"'][y='"+Y+"'").appendChild(entry);
        //event.target.appendChild(entry);
        //event.target.textContent = avatars[whoseTurn];
        //playerDisplay.textContent = players[whoseTurn];
        //document.querySelector(".board span[x='"+X+"'][y='"+Y+"'").setAttribute("status", "full");

        if (turns > gridSize*2 - 2){
            var win = checkWin();
            if (win == 1){
                result.textContent = players[whoseTurn] + " wins! ";
                won = true;
                score[whoseTurn] ++;
                updateScore(event);  
                return;
                // wait then clear board and take away message
            }else if(win == 0 && turns == gridSize*gridSize){
                result.textContent = "It's a TIE";

                setTimeout(function() {clearBoard()}, 4000); 
                //clearBoard(event); 
                // wait then clear board and take away message 
            }


        }

        chalkSound[whoseTurn].currentTime = 0;
        chalkSound[whoseTurn].play();
        if (whoseTurn == 0){
            whoseTurn = 1;
        }else {
            whoseTurn = 0; 
        }
        //Highlight player turn

        playerDisplay[whoseTurn].classList.add("turn");
        
    }

    if (players[whoseTurn] == "Computer"){ 
        setTimeout(function() { computerSays()}, 700); 
    }

    //console.log(tacArray[X][Y])
    //console.log("Turn: " + turns + " x: " + X + " y: " + Y)

}

 
function checkWin(){
    console.log("Checking Win")
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
            if ( x + y == tacArray.length -1  && (tacArray[x][y] == avatars[whoseTurn]) ){
                sDEquals++
                if (sDEquals == tacArray.length){
                    return 1 //"SWin : " + avatars[whoseTurn] //WIN;
                }
            } 
            //console.log("avatar: " + avatars[whoseTurn]) 
            // console.log( "CHECK:  "+tacArray[x][y]+" "+avatars[whoseTurn]+" "+sDEquals);
        }
    }
    return 0 // "Fail";
}

 
function updateScore(){
    playerDisplay[0].querySelector(".score").textContent = score[0]
    playerDisplay[1].querySelector(".score").textContent = score[1]
    setTimeout(function() {clearBoard()}, 3000); 
}

function clearBoard(){ 
    result.textContent = " ";
    tacArray = new Array(gridSize);
    board.textContent = " ";
    turns = 0;
    won=false;
    setBoard();
}


var empties; 
var split;

 
function calculateRowRank(x){
    var rowrank, opponents = 0, self = 0;
    for (var i=0; i< gridSize; i++){
        if (tacArray[x][i] == avatars[1-whoseTurn]){
            opponents++; 
        }else if (tacArray[x][i] == avatars[whoseTurn]){
            self++;
        }
    }

    if (opponents > 0 && self > 0 ){rowrank = 0}//ignore  
    else if (self == 0 && opponents == 0 ){rowrank = 1} //low risk
    else if (opponents == 0 && self > 0 ){rowrank = self} //go for win
    else if (opponents > 0 && self == 0 ){rowrank = opponents}//dont let player win 
     
    return rowrank;
}
function calculateColRank(x){

    var colrank, opponents = 0, self = 0;
    for (var i=0; i< gridSize; i++){
        if (tacArray[i][x] == avatars[1-whoseTurn]){
            opponents++; 
        }else if (tacArray[i][x] == avatars[whoseTurn]){
            self++;
        }
    }

    if (opponents > 0 && self > 0 ){colrank = 0;   }//ignore  
    else if (self == 0 && opponents == 0 ){colrank = 1; } //low risk
    else if (opponents == 0 && self > 0 ){colrank = self; }//if (self == gridSize-1) colrank ++} //go for win
    else if (opponents > 0 && self == 0 ){colrank = opponents;}//if (opponents == gridSize-1) colrank ++}//dont let player win 
    
   
    return colrank;
}
function calculateDia1Rank(){

    var dia1rank, opponents = 0, self = 0;
    for (var i=0; i< gridSize; i++){
        for(j=0; j<gridSize; j++){
            if(i==j){
                if (tacArray[i][j] == avatars[1-whoseTurn]){
                    opponents++; 
                }else if (tacArray[i][j] == avatars[whoseTurn]){
                    self++;
                }
            }
        }
    }

    if (opponents > 0 && self > 0 ){dia1rank = 0;  }//ignore  
    else if (self == 0 && opponents == 0 ){dia1rank = 1;  } //low risk
    else if (opponents == 0 && self > 0 ){dia1rank = self} //go for win
    else if (opponents > 0 && self == 0 ){dia1rank = opponents; }//dont let player win 
    
   
    return dia1rank;
     
}
function calculateDia2Rank(){
    var dia2rank, opponents = 0, vacant = 0, self = 0;
    for (var i=0; i< gridSize; i++){
        for(j=0; j<gridSize; j++){
            if(i+j == gridSize){
                if (tacArray[i][j] == avatars[1-whoseTurn]){
                    opponents++; 
                }else if (tacArray[i][j] == avatars[whoseTurn]){
                    self++;
                }
            }
        }
    }

    if (opponents > 0 && self > 0 ){dia2rank = 0; }//ignore  
    else if (self == 0 && opponents == 0 ){dia2rank = 1; } //low risk
    else if (opponents == 0 && self > 0 ){dia2rank = self; } //go for win
    else if (opponents > 0 && self == 0 ){dia2rank = opponents; }//dont let player win 
   
    return dia2rank;
}

function computerSays(){
    console.log("Computer is thinking") 


    empties = new Array();  
    for (x = 0; x < gridSize; x++){ 
        for (y=0; y < gridSize; y++){ 
            if( tacArray[x][y] == null){ 
                if(empties.indexOf(x +" "+ y) < 0) empties.push(x +" "+ y) 
            }
             
        }
    }

var rowR=[],colR=[],dia1R=[],dia2R=[];
    for(var x = 0; x < gridSize; x ++){
        rowR.push(calculateRowRank(x))
        colR.push(calculateColRank(x))
        dia1R.push(calculateDia1Rank())
        dia2R.push(calculateDia2Rank()) 
        
    }
    var highestLocation = [0,0], highest = 0; 
    for(var x = 0; x < gridSize; x ++){
        for (var y = 0; y < gridSize; y ++){
            if (tacArray[x][y] == null){ 
                rank[x][y] = rowR[x] /*+" "*/ + colR[y]



                if(x == y) {rank[x][y] += dia1R[x]}
                if (x+y == gridSize){rank[x][y]+=dia2R[x] ;/*console.log("d2:"+dia2R)*/}

                if(rank[x][y] > highest){   //decision
                    highestLocation = [x,y]
                    highest = rank[x][y] 
                }
            }else rank[x][y] = 0
        } 
        
    } 
    if ( highest ==0 ) console.log ("Tie Predicted");
    computerX = highestLocation[0] 
    computerY = highestLocation[1] 
    if (turns == 0){
        split = empties[Math.floor(Math.random()*empties.length)].split(' ');
        computerX = split[0]
        computerY = split[1]  
        turn();
        console.log("turn = " + turns,computerX, computerY, highest);
    }else if (highest > 0){
        turn();
    } 
    else if ((empties.length > 0 )){
        split = empties[Math.floor(Math.random()*empties.length)].split(' ');
        computerX = split[0]
        computerY = split[1]  
        turn();
    } else console.log("Board is full")

    
}

document.querySelector(".bot1").addEventListener('click',function(e){
    e.preventDefault();
    document.querySelector(".p1").value = "Computer"
});
document.querySelector(".bot2").addEventListener('click',function(e){
    e.preventDefault();
    document.querySelector(".p2").value = "Computer"
});
