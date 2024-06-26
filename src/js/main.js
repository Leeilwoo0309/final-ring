var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var socket = new WebSocket("ws:/kimchi-game.kro.kr:8000");
var body = document.body;
var player = document.querySelector('.character.player');
var enemy = document.querySelector('.character.enemy');
var cursor = document.querySelector('#cursor');
var dashBtn = document.querySelector('#dash');
var skillBtn = document.querySelector('#r');
var secondSkillBtn = document.querySelector('#r2');
var params = new URLSearchParams(window.location.search);
var readyStatus = { p: false, e: false };
/**
 * 0: 돌격소총
 * 1: 기관총
 * 2: 저격소총
 * 3: 샷건
 * 4: 쌍권총
 */
var job = Number(params.get("job"));
var enemyJob;
/**
 * 0: 돌진
 * 1: 점멸
 * 2: 힐
 */
var userSkill = Number(params.get("uski"));
var id = Number(params.get("id"));
function clientGetData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://kimchi-game.kro.kr:1972/getData")
                        .then(function (r) { return r.json(); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var fetchedJobData;
var fetchedAllJobData;
var fetchedUserSkillData;
var skillData;
var allSkillData = [];
clientGetData().then(function (r) {
    try {
        fetchedJobData = r.data.job[job];
        fetchedAllJobData = r.data.job;
        fetchedUserSkillData = r.data.userSkill[userSkill];
        skillData = r.data.job[job].skill;
        document.querySelector("#loading").innerHTML = "상대방 기다리는 중..";
        r.data.job.forEach(function (e) {
            allSkillData.push(e.skill);
        });
    }
    catch (err) {
    }
});
var moveSpeed = 8;
var attackSpeedInit = [15, 10, 100, 50, 10, 5, 40][job];
var reach = [1.2, 1.2, 10, 1, 0.65, 0.5, 2][job];
var damageInit = [10, 7, 45, 10, 5, 4, 20][job];
var bulletSpd = [15, 15, 15, 15, 15, 15][job];
var skillCoolTime = 20;
var dmgToHeala = false;
var userSkillInfo;
var userSkillname;
var getVariable = setInterval(function () {
    attackSpeedInit = fetchedJobData.attackSpd;
    reach = fetchedJobData.reach / 10;
    damageInit = fetchedJobData.damage;
    skillCoolTime = fetchedJobData.skill[0].ct / 100;
    bulletSpd = fetchedJobData.bulletSpd;
    userSkillInfo = fetchedUserSkillData.ct;
    userSkillname = fetchedUserSkillData.name;
    if (readyStatus.p = true) {
        clearInterval(getVariable);
        socket.send("{\"message\":\"ready\"}");
        readyStatus.p = true;
    }
    ;
}, 16);
var attackSpeed = 0;
var keyDown = {
    w: false,
    a: false,
    s: false,
    d: false,
    userSkillKey: {
        isDown: false,
        dashLength: 0,
        cooltime: 0
    },
    jobSkill: {
        isDown: false,
        cooltime: 0,
        isSkillOn: false
    },
    jobSkill2: {
        isDown: false,
        cooltime: 0,
        isSkillOn: false
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
if (id == 1) {
    player.style.top = "350px";
    player.style.left = "100px";
}
else if (id == 2) {
    player.style.top = '350px';
    player.style.left = '1450px';
}
if (id == 2) {
    setTimeout(function () {
        fetch("http://kimchi-game.kro.kr:1972/statistics/init?job=".concat(job, "&userskill=").concat(userSkill));
    }, 500);
}
else {
    fetch("http://kimchi-game.kro.kr:1972/statistics/init?job=".concat(job, "&userskill=").concat(userSkill));
}
body.addEventListener('keydown', function (e) {
    if (readyStatus.p && readyStatus.e) {
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
        else if (e.key === 'f') {
            keyDown.userSkillKey.isDown = true;
        }
        else if (e.key == 'e' && keyDown.jobSkill.cooltime == 0) {
            skill(job, skillData[0]);
        }
        else if (e.key == 'q' && keyDown.jobSkill2.cooltime == 0) {
            skill2(job, skillData[1]);
        }
        if (e.key == 'k') {
            hp.p = 100;
        }
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
    else if (e.key === 'f') {
        keyDown.userSkillKey.isDown = false;
        keyDown.userSkillKey.dashLength = 0;
    }
});
body.addEventListener('mousedown', function (e) {
    if (readyStatus.p && readyStatus.e) {
        if (attackSpeed == 0) {
            attackSpeed = attackSpeedInit;
            var mouseX = e.clientX;
            var mouseY = e.clientY - 10;
            if (e.button === 0) {
                if (job == 3) {
                    for (var i = -2; i < 3; i++) {
                        var angle = Math.atan2(position.p.y - mouseY + (i * 100), position.p.x - mouseX + (i * 100));
                        bullets.p.push(new Bullet().setDegree(angle).setReach(reach).setSpeed(bulletSpd).setExtra({ dmgToHeal: dmgToHeala }).build());
                    }
                }
                else {
                    var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
                    keyDown.mouse = true;
                    bullets.p.push(new Bullet().setDegree(angle).setReach(reach).setSpeed(bulletSpd).setExtra({ dmgToHeal: dmgToHeala }).build());
                }
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
    if (keyDown.userSkillKey.isDown) {
        userDefinedSkill(userSkill);
    }
    if (keyDown.mouse && (job == 1)) {
        if (attackSpeed == 0) {
            attackSpeed = attackSpeedInit;
            var mouseX = parseFloat(cursor.style.left) + Math.random() * 400 - 200;
            var mouseY = parseFloat(cursor.style.top) + Math.random() * 400 - 200;
            var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
            bullets.p.push(new Bullet().setDegree(angle).setDamage(damageInit).setReach(reach).setSpeed(bulletSpd).setExtra({ dmgToHeal: dmgToHeala }).build());
        }
    }
    else if (keyDown.mouse && (job == 0 || job == 5) && attackSpeed == 0) {
        var mouseX = parseFloat(cursor.style.left);
        var mouseY = parseFloat(cursor.style.top);
        var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
        if (job == 5 && keyDown.jobSkill.isSkillOn) {
            var mouseX_1 = parseFloat(cursor.style.left) + Math.random() * 300 - 150;
            var mouseY_1 = parseFloat(cursor.style.top) + Math.random() * 300 - 150;
            angle = Math.atan2(position.p.y - mouseY_1, position.p.x - mouseX_1);
        }
        attackSpeed = attackSpeedInit;
        bullets.p.push(new Bullet().setDegree(angle).setDamage(damageInit).setReach(reach).setSpeed(bulletSpd).setExtra({ dmgToHeal: dmgToHeala }).build());
    }
    var playerHp = document.querySelector('.hp-progress.player');
    var enemyHp = document.querySelector('.hp-progress.enemy');
    var hpInfo = document.querySelector('#hp-info-pro');
    var hpPInfo = document.querySelector('#hp-p');
    playerHp.style.width = "".concat(hp.p, "%");
    enemyHp.style.width = "".concat(hp.e, "%");
    hpInfo.style.width = "".concat(hp.p, "%");
    hpPInfo.innerHTML = "HP: ".concat(hp.p, " / 100");
    position.p.x = Number(player.style.left.replace('px', ''));
    position.p.y = Number(player.style.top.replace('px', ''));
    var newBullet = { p: [], e: [] };
    bullets.p.forEach(function (e) {
        if (e.isArrive) {
            newBullet.p.push(e);
        }
    });
    bullets.p = __spreadArray([], newBullet.p, true);
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
    if (enemyJob == undefined)
        socket.send("{\"message\": \"getJob\"}");
    socket.send(JSON.stringify(resJson));
    bullets.p.forEach(function (e) {
        e.isSent = true;
    });
    if (hp.p < 0) {
        hp.p = 0;
        socket.send("{\"message\":\"gameover\"}");
        window.location.href = "./result.html?result=lose&job=".concat(job, "&userskill=").concat(userSkill);
    }
    else if (hp.p > 100) {
        hp.p = 100;
    }
}, 16);
setInterval(function () {
    if (readyStatus.e && readyStatus.p) {
        document.querySelector("#loading").innerHTML = "\uC0C1\uB300: ".concat(fetchedAllJobData[enemyJob].name);
        //@ts-ignore
        document.querySelector("#loading").style.color = "rgb(200, 200, 200)";
    }
    else if (readyStatus.p && !readyStatus.e) {
        socket.send("{\"message\":\"ready\"}");
    }
    if (keyDown.userSkillKey.cooltime > 0) {
        dashBtn.innerHTML = "".concat(Math.floor(keyDown.userSkillKey.cooltime / 10) / 10);
        dashBtn.style.backgroundColor = 'black';
        dashBtn.style.color = 'white';
        keyDown.userSkillKey.cooltime -= 1;
    }
    else {
        dashBtn.innerHTML = userSkillname + " (F)";
        dashBtn.style.backgroundColor = '#00aaff';
        dashBtn.style.color = 'black';
    }
    if (attackSpeed > 0) {
        attackSpeed -= 1;
    }
    if (keyDown.jobSkill.cooltime > 0) {
        keyDown.jobSkill.cooltime -= 1;
        skillBtn.innerHTML = "".concat(Math.floor(keyDown.jobSkill.cooltime / 10) / 10);
        skillBtn.style.backgroundColor = 'black';
        skillBtn.style.color = 'white';
        if (keyDown.jobSkill.isSkillOn == true) {
            skillBtn.style.backgroundColor = 'yellow';
            skillBtn.style.color = 'black';
        }
    }
    else {
        skillBtn.innerHTML = "SKILL 1 <br/> (E)";
        skillBtn.style.backgroundColor = '#00aaff';
        skillBtn.style.color = 'black';
    }
    if (keyDown.jobSkill2.cooltime > 0) {
        keyDown.jobSkill2.cooltime -= 1;
        secondSkillBtn.innerHTML = "".concat(Math.floor(keyDown.jobSkill2.cooltime / 10) / 10);
        secondSkillBtn.style.backgroundColor = 'black';
        secondSkillBtn.style.color = 'white';
        if (keyDown.jobSkill2.isSkillOn == true) {
            secondSkillBtn.style.backgroundColor = 'yellow';
            secondSkillBtn.style.color = 'black';
        }
    }
    else {
        secondSkillBtn.innerHTML = "SKILL 2 <br/> (Q)";
        secondSkillBtn.style.backgroundColor = '#00aaff';
        secondSkillBtn.style.color = 'black';
    }
}, 10);
