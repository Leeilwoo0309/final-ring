const socket = new WebSocket("ws:/kimchi-game.kro.kr:8000");

const body: HTMLElement = document.body;
const player: HTMLDivElement = document.querySelector('.character.player');
const enemy: HTMLDivElement = document.querySelector('.character.enemy');
const cursor: HTMLImageElement = document.querySelector('#cursor');
const dashBtn: HTMLDivElement = document.querySelector('#dash');
const skillBtn: HTMLDivElement = document.querySelector('#r');
const secondSkillBtn: HTMLDivElement = document.querySelector('#r2');
const params = new URLSearchParams(window.location.search);

let readyStatus = {p: false, e: false}
/**
 * 0: 돌격소총
 * 1: 기관총
 * 2: 저격소총
 * 3: 샷건
 * 4: 쌍권총
 */
const job: number = Number(params.get("job"));
let enemyJob: number;
/**
 * 0: 돌진
 * 1: 점멸
 * 2: 힐
 */
const userSkill: number = Number(params.get("uski"));
const id: number = Number(params.get("id"));

async function clientGetData() {
    return await fetch("http://kimchi-game.kro.kr:1972/getData")
        .then(r => r.json())
}

let fetchedJobData: JobData;
let fetchedAllJobData: JobData;
let fetchedUserSkillData: UserSkillData;
let skillData: SkillData[];
let allSkillData: SkillData[][] = [];

clientGetData().then((r) => {
    try {
        fetchedJobData = r.data.job[job];
        fetchedAllJobData = r.data.job;
        fetchedUserSkillData = r.data.userSkill[userSkill];
        skillData = r.data.job[job].skill;
        document.querySelector("#loading").innerHTML = "상대방 기다리는 중..";
    
    
        r.data.job.forEach(e => {
            allSkillData.push(e.skill);
        })
    } catch (err) {
        
    }
});

let moveSpeed: number = 8;
let attackSpeedInit: number = [15, 10, 100, 50, 10, 5, 40][job]
let reach: number = [1.2, 1.2, 10, 1, 0.65, 0.5, 2][job];
let damageInit: number = [10, 7, 45, 10, 5, 4, 20][job];
let bulletSpd: number = [15, 15, 15, 15, 15, 15][job];
let skillCoolTime: number = 20;
let dmgToHeala: boolean = false;
let userSkillInfo: number;
let userSkillname: string;

const getVariable = setInterval(() => {
    attackSpeedInit = fetchedJobData.attackSpd;
    reach = fetchedJobData.reach / 10;
    damageInit = fetchedJobData.damage;
    skillCoolTime = fetchedJobData.skill[0].ct / 100;
    bulletSpd = fetchedJobData.bulletSpd;

    userSkillInfo = fetchedUserSkillData.ct;
    userSkillname = fetchedUserSkillData.name;

    if (readyStatus.p = true) {
        clearInterval(getVariable);
        socket.send(`{"message":"ready"}`)
        readyStatus.p = true;
    };
}, 16);

