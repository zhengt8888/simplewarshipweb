var view = {
    displayMessage: function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class","hit");
    },
    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class","miss");
    }
};


/* view.displayMessage("just a test");
view.displayHit("00"); */




var model = {
    boardsize:7,
    numShips:3,
    shipLength:3,
    shipSunk:0,

    ships:[
        {
            locations:["00","00","00"],hits:["","",""]
        },
        {
            locations:["00","00","00"],hits:["","",""]
        },
        {
            locations:["00","00","00"],hits:["","",""]
        }
    ],
    generationShipLocations: function(){
        var locations;
        for(var i = 0;i<this.numShips;i++){
            do{
                locations = this.generateShip();
            }while(this.collision(location));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function(){
        var direction = Math.floor(Math.random() * 2)   //生成0或1随机
        var row,col;
        if(direction === 1){                            //1为水平方向
            row = Math.floor(Math.random()*this.boardsize);
            col = Math.floor(Math.random()*(this.boardsize-this.shipLength) );
        }else{
            row = Math.floor(Math.random()*(this.boardsize-this.shipLength));
            col = Math.floor(Math.random()*this.boardsize);
        }
        var newShipLocations =[];
        for(var i=0;i<this.shipLength;i++){
            if(direction === 1){
                newShipLocations.push(row + ""+(col+i));    //用""来让+表示拼接
            }else{
                newShipLocations.push((row+i) + ""+col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations){
        for(var i = 0;i<this.numShips;i++){
            var ship = model.ships[i];
            for(var j=0;j<locations.length;j++){
                if(ship.locations.indexOf(locations[j])>=0){
                    return true;
                }
            }
        }
    },

    fire: function(guess){
        for(var i=0; i<this.numShips ; i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if(index>=0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("Hit!!!!");
                if(this.isSunk(ship)){
                    view.displayMessage("you sank a ship");
                    this.shipSunk++;
                }
                return true;
            }
            view.displayMiss(guess);
            view.displayMessage("MISS!!!!");
        }
        return false;
    },

    isSunk: function(ship){
        for(var i=0;i<this.shipLength;i++)
            if(ship.hits[i] !=="hit"){
                return false;
            }
            return true;
    }
};

/* model.fire("06");
model.fire("16");
model.fire("26");
console.log(model.shipSunk); */


function parseGuess(guess){
    var alphabat = ["A","B","C","D","E","F","G"];
            
    if(guess === null||guess.length !==2){
        alert("please input a position");
    }else{
        firstChar = guess.charAt(0);
        var row = alphabat.indexOf(firstChar);      
        var column = guess.charAt(1)
        if(isNaN(row)||isNaN(column)){
            alert("it's not on the board")
        }else if(row < 0 || row >= model.boardsize || column < 0 || column >= model.boardsize){
            alert("that's off the board");
        }else{
            return row + column;
        }
    }
    return null;
};

/* console.log(parseGuess("B2")); */



var controller = {
    guesses:0,

    processGuess: function(guess){
       var location = parseGuess(guess);
       if(location){
           this.guesses++;
           var hit = model.fire(location);
           if(hit && model.shipSunk === model.numShips){
               view.displayMessage("you sank all the ships,in " + this.guesses+ " guesses");
           }
       }
    }
};

/* controller.processGuess("A0");
controller.processGuess("B6");
controller.processGuess("C0"); */

function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generationShipLocations();
}

function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";                       //读完数后要清零，便于下次输入        
}

function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13){                        //回车键的keyCode是13
        fireButton.click();
        return false;
    }
}
window.onload = init;