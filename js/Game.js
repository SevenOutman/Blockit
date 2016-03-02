/**
 * Created by Doma on 15/12/27.
 */
function Game() {
    this.onload = true;
    this.gameState = Game.States.Over;
    this.inputManager = new InputManager();
    this.renderer = new Renderer();

    this.ball = document.querySelector(".ball");

    this.blockbar = document.querySelector(".blockbar");

    this.played = 0;
    this.colors = ["green", "red", "steelblue", "coral", "darkslategrey"];

    this.best = 0;
    this.fps = 0;
    this.fpsContainer = document.querySelector(".fps");

    this.initConfig();
    this.initEvents();
    this.newGame();
}
Game.States = {
    Over: -1,
    Starting: 0,
    Playing: 1,
    Stopped: -10
};


Game.prototype.initConfig = function () {
    this.config = {};
    var radius = this.ball.offsetWidth / 2,
        rem = radius / 2;
    document.querySelector(".game-container").style.height = (document.querySelector(".container").clientHeight - 4 * rem) + "px";
    var playground = document.querySelector(".playground"),
        bounds = {top: rem, left: rem, right: rem + playground.clientWidth, bottom: rem + playground.clientHeight},
        position = {x: this.ball.offsetLeft + radius, y: this.ball.offsetTop + radius};
    this.config.rem = rem;
    this.config.ballRadius = radius;
    this.config.bounds = bounds;
    this.config.speedLimit = 3;
    this.config.initialPosition = position;
    this.config.accRate = 1.1;
    this.config.freezeFrames = 5;
    this.config.initialVelocity = 10;

};

Game.prototype.initEvents = function () {
    var self = this;
    this.inputManager.on("block", function () {
        if (self.gameState == Game.States.Playing) {
            if (self.gameData.blocking == false && self.gameData.frozen >= self.config.freezeFrames) {
                self.gameData.blocking = true;
                self.blockbar.classList.add("blocking");
            }
        } else if (self.gameState == Game.States.Starting) {
            self.start();
        }
    });
    this.inputManager.on("restart", this.newGame.bind(this));

    this.blockbar.addEventListener("webkitAnimationEnd", function () {
        self.gameData.blocking = false;
        self.gameData.frozen = 0;
        self.blockbar.classList.remove("blocking");
    });
    setInterval(function () {
        self.fpsContainer.textContent = "FPS: " + self.fps;
        self.fps = 0;
    }, 1000);
};


Game.prototype.newGame = function () {
    document.querySelector("body").style.backgroundColor = this.colors[this.played++ % this.colors.length];
    this.resetGameData();
    this.renderer.render(this.gameData);
    this.gameState = Game.States.Starting;
    this.renderer.clearMessage();
};

Game.prototype.resetGameData = function () {
    var dir = Math.random() * Math.PI / 2 + Math.PI / 4;
    this.gameData = {
        position: {
            x: this.config.initialPosition.x,
            y: this.config.initialPosition.y
        },
        score: 0,
        speed: {
            x: this.config.initialVelocity * Math.cos(dir),
            y: -this.config.initialVelocity * Math.sin(dir)
        },
        speedUp: 1,
        frozen: 0,
        blocking: false
    };
};

Game.prototype.start = function () {
    if (this.gameState == Game.States.Starting) {
        this.gameState = Game.States.Playing;
        requestAnimationFrame(this.nextFrame.bind(this));
        if (this.onload) {
            document.body.classList.remove("onload");
            this.onload = false;
        }
    }
};
Game.prototype.nextFrame = function () {
    var position = this.gameData.position,
        radius = this.config.ballRadius,
        bounds = this.config.bounds,
        speed = this.gameData.speed,
        rem = this.config.rem;

    if (position.x + radius >= bounds.right || position.x - radius <= bounds.left) {
        speed.x = -speed.x;
    }
    if (position.y - radius <= bounds.top) {
        speed.y = -speed.y;
    }

    if (position.y + radius >= bounds.bottom) {
        if (this.gameData.blocking && position.y <= bounds.bottom + rem) {
            speed.y = -speed.y;
            if (this.gameData.speedUp < this.config.speedLimit) {
                this.gameData.speedUp *= 1.1;
                speed.x *= 1.1;
                speed.y *= 1.1;
            }
            this.blocking = false;
            this.gameData.score++;
        } else {
            this.gameover();
        }
    }
    position.x += speed.x;
    position.y += speed.y;
    this.renderer.render(this.gameData);
    this.gameData.frozen++;
    this.fps++;

    if (position.y - radius > window.innerHeight - rem) {
        return;
    }
    requestAnimationFrame(this.nextFrame.bind(this));
};

Game.prototype.gameover = function () {
    this.gameState = Game.States.Over;
    if (this.gameData.score > this.best) {
        this.best = this.gameData.score;
    }
    this.gameData.best = this.best;
    this.renderer.showMessage(this.gameData);
};