let attackSpeed: number = 0;
let keyDown: KeyDown = {
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

let extraHp = 0;
let hp = {
    p: 100,
    e: 100
};

let position = {
    p: {x: 0, y: 0},
    e: {x: 0, y: 0}
};

let bullets = {p: [], e: []};

if (id == 1) {
    player.style.top = `350px`;
    player.style.left = `100px`;
} else if (id == 2) {
    player.style.top = '350px';
    player.style.left = '1450px';
}

if (id == 2) {
    setTimeout(() => {
        fetch(`http://kimchi-game.kro.kr:1972/statistics/init?job=${job}&userskill=${userSkill}`);
    }, 500)
} else {
    fetch(`http://kimchi-game.kro.kr:1972/statistics/init?job=${job}&userskill=${userSkill}`);
}

body.addEventListener('keydown', (e) => {
    if (readyStatus.p && readyStatus.e) {
        if (e.key === 'w') {
            keyDown.w = true;
        } else if (e.key === 'a') {
            keyDown.a = true;
        } else if (e.key === 's') {
            keyDown.s = true;
        } else if (e.key === 'd') {
            keyDown.d = true;
        } else if (e.key === 'f') {
            keyDown.userSkillKey.isDown = true;
        } else if (e.key == 'e' && keyDown.jobSkill.cooltime == 0) {
            skill(job, skillData[0]);
        } else if (e.key == 'q' && keyDown.jobSkill2.cooltime == 0) {
            skill2(job, skillData[1]);
        }
    
        if (e.key == 'k') {
            hp.p = 100;
        }
    }
});

body.addEventListener('keyup', (e) => {
    if (e.key === 'w') {
        keyDown.w = false;
    } else if (e.key === 'a') {
        keyDown.a = false;
    } else if (e.key === 's') {
        keyDown.s = false;
    } else if (e.key === 'd') {
        keyDown.d = false;
    } else if (e.key === 'f') {
        keyDown.userSkillKey.isDown = false;
        keyDown.userSkillKey.dashLength = 0;
    }
});

body.addEventListener('mousedown', (e) => {
    if (readyStatus.p && readyStatus.e) {
        if (attackSpeed == 0) {
            attackSpeed = attackSpeedInit;

            const mouseX = e.clientX;
            const mouseY = e.clientY - 10;

            if (e.button === 0) {
                if (job == 3) {
                    for (let i = -2; i < 3; i++) {
                        const angle = Math.atan2(position.p.y - mouseY + (i * 100), position.p.x - mouseX + (i * 100))
                        bullets.p.push(new Bullet().setDegree(angle).setReach(reach).setSpeed(bulletSpd).setExtra({dmgToHeal: dmgToHeala}).build());
                    }
                } else {
                    const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
                    keyDown.mouse = true;
                    bullets.p.push(new Bullet().setDegree(angle).setReach(reach).setSpeed(bulletSpd).setExtra({dmgToHeal: dmgToHeala}).build());
                }
            }
        }
    }
});

body.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        keyDown.mouse = false;
    }
})

body.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    cursor.style.left = `${mouseX + 15}px`
    cursor.style.top = `${mouseY + 8}px`
})



setInterval(() => {
    if (keyDown.w && keyDown.d) {
        player.style.top = `${ Number(player.style.top.replace('px', '')) - moveSpeed / Math.sqrt(2)}px`;
        player.style.left = `${ Number(player.style.left.replace('px', '')) + moveSpeed / Math.sqrt(2)}px`;
    } else if (keyDown.w && keyDown.a) {
        player.style.top = `${ Number(player.style.top.replace('px', '')) - moveSpeed / Math.sqrt(2)}px`;
        player.style.left = `${ Number(player.style.left.replace('px', '')) - moveSpeed / Math.sqrt(2)}px`;
    } else if (keyDown.s && keyDown.d) {
        player.style.top = `${ Number(player.style.top.replace('px', '')) + moveSpeed  / Math.sqrt(2)}px`;
        player.style.left = `${ Number(player.style.left.replace('px', '')) + moveSpeed  / Math.sqrt(2)}px`;
    } else if (keyDown.s && keyDown.a) {
        player.style.top = `${ Number(player.style.top.replace('px', '')) + moveSpeed  / Math.sqrt(2)}px`;
        player.style.left = `${ Number(player.style.left.replace('px', '')) - moveSpeed  / Math.sqrt(2)}px`;
    } else if (keyDown.w && keyDown.s) {

    } else if (keyDown.a && keyDown.d) {

    }
    
    else if (keyDown.w) {
        player.style.top = `${ Number(player.style.top.replace('px', '')) - moveSpeed}px`;
    } else if (keyDown.a) {
        player.style.left = `${ Number(player.style.left.replace('px', '')) - moveSpeed}px`;
    } else if (keyDown.s) {
        player.style.top = `${ Number(player.style.top.replace('px', '')) + moveSpeed}px`;
    } else if (keyDown.d) {
        player.style.left = `${ Number(player.style.left.replace('px', '')) + moveSpeed}px`;
    }

    if (keyDown.userSkillKey.isDown) {
        userDefinedSkill(userSkill);
    }

    if (keyDown.mouse && (job == 1)) {
        if (attackSpeed == 0) {
            attackSpeed = attackSpeedInit;
    
            const mouseX = parseFloat(cursor.style.left) + Math.random() * 400 - 200;
            const mouseY = parseFloat(cursor.style.top) + Math.random() * 400 - 200;
        
            const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
        
            bullets.p.push(new Bullet().setDegree(angle).setDamage(damageInit).setReach(reach).setSpeed(bulletSpd).setExtra({dmgToHeal: dmgToHeala}).build());
        }
    } else if (keyDown.mouse && (job == 0 || job == 5) && attackSpeed == 0) {
        const mouseX = parseFloat(cursor.style.left)
        const mouseY = parseFloat(cursor.style.top)
        let angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);

        if (job == 5 && keyDown.jobSkill.isSkillOn) {
            const mouseX = parseFloat(cursor.style.left) + Math.random() * 300 - 150;
            const mouseY = parseFloat(cursor.style.top) + Math.random() * 300 - 150;

            angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);
        }

        attackSpeed = attackSpeedInit;

        bullets.p.push(new Bullet().setDegree(angle).setDamage(damageInit).setReach(reach).setSpeed(bulletSpd).setExtra({dmgToHeal: dmgToHeala}).build());
    }

    const playerHp: HTMLDivElement = document.querySelector('.hp-progress.player');
    const enemyHp: HTMLDivElement = document.querySelector('.hp-progress.enemy');
    const hpInfo: HTMLDivElement = document.querySelector('#hp-info-pro');
    const hpPInfo: HTMLParagraphElement = document.querySelector('#hp-p');

    playerHp.style.width = `${ hp.p }%`
    enemyHp.style.width = `${ hp.e }%`
    hpInfo.style.width = `${ hp.p }%`; hpPInfo.innerHTML = `HP: ${ hp.p} / 100`;

    position.p.x = Number(player.style.left.replace('px', ''))
    position.p.y = Number(player.style.top.replace('px', ''))

    let newBullet = {p: [], e: []};

    bullets.p.forEach(e => {
        if (e.isArrive) {
            newBullet.p.push(e);
        }
    });

    bullets.p = [...newBullet.p];

    const resJson = {
        hp: hp,
        position: position,
        bullets: bullets
    }

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
        if (hp.p < 100) hp.p += 1;
        extraHp = 0;
    }

    if (enemyJob == undefined) socket.send(`{"message": "getJob"}`);
    socket.send(JSON.stringify(resJson));

    bullets.p.forEach(e => {
        e.isSent = true;
    });

    if (hp.p < 0) {
        hp.p = 0;
        socket.send(`{"message":"gameover"}`);
        window.location.href = `./result.html?result=lose&job=${job}&userskill=${userSkill}`
    } else if (hp.p > 100) {
        hp.p = 100;
    }
}, 16);

