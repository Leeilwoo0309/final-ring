var Bullet = /** @class */ (function () {
    function Bullet() {
        this.degree = 0;
        this.pos = { x: 0, y: 0 };
        this.speed = 15;
        this.isArrive = true;
        this.isSent = false;
        this.isColid = false;
        this.damage = damageInit;
    }
    Bullet.prototype.setDegree = function (degree) {
        this.degree = degree;
        return this;
    };
    Bullet.prototype.setDamage = function (damage) {
        this.damage = damage;
        return this;
    };
    Bullet.prototype.setSpeed = function (spd) {
        this.speed = spd;
        return this;
    };
    Bullet.prototype.setPos = function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
        return this;
    };
    Bullet.prototype.build = function (type) {
        var _this = this;
        if (type === void 0) { type = 'player'; }
        var _main = document.querySelector('main');
        var _bullet = document.createElement('div');
        _bullet.className = "".concat(type, " bullet");
        if (type == "player") {
            _bullet.style.top = "".concat(Number(player.style.top.replace('px', '')) + 10, "px");
            _bullet.style.left = "".concat(Number(player.style.left.replace('px', '')) + 10, "px");
        }
        else if (type == "enemy") {
            _bullet.style.top = "".concat(Number(enemy.style.top.replace('px', '')) + 10, "px");
            _bullet.style.left = "".concat(Number(enemy.style.left.replace('px', '')) + 10, "px");
        }
        _main.appendChild(_bullet);
        var interval = setInterval(function () {
            var bulletX = parseFloat(_bullet.style.left);
            var bulletY = parseFloat(_bullet.style.top);
            var newX = bulletX - _this.speed * Math.cos(_this.degree);
            var newY = bulletY - _this.speed * Math.sin(_this.degree);
            _bullet.style.left = "".concat(newX, "px");
            _bullet.style.top = "".concat(newY, "px");
            _this.pos.x = newX;
            _this.pos.y = newY;
            if (type == "enemy") {
                if (Math.abs(_this.pos.x - position.p.x - 12) <= 27 && Math.abs(_this.pos.y - position.p.y - 12) <= 27 && !_this.isColid) {
                    hp.p -= _this.damage;
                    _this.isColid = true;
                }
            }
            // 화면 밖으로 나가면 탄환 제거
            if (newX < 0 || newX > _main.clientWidth || newY < 0 || newY > _main.clientHeight) {
                clearInterval(interval);
                _this.isArrive = false;
                _main.removeChild(_bullet);
            }
        }, 16);
        // clearInterval(interval);
        return this;
    };
    return Bullet;
}());
