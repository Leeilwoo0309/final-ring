function skill(job: number, skillData: SkillData) {
    keyDown.jobSkill.cooltime = skillData.ct;

    const skillD = {
        reach: skillData.reach / 10,
        damage: skillData.damage,
        attackSpd: skillData.attackSpd,
        bulletSpd: skillData.bulletSpd,
        moveSpd: skillData.moveSpd,
        skillDuration: skillData.skillDuration * 10,
        extraData: skillData.extraData,
    }


    if (job == 0) {
        moveSpeed = skillD.moveSpd;
        keyDown.jobSkill.isSkillOn = true;
        
        const interval = setInterval(() => {
            if (keyDown.userSkillKey.cooltime > skillD.extraData + 20) {
                keyDown.userSkillKey.cooltime = skillD.extraData;
                keyDown.jobSkill.isSkillOn = false;
            }
        }, 16);

        setTimeout(() => {
            moveSpeed = 8;
            clearInterval(interval);
        }, skillD.skillDuration);

    } else if (job == 1) {
        attackSpeedInit += skillD.attackSpd;
        damageInit += skillD.damage;
        keyDown.jobSkill.isSkillOn = true;
        
        setTimeout(() => {
            attackSpeedInit -= skillD.attackSpd;
            damageInit -= skillD.damage;
            keyDown.jobSkill.isSkillOn = false;
        }, skillD.skillDuration);

    } else if (job == 2) {
        const mouseX = parseFloat(cursor.style.left);
        const mouseY = parseFloat(cursor.style.top);

        const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
        bullets.p.push(
            new Bullet()
                .setDegree(angle)
                .setDamage(skillD.damage)
                .setSpeed(skillD.bulletSpd)
                .setReach(skillD.reach)
                .setExtra({dmgToHeal: dmgToHeala})
                .build()
        );

    } else if (job == 3) {
        /**
         * reach: 스킬 범위
         * damage: 스킬 대미지
         * bulletSpd: 스킬 탄속
         * extraData: 스킬 사용 시 발사하는 총알의 개수 / 2
         */
        for (let i = -1 * skillD.extraData; i <= skillD.extraData; i++) {
            const angle = i / 2
            bullets.p.push(
                new Bullet()
                    .setDegree(angle)
                    .setDamage(skillD.damage)
                    .setSpeed(skillD.bulletSpd)
                    .setReach(skillD.reach)
                    .setExtra({dmgToHeal: dmgToHeala})
                    .build()
            );
        }
    } else if (job == 4) {
        const mouseX = parseFloat(cursor.style.left);
        const mouseY = parseFloat(cursor.style.top);

        const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
        
        bullets.p.push(
            new Bullet()
                .setDegree(angle)
                .setDamage(skillD.damage)
                .setReach(skillD.reach)
                .setSpeed(skillD.bulletSpd)
                .setExtra({dmgToHeal: dmgToHeala})
                .build()
        )
    } else if (job == 5) {
        /**
         * reach: 사거리 증가량
         * skillDuration: 스킬 지속시간
         * moveSpd: 스킬 시전 중 이동속도 (정의)
         */
        keyDown.jobSkill.isSkillOn = true;
        reach += skillD.reach;
        moveSpeed = skillD.moveSpd;

        setTimeout(() => {
            moveSpeed = 8
            keyDown.jobSkill.isSkillOn = false;
            reach -= skillD.reach;
        }, skillD.skillDuration);
    }
}

