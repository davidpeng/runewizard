function Timer() {
    this.elapseTimeMillis = 0;
}

Timer.prototype.start = function (delay) {
    this.elapseTimeMillis = Date.now() + delay;
};

Timer.prototype.elapsed = function () {
    return this.elapseTimeMillis < Date.now();
};

Timer.prototype.extend = function (delay) {
    if (this.elapseTimeMillis < Date.now()) {
        this.elapseTimeMillis = Date.now() + delay;
    } else {
        this.elapseTimeMillis += delay;
    }
};

Timer.prototype.millisUntilElapse = function () {
    return this.elapseTimeMillis - Date.now();
};