setInterval(() => {
    if (readyStatus.e && readyStatus.p) {
        document.querySelector("#loading").innerHTML = `상대: ${ fetchedAllJobData[enemyJob].name }`;
        //@ts-ignore
        document.querySelector("#loading").style.color = "rgb(200, 200, 200)"
    } else if (readyStatus.p && !readyStatus.e) {
        socket.send(`{"message":"ready"}`);
    }

    if (keyDown.userSkillKey.cooltime > 0) {
        dashBtn.innerHTML = `${ Math.floor(keyDown.userSkillKey.cooltime / 10) / 10 }`
        dashBtn.style.backgroundColor = 'black';
        dashBtn.style.color = 'white';
        keyDown.userSkillKey.cooltime -= 1;
    } else {
        dashBtn.innerHTML = userSkillname + " (F)";
        dashBtn.style.backgroundColor = '#00aaff';
        dashBtn.style.color = 'black';
    }

    if (attackSpeed > 0) {
        attackSpeed -= 1;
    }

    if (keyDown.jobSkill.cooltime > 0) {
        keyDown.jobSkill.cooltime -= 1;
        skillBtn.innerHTML = `${ Math.floor(keyDown.jobSkill.cooltime / 10) / 10 }`
        skillBtn.style.backgroundColor = 'black';
        skillBtn.style.color = 'white';

        if (keyDown.jobSkill.isSkillOn == true) {
            skillBtn.style.backgroundColor = 'yellow';
            skillBtn.style.color = 'black';
        }
    } else {
        skillBtn.innerHTML = "SKILL 1 <br/> (E)";
        skillBtn.style.backgroundColor = '#00aaff';
        skillBtn.style.color = 'black';
    }

    if (keyDown.jobSkill2.cooltime > 0) {
        keyDown.jobSkill2.cooltime -= 1;
        secondSkillBtn.innerHTML = `${ Math.floor(keyDown.jobSkill2.cooltime / 10) / 10 }`
        secondSkillBtn.style.backgroundColor = 'black';
        secondSkillBtn.style.color = 'white';
        
        if (keyDown.jobSkill2.isSkillOn == true) {
            secondSkillBtn.style.backgroundColor = 'yellow';
            secondSkillBtn.style.color = 'black';
        }
    } else {
        secondSkillBtn.innerHTML = "SKILL 2 <br/> (Q)";
        secondSkillBtn.style.backgroundColor = '#00aaff';
        secondSkillBtn.style.color = 'black';
    }
}, 10);