function skill(job) {
    keyDown.jobSkill.cooltime = skillCoolTime * 100;
    if (job == 0) {
        moveSpeed = 12;
        var interval_1 = setInterval(function () {
            if (keyDown.userSkillKey.cooltime > 401) {
                keyDown.userSkillKey.cooltime = 400;
            }
        }, 16);
        setTimeout(function () {
            moveSpeed = 8;
            clearInterval(interval_1);
        }, 8000);
    }
    else if (job == 1) {
        attackSpeedInit = 5;
        damageInit = 5;
        setTimeout(function () {
            attackSpeedInit = 10;
            damageInit = 7;
        }, 2000);
    }
    else if (job == 2) {
        var mouseX = parseFloat(cursor.style.left);
        var mouseY = parseFloat(cursor.style.top);
        var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
        bullets.p.push(new Bullet().setDegree(angle).setDamage(80).setSpeed(30).setExtra({ dmgToHeal: dmgToHeala }).build());
    }
    else if (job == 3) {
        for (var i = -6; i <= 6; i++) {
            var angle = i / 2;
            bullets.p.push(new Bullet().setDegree(angle).setDamage(30).setExtra({ dmgToHeal: dmgToHeala }).build());
        }
    }
    else if (job == 4) {
        var index_1 = 0;
        var interval_2 = setInterval(function () {
            if (index_1 < 11) {
                attackSpeed = 200;
                var x = position.e.x;
                var y = position.e.y;
                var angle = Math.atan2(position.p.y - y, position.p.x - x);
                bullets.p.push(new Bullet().setDamage(8).setDegree(angle).setReach(0.45).setExtra({ dmgToHeal: dmgToHeala }).build());
                index_1 += 1;
            }
            else {
                attackSpeed = 0;
                clearInterval(interval_2);
                clearInterval(decoBullet_1);
            }
        }, 200);
        var decoBullet_1 = setInterval(function () {
            bullets.p.push(new Bullet().setDamage(0).setDegree(Math.random() * 10).setReach(0.45).setExtra({ dmgToHeal: dmgToHeala }).build());
        }, 50);
    }
    else if (job == 5) {
        keyDown.jobSkill.isSkillOn = true;
        reach = 0.8;
        setTimeout(function () {
            keyDown.jobSkill.isSkillOn = false;
            reach = 0.5;
        }, 2500);
    }
}
function userDefinedSkill(userSkill) {
    if (userSkill == 0 && (keyDown.userSkillKey.isDown || keyDown.userSkillKey.dashLength > 0) && (keyDown.userSkillKey.cooltime == 0 || keyDown.userSkillKey.dashLength > 0)) {
        keyDown.userSkillKey.cooltime = userSkillInfo[userSkill].cooltime;
        keyDown.userSkillKey.dashLength += 1;
        var mouseX = Number(cursor.style.left.replace('px', ''));
        var mouseY = Number(cursor.style.top.replace('px', ''));
        var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
        var playerX = parseFloat(player.style.left);
        var playerY = parseFloat(player.style.top);
        var newX = -1 * 15 * Math.cos(angle);
        var newY = -1 * 15 * Math.sin(angle);
        if (keyDown.userSkillKey.dashLength <= 10) {
            player.style.left = "".concat(playerX + newX, "px");
            player.style.top = "".concat(playerY + newY, "px");
        }
    }
    if (keyDown.userSkillKey.cooltime == 0) {
        if (userSkill == 1) {
            keyDown.userSkillKey.cooltime = userSkillInfo[userSkill].cooltime;
            var mouseX = Number(cursor.style.left.replace('px', ''));
            var mouseY = Number(cursor.style.top.replace('px', ''));
            var angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
            var playerX = parseFloat(player.style.left);
            var playerY = parseFloat(player.style.top);
            var newX = -1 * 150 * Math.cos(angle);
            var newY = -1 * 150 * Math.sin(angle);
            player.style.left = "".concat(playerX + newX, "px");
            player.style.top = "".concat(playerY + newY, "px");
        }
        else if (userSkill == 2) {
            keyDown.userSkillKey.cooltime = userSkillInfo[userSkill].cooltime;
            hp.p += 20;
        }
        else if (userSkill == 3) {
            keyDown.userSkillKey.cooltime = userSkillInfo[userSkill].cooltime;
            dmgToHeala = true;
            setTimeout(function () {
                dmgToHeala = false;
            }, 5000);
        }
    }
}
