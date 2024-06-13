function skill(job: number) {
    keyDown.jobSkill.cooltime = skillCoolTime * 100;
    if (job == 0) {
        moveSpeed = 12;

        const interval = setInterval(() => {
            if (keyDown.userSkillKey.cooltime > 401) {
                keyDown.userSkillKey.cooltime = 400;
            }
        }, 16);

        setTimeout(() => {
            moveSpeed = 8;
            clearInterval(interval);
        }, 8000);

    } else if (job == 1) {
        attackSpeedInit = 5;
        damageInit = 5;

        setTimeout(() => {
            attackSpeedInit = 10;
            damageInit = 7;
        }, 2000);

    } else if (job == 2) {
        const mouseX = parseFloat(cursor.style.left);
        const mouseY = parseFloat(cursor.style.top);

        const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
            bullets.p.push(new Bullet().setDegree(angle).setDamage(80).setSpeed(30).setExtra({dmgToHeal: dmgToHeala}).build());

    } else if (job == 3) {

        for (let i = -6; i <= 6; i++) {
            const angle = i / 2
            bullets.p.push(new Bullet().setDegree(angle).setDamage(30).setExtra({dmgToHeal: dmgToHeala}).build());
        }
    } else if (job == 4) {

        let index = 0;
        const interval = setInterval(() => {
            if (index < 11) {
                attackSpeed = 200;
                const x = position.e.x;
                const y = position.e.y;

                const angle = Math.atan2(position.p.y - y, position.p.x - x);
                bullets.p.push(new Bullet().setDamage(8).setDegree(angle).setReach(0.45).setExtra({dmgToHeal: dmgToHeala}).build());
                
                index += 1;
            } else {
                attackSpeed = 0;
                clearInterval(interval);
                clearInterval(decoBullet);
            }
        }, 200);

        const decoBullet = setInterval(() => {
            bullets.p.push(new Bullet().setDamage(0).setDegree(Math.random() * 10).setReach(0.45).setExtra({dmgToHeal: dmgToHeala}).build());
        }, 50)
    } else if (job == 5) {
        keyDown.jobSkill.isSkillOn = true;
        reach = 0.8;

        setTimeout(() => {
            keyDown.jobSkill.isSkillOn = false;
            reach = 0.5
        }, 2500);
    }
}

function userDefinedSkill(userSkill: number) {
    if (userSkill == 0 && (keyDown.userSkillKey.isDown || keyDown.userSkillKey.dashLength > 0) && (keyDown.userSkillKey.cooltime == 0 || keyDown.userSkillKey.dashLength > 0)) {
        keyDown.userSkillKey.cooltime = userSkillInfo[userSkill].cooltime;
        keyDown.userSkillKey.dashLength += 1;
        const mouseX = Number(cursor.style.left.replace('px', ''))
        const mouseY = Number(cursor.style.top.replace('px', ''))

        const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);

        const playerX = parseFloat(player.style.left);
        const playerY = parseFloat(player.style.top);

        const newX =  -1 * 15 * Math.cos(angle);
        const newY =  -1 * 15 * Math.sin(angle);

        if (keyDown.userSkillKey.dashLength <= 10) {
            player.style.left = `${playerX + newX}px`;
            player.style.top = `${playerY + newY}px`;
        }
    }
    if (keyDown.userSkillKey.cooltime == 0){
        if (userSkill == 1) {
            keyDown.userSkillKey.cooltime = userSkillInfo[userSkill].cooltime;
    
            const mouseX = Number(cursor.style.left.replace('px', ''))
            const mouseY = Number(cursor.style.top.replace('px', ''))
    
            const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
    
            const playerX = parseFloat(player.style.left);
            const playerY = parseFloat(player.style.top);
    
            const newX =  -1 * 150 * Math.cos(angle);
            const newY =  -1 * 150 * Math.sin(angle);
    
            player.style.left = `${playerX + newX}px`;
            player.style.top = `${playerY + newY}px`;
        } else if (userSkill == 2) {
            keyDown.userSkillKey.cooltime = userSkillInfo[userSkill].cooltime;

            hp.p += 20;
        } else if (userSkill == 3) {
            keyDown.userSkillKey.cooltime = userSkillInfo[userSkill].cooltime;
            dmgToHeala = true;

            setTimeout(() => {
                dmgToHeala = false;
            }, 5000)
        }
    }
}