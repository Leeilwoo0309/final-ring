var Bullet = /** @class */ (function () {
    function Bullet() {
        this.degree = 0;
        this.pos = { x: 0, y: 0 };
        this.speed = 15;
        this._movedDistance = 0;
        this.isArrive = true;
        this.isSent = false;
        this.isColid = false;
        this.damage = damageInit;
        this.reach = -1;
        this.random = 0;
        this.dmgToHeal = false;
    }
    Bullet.prototype.setDegree = function (degree) {
        this.degree = degree;
        return this;
    };
    Bullet.prototype.setDamage = function (damage, random) {
        this.damage = damage;
        if (random) {
            this.random = random;
        }
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
    Bullet.prototype.setReach = function (time) {
        this.reach = time;
        return this;
    };
    Bullet.prototype.setExtra = function (extra) {
        this.dmgToHeal = extra.dmgToHeal;
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
        if (this.damage == 0) {
            _bullet.style.opacity = "20%";
            _bullet.style.backgroundColor = "black";
        }
        _main.appendChild(_bullet);
        // if (this.time != -1) {
        //     setTimeout(() => {
        //         if (this.isArrive) {
        //             clearInterval(interval);
        //             this.isArrive = false;
        //             _main.removeChild(_bullet);
        //         }
        //     }, this.time * 1000)
        // }
        var interval = setInterval(function () {
            _this._movedDistance += _this.speed;
            var bulletX = parseFloat(_bullet.style.left);
            var bulletY = parseFloat(_bullet.style.top);
            var newX = bulletX - _this.speed * Math.cos(_this.degree);
            var newY = bulletY - _this.speed * Math.sin(_this.degree);
            _bullet.style.left = "".concat(newX, "px");
            _bullet.style.top = "".concat(newY, "px");
            _this.pos.x = newX;
            _this.pos.y = newY;
            if (type == "enemy") {
                // if (Math.abs(this.pos.x - position.p.x - 12) <= 27 && Math.abs(this.pos.y - position.p.y - 12) <= 27 && !this.isColid) {
                if (Math.abs(newX - position.p.x - 10) <= 30 && Math.abs(newY - position.p.y - 10) <= 30 && !_this.isColid) {
                    //                             ^^ 있는 이유: 총알의 반지름
                    if (job == 0 && keyDown.jobSkill2.isSkillOn) {
                        hp.p -= Math.floor(_this.damage * (skillData[1].extraData * 0.01));
                    }
                    else {
                        hp.p -= _this.damage;
                    }
                    if (enemyJob == 1) {
                        moveSpeed = allSkillData[1][1].moveSpd;
                        setTimeout(function () {
                            moveSpeed = 8;
                        }, allSkillData[1][1].skillDuration * 10);
                    }
                    _this.isColid = true;
                    _this.isArrive = false;
                    if (_this.dmgToHeal) {
                        socket.send("{\"message\":\"dmgToHeal\"}");
                    }
                }
            }
            // 화면 밖으로 나가면 탄환 제거
            if ((newX < 0 || newX > _main.clientWidth || newY < 0 || newY > _main.clientHeight) && _this.isArrive) {
                clearInterval(interval);
                _this.isArrive = false;
                _main.removeChild(_bullet);
            }
            if (_this._movedDistance >= _this.reach * 8000) {
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