function skill2(job: number, skillData: SkillData) {
    keyDown.jobSkill2.cooltime = skillData.ct;

    const skillD = {
        reach: skillData.reach / 10,
        damage: skillData.damage,
        attackSpd: skillData.attackSpd,
        bulletSpd: skillData.bulletSpd,
        moveSpd: skillData.moveSpd,
        skillDuration: skillData.skillDuration * 10,
        extraData: skillData.extraData,
    };
    const _x = parseFloat(cursor.style.left);
    const _y = parseFloat(cursor.style.top);
    
    const _globalAngle = Math.atan2(position.p.y - _y, position.p.x - _x);
    
    if (job == 0) {
        keyDown.jobSkill2.isSkillOn = true;

        setTimeout(() => {
            keyDown.jobSkill2.isSkillOn = false;
        }, skillD.skillDuration);
    } else if (job == 1) {
    } else if (job == 2) {
        attackSpeedInit -= skillD.attackSpd;
        keyDown.jobSkill2.isSkillOn = true;
        console.log(attackSpeedInit, skillD.attackSpd);
        
        setTimeout(() => {
            keyDown.jobSkill2.isSkillOn = false;
            attackSpeedInit += skillD.attackSpd;
        }, skillD.skillDuration);
    } else if (job == 3) {
        let index = 0;

        const skill2ShotGun = setInterval(() => {
            for (let i = -2; i < 3; i++) {
                const angle = Math.atan2(position.p.y - parseFloat(cursor.style.top) + (i * 100), position.p.x - parseFloat(cursor.style.left) + (i * 100))
                
                bullets.p.push(new Bullet()
                    .setDegree(angle)
                    .setDamage(skillD.damage)
                    .setReach(skillD.reach)
                    .setSpeed(skillD.bulletSpd)
                    .setExtra({dmgToHeal: dmgToHeala})
                    .build()
                );
            }

            if (index == 0) index += 1;
            else clearInterval(skill2ShotGun);
        }, skillD.extraData);

    } else if (job == 4) {
        /**
         * reach: 스킬 범위
         * damage: 스킬 대미지
         * bulletSpd: 스킬 탄속
         * skillDuration: 스킬 지속시간
         * extraData: 스킬 사용 시 발사하는 총알의 개수
         * moveSpd: 스킬 시전 중 이동속도 (정의)
         */
        let index = 0;
        const interval = setInterval(() => {
            moveSpeed = skillD.moveSpd;
            if (index < skillD.extraData + 1) {
                attackSpeed = 200;
                const x = position.e.x;
                const y = position.e.y;

                const angle = Math.atan2(position.p.y - y, position.p.x - x);
                bullets.p.push(
                    new Bullet()
                    .setDamage(skillD.damage)
                    .setDegree(angle)
                    .setSpeed(skillD.bulletSpd)
                    .setReach(skillD.reach)
                    .setExtra({dmgToHeal: true})
                    .build()
                );
                
                index += 1;
            } else {
                attackSpeed = 0;
                moveSpeed = 8;
                clearInterval(interval);
                clearInterval(decoBullet);
            }
        }, skillD.skillDuration / skillD.extraData);

        const decoBullet = setInterval(() => {
            bullets.p.push(
                new Bullet()
                    .setDamage(0)
                    .setDegree(Math.random() * 10)
                    .setSpeed(bulletSpd * 1.5)
                    .setReach(0.055)
                    .build()
            );
        }, 20);
    } else if (job == 5) {
        //@ts-ignore
        hp.p += Math.floor((100 - hp.p) * (skillD.extraData.ratio * 0.01)) + skillD.extraData.fixed;
    }
}

function userDefinedSkill(userSkill: number) {
    if (userSkill == 0 && (keyDown.userSkillKey.isDown || keyDown.userSkillKey.dashLength > 0) && (keyDown.userSkillKey.cooltime == 0 || keyDown.userSkillKey.dashLength > 0)) {
        keyDown.userSkillKey.cooltime = userSkillInfo;
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
            keyDown.userSkillKey.cooltime = userSkillInfo;
    
            const mouseX = Number(cursor.style.left.replace('px', ''))
            const mouseY = Number(cursor.style.top.replace('px', ''))
    
            const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
    
            const playerX = parseFloat(player.style.left);
            const playerY = parseFloat(player.style.top);
    
            const newX =  -1 * 200 * Math.cos(angle);
            const newY =  -1 * 200 * Math.sin(angle);
    
            player.style.left = `${playerX + newX}px`;
            player.style.top = `${playerY + newY}px`;
        } else if (userSkill == 2) {
            keyDown.userSkillKey.cooltime = userSkillInfo;

            hp.p += 20;
        } else if (userSkill == 3) {
            keyDown.userSkillKey.cooltime = userSkillInfo;
            dmgToHeala = true;

            setTimeout(() => {
                dmgToHeala = false;
            }, 5000)
        }
    }
}