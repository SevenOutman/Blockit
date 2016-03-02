/**
 * Created by Doma on 15/12/27.
 */
function InputManager() {
    this.events = {};
    if (window.navigator.msPointerEnabled) {
        //Internet Explorer 10 style
        this.eventTouchstart = "MSPointerDown";
        this.eventTouchmove = "MSPointerMove";
        this.eventTouchend = "MSPointerUp";
    } else {
        this.eventTouchstart = "touchstart";
        this.eventTouchmove = "touchmove";
        this.eventTouchend = "touchend";
    }
    this.listen();
}

InputManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

InputManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            setTimeout(function() {
                callback(data);
            }, 0);
        });
    }
};

InputManager.prototype.listen = function () {
    var self = this;
    var playground = document.querySelector(".playground"),
        restart = document.querySelector(".btn-restart");
    document.addEventListener("click", function (e) {
        e.preventDefault();
        self.emit("block");
    }, false);
    document.addEventListener(this.eventTouchstart, function (e) {
        e.preventDefault();
        self.emit("block");
    }, false);

    restart.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.emit("restart")
    }, false);
    restart.addEventListener(this.eventTouchstart, function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.emit("restart")
    }, false);
};