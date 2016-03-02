/**
 * Created by Doma on 15/12/27.
 */
function Renderer() {
    this.ball = document.querySelector(".ball");
    this.body = document.querySelector("body");
    this.scoreContainer = document.querySelector(".game-score");
    this.scoreMessage = document.getElementById("score");
    this.bestMessage = document.getElementById("best");
}

Renderer.prototype.render = function (gameData) {
    var self = this;
    requestAnimationFrame(function () {
        if (gameData.score == 0) {
            self.scoreContainer.style.fontSize = "35rem";
        } else if (gameData.score == 10) {
            self.scoreContainer.style.fontSize = "25rem";
        } else if (gameData.score == 100) {
            self.scoreContainer.style.fontSize = "15rem";
        }
        self.scoreContainer.textContent = gameData.score;
        self.renderBall(gameData.position);
    });
};

Renderer.prototype.renderBall = function (position) {
    this.ball.style.top = position.y + "px";
    this.ball.style.left = position.x + "px";
};

Renderer.prototype.showMessage = function (gameData) {
    this.scoreMessage.textContent = gameData.score;
    this.bestMessage.textContent = gameData.best;
    this.body.classList.add("gameover");
};

Renderer.prototype.clearMessage = function () {
    this.body.classList.remove("gameover");
};