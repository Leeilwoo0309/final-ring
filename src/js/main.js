var socket = new WebSocket("ws://localhost:8000");
var body = document.body;
var player = document.querySelector('.character.player');
var enemy = document.querySelector('.character.enemy');
var cursor = document.querySelector('#cursor');
var dash = document.querySelector('#dash');
var params = new URLSearchParams(window.location.search);
/**
 * 0: 돌격소총
 * 1: 기관총
 * 2: 저격소총
 * 3: 샷건
 */
var job = Number(params.get("job"));
var moveSpeed = 8;
var attackSpeedInit = [20, 10, 100, 50][job];
var damageInit = [10, 7, 45, 10][job];
var attackSpeed = 0;
var keyDown = {
    w: false,
    a: false,
    s: false,
    d: false,
    e: {
        isDown: false,
        dashLength: 0,
        cooltime: 0
    },
    f: {
        isDown: false,
        cooltime: 0
    },
    mouse: false,
};
var extraHp = 0;
var hp = {
    p: 100,
    e: 100
};
var position = {
    p: { x: 0, y: 0 },
    e: { x: 0, y: 0 }
};
var bullets = { p: [], e: [] };
body.addEventListener('keydown', function (e) {
    if (e.key === 'w') {
        keyDown.w = true;
    }
    else if (e.key === 'a') {
        keyDown.a = true;
    }
    else if (e.key === 's') {
        keyDown.s = true;
    }
    else if (e.key === 'd') {
        keyDown.d = true;
    }
    else if (e.key === 'e') {
        keyDown.e.isDown = true;
    }
    else if (e.key == 'f') {
        if (job == 0) {
            keyDown.f.cooltime = 2800;
            moveSpeed = 12;
            var interval_1 = setInterval(function () {
                if (keyDown.e.cooltime > 401) {
                    keyDown.e.cooltime = 400;
                }
            }, 16);
            setTimeout(function () {
                moveSpeed = 8;
                clearInterval(interval_1);
            }, 8000);
        }
        else if (job == 1) {
            keyDown.f.cooltime = 1500;
            attackSpeedInit = 5;
            damageInit = 5;
            setTimeout(function () {
                attackSpeedInit = 10;
                damageInit = 7;
            }, 2000);
        }
        else if (job == 2) {
            keyDown.f.cooltime = 1500;
            var mouseX = parseFloat(cursor.style.left);
            var mouseY = parseFloat(cursor.style.top);
            var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
            bullets.p.push(new Bullet().setDegree(angle).setDamage(80).setSpeed(30).build());
        }
        else if (job == 3) {
            keyDown.f.cooltime = 2000;
            for (var i = -6; i <= 6; i++) {
                var angle = i / 2;
                bullets.p.push(new Bullet().setDegree(angle).setDamage(30).build());
            }
        }
    }
    if (e.key == 'k') {
        hp.p = 100;
    }
});
body.addEventListener('keyup', function (e) {
    if (e.key === 'w') {
        keyDown.w = false;
    }
    else if (e.key === 'a') {
        keyDown.a = false;
    }
    else if (e.key === 's') {
        keyDown.s = false;
    }
    else if (e.key === 'd') {
        keyDown.d = false;
    }
    else if (e.key === 'e') {
        keyDown.e.isDown = false;
        keyDown.e.dashLength = 0;
    }
});
body.addEventListener('mousedown', function (e) {
    if (attackSpeed == 0) {
        attackSpeed = attackSpeedInit;
        var mouseX = e.clientX;
        var mouseY = e.clientY - 10;
        if (e.button === 0) {
            if (job == 3) {
                for (var i = -2; i < 3; i++) {
                    var angle = Math.atan2(position.p.y - mouseY + (i * 100), position.p.x - mouseX + (i * 100));
                    bullets.p.push(new Bullet().setDegree(angle).build());
                }
            }
            else {
                var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
                keyDown.mouse = true;
                bullets.p.push(new Bullet().setDegree(angle).build());
            }
        }
    }
});
body.addEventListener('mouseup', function (e) {
    if (e.button === 0) {
        keyDown.mouse = false;
    }
});
body.addEventListener('mousemove', function (e) {
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    cursor.style.left = "".concat(mouseX + 15, "px");
    cursor.style.top = "".concat(mouseY + 8, "px");
});
setInterval(function () {
    if (keyDown.w && keyDown.d) {
        player.style.top = "".concat(Number(player.style.top.replace('px', '')) - moveSpeed / Math.sqrt(2), "px");
        player.style.left = "".concat(Number(player.style.left.replace('px', '')) + moveSpeed / Math.sqrt(2), "px");
    }
    else if (keyDown.w && keyDown.a) {
        player.style.top = "".concat(Number(player.style.top.replace('px', '')) - moveSpeed / Math.sqrt(2), "px");
        player.style.left = "".concat(Number(player.style.left.replace('px', '')) - moveSpeed / Math.sqrt(2), "px");
    }
    else if (keyDown.s && keyDown.d) {
        player.style.top = "".concat(Number(player.style.top.replace('px', '')) + moveSpeed / Math.sqrt(2), "px");
        player.style.left = "".concat(Number(player.style.left.replace('px', '')) + moveSpeed / Math.sqrt(2), "px");
    }
    else if (keyDown.s && keyDown.a) {
        player.style.top = "".concat(Number(player.style.top.replace('px', '')) + moveSpeed / Math.sqrt(2), "px");
        player.style.left = "".concat(Number(player.style.left.replace('px', '')) - moveSpeed / Math.sqrt(2), "px");
    }
    else if (keyDown.w && keyDown.s) {
    }
    else if (keyDown.a && keyDown.d) {
    }
    else if (keyDown.w) {
        player.style.top = "".concat(Number(player.style.top.replace('px', '')) - moveSpeed, "px");
    }
    else if (keyDown.a) {
        player.style.left = "".concat(Number(player.style.left.replace('px', '')) - moveSpeed, "px");
    }
    else if (keyDown.s) {
        player.style.top = "".concat(Number(player.style.top.replace('px', '')) + moveSpeed, "px");
    }
    else if (keyDown.d) {
        player.style.left = "".concat(Number(player.style.left.replace('px', '')) + moveSpeed, "px");
    }
    if ((keyDown.e.isDown || keyDown.e.dashLength > 0) && (keyDown.e.cooltime == 0 || keyDown.e.dashLength > 0)) {
        keyDown.e.cooltime = 800;
        keyDown.e.dashLength += 1;
        var mouseX = Number(cursor.style.left.replace('px', ''));
        var mouseY = Number(cursor.style.top.replace('px', ''));
        var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
        var playerX = parseFloat(player.style.left);
        var playerY = parseFloat(player.style.top);
        var newX = -1 * 15 * Math.cos(angle);
        var newY = -1 * 15 * Math.sin(angle);
        if (keyDown.e.dashLength <= 10) {
            player.style.left = "".concat(playerX + newX, "px");
            player.style.top = "".concat(playerY + newY, "px");
        }
    }
    if (keyDown.mouse && job == 1) {
        if (attackSpeed == 0) {
            attackSpeed = attackSpeedInit;
            var mouseX = parseFloat(cursor.style.left) + Math.random() * 400 - 200;
            var mouseY = parseFloat(cursor.style.top) + Math.random() * 400 - 200;
            var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
            bullets.p.push(new Bullet().setDegree(angle).setDamage(damageInit).build());
        }
    }
    var myHp = document.querySelector('.hp-progress.player');
    var enemyHp = document.querySelector('.hp-progress.enemy');
    var hpInfo = document.querySelector('#hp-info-pro');
    var hpPInfo = document.querySelector('#hp-p');
    myHp.style.width = "".concat(hp.p, "%");
    enemyHp.style.width = "".concat(hp.e, "%");
    hpInfo.style.width = "".concat(hp.p, "%");
    hpPInfo.innerHTML = "HP: ".concat(hp.p, " / 100");
    position.p.x = Number(player.style.left.replace('px', ''));
    position.p.y = Number(player.style.top.replace('px', ''));
    var resJson = {
        hp: hp,
        position: position,
        bullets: bullets
    };
    if (position.p.x > 1506) {
        position.p.x = 1506;
        player.style.left = '1506px';
    }
    if (position.p.y > 670) {
        position.p.y = 670;
        player.style.top = '670px';
    }
    if (position.p.y < 9) {
        position.p.y = 9;
        player.style.top = '9px';
    }
    if (position.p.x < 48) {
        position.p.x = 48;
        player.style.left = '48px';
    }
    extraHp += 1;
    if (extraHp == 50) {
        if (hp.p < 100)
            hp.p += 1;
        extraHp = 0;
    }
    socket.send(JSON.stringify(resJson));
    bullets.p.forEach(function (e) {
        e.isSent = true;
    });
    if (hp.p < 0) {
        hp.p = 0;
    }
}, 16);
setInterval(function () {
    if (keyDown.e.cooltime > 0) {
        dash.innerHTML = "".concat(Math.floor(keyDown.e.cooltime / 10) / 10);
        dash.style.backgroundColor = 'black';
        dash.style.color = 'white';
        keyDown.e.cooltime -= 1;
    }
    else {
        dash.innerHTML = "DASH";
        dash.style.backgroundColor = '#00aaff';
        dash.style.color = 'black';
    }
    if (attackSpeed > 0) {
        attackSpeed -= 1;
    }
}, 10);
