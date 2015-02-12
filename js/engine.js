/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

 // First we set the number of column and rows variables to be used by every js file
var numRows = 6, numCols = 5;
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    // Declare the allEnemies (an array for all the enemies) and player variables
    var allEnemies, player;

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    // the variables winner and loser represent whether the player have won or lost
    var winner = loser = false;

    // This function is called when the player loses
    // It renders a You Lose Screen
    function ilose(){
        render();
        loser = true;
        ctx.textAlign = "center";
        ctx.font = "50px sans-serif";
        ctx.fillText( "YOU LOSE" , canvas.width/2 , canvas.height/2 );
    }

    // This function is called when the player wins
    // It renders a You Win screen
    function iwin(){
        render();
        winner = true;
        ctx.textAlign = "center";
        ctx.font = "50px sans-serif";
        ctx.fillText( "YOU WIN" , canvas.width/2 , canvas.height/2 );
    }    

    //This function updates the position of the vehicles and check collisions
    function update(dt) {
        if( player.row == 0 ){
            iwin();
        }else{
            updateEntities(dt);
            checkCollisions();
        }
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy , i) {
            if( !enemy.update(dt) ){ 
                allEnemies[i] = new Enemy( Math.floor( Math.random() * (numRows - 3) + 1 ) , Math.floor( Math.random() * 100 + 100 ));
            } 
        });
    }

    function checkCollisions(){
        allEnemies.forEach( function( enemy ){
            if( enemy.row == player.row && ((enemy.x > player.x+25 && enemy.x < player.x+76)||(enemy.x+101 > player.x+25 && enemy.x+101 < player.x+76) ) ){
                ilose();
            }
        })
    }

    // This function draws the Entities in the game
    function render() {
        if( !winner && !loser ){
            var rowImages = [                       // Creates an array to store the images of each row
                    'images/water-block.png'        // The top is water
                ];
            for( var i = rowImages.length ; i < numRows - 2 ; i++ ) rowImages[i] = 'images/stone-block.png';    // Then we add the stone rows
            rowImages.push('images/grass-block.png');   // And then two grass rows
            rowImages.push('images/grass-block.png');
            var row, col;

            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }

            renderEntities();
        }
    }

    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }     

    // This function is called to restart the game
    function reset() {
        // Generates new numRows and numCols values
        numRows = Math.floor( Math.random() * 3 ) + 5;
        numCols = Math.floor( Math.random() * 5 ) + 5;
        // Resizes the canvas
        canvas.height = numRows*101;
        canvas.width = numCols * 101;

        // Reset the enemies and player
        allEnemies = [];
        for( var i = 0 ; i <= numCols ; i++ ) allEnemies.push( new Enemy( Math.floor( Math.random() * (numRows - 3) + 1 ) , Math.floor( Math.random() * 100 + 50 )));
        player = new Player();
    }

    
    document.addEventListener('keyup', function(e) {
        if( winner || loser ){
            winner = false;
            loser = false;
            reset();
        }else{
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };

            player.handleInput(allowedKeys[e.keyCode]);
        }
    });

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png' , 
        'images/char-horn-girl.png' , 
        'images/char-pink-girl.png' , 
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
