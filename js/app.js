// This superclass represents all the entities in the game
var Entity = function(sprite , x , y , row ){
    this.sprite = sprite;   // the string of the sprite
    this.x = x;             // This is the x position where the sprite will be drawn
    this.y = y;             // This is the y position where the sprite will be drawn
    this.row = row;         // This is the current row of the entitie
}

// This function renders the entity
Entity.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Enemies our player must avoid
var Enemy = function( row , v ) {
    // The image/sprite for our enemies, this uses
    // a helper provided to easily load images
    Entity.call(this , 'images/enemy-bug.png' , -100 , row*83 -25 , row );;
    this.vx = v;            // This is the current velocity
    this.row = row;         
}

// Enemy delegates to Entity
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// updates the position of the enemy
Enemy.prototype.update = function(dt){
    this.x += this.vx * dt;                                         // Move the enemy
    if( this.x > numCols * 101 ) return false; else return true;    // Check if it's out of bounds
}




// Player class
var Player = function(){
    // Randomizes the sprite used
    var sprites = [ 'images/char-boy.png' , 'images/char-cat-girl.png' , 'images/char-horn-girl.png' , 'images/char-pink-girl.png' , 'images/char-princess-girl.png' ];
    Entity.call( this , sprites[Math.floor(Math.random()*sprites.length )] , 202 , (numRows-2)*83+60 , numRows - 1);
    this.col = 3;
}

// Player delegates to Entity
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

// This function is used when the user press a button
Player.prototype.handleInput = function( s ){
    switch(s){
        case 'left':    if( this.col > 1  ){ this.x -= 101; this.col--; } break;
        case 'right':   if( this.col < numCols ){ this.x += 101; this.col++; } break;
        case 'up':      if( this.row > 0  ){ this.y -= 83;  this.row--; } break;
        case 'down':    if( this.row < numRows - 1){ this.y += 83;  this.row++; } break;
    }
}