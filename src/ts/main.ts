const socket = new WebSocket("ws://10.7.152.216:8000");

const body: HTMLElement = document.body;
const player: HTMLDivElement = document.querySelector('.character.player');
const enemy: HTMLDivElement = document.querySelector('.character.enemy');
const cursor: HTMLImageElement = document.querySelector('#cursor');
const dashBtn: HTMLDivElement = document.querySelector('#dash');
const skillBtn: HTMLDivElement = document.querySelector('#r');
const params = new URLSearchParams(window.location.search);

/**
 * 0: 돌격소총
 * 1: 기관총
 * 2: 저격소총
 * 3: 샷건
 * 4: 쌍권총
 */
const job: number = Number(params.get("job"));
/**
 * 0: 돌진
 * 1: 점멸
 * 2: 힐
 */
const userSkill: number = Number(params.get("uski"));
const id: number = Number(params.get("id"));

async function clientGetData() {
    return await fetch("http://localhost:1972/getData")
        .then(r => r.json())
}

let fetchedData: JobData;
clientGetData().then(r => fetchedData = r.data.job[job]);

console.log(fetchedData)

let moveSpeed: number = 8;
let attackSpeedInit: number = [15, 10, 100, 50, 10, 5, 40][job]
let reach: number = [1.2, 1.2, 10, 1, 0.65, 0.5, 2][job];
let damageInit: number = [10, 7, 45, 10, 5, 4, 20][job];
let skillCoolTime: number = 20;
let dmgToHeala: boolean = false;

setTimeout(() => {
    attackSpeedInit = fetchedData.attackSpd;
    reach = fetchedData.reach;
    damageInit = fetchedData.damage;
    skillCoolTime = fetchedData.ct;
}, 16)

const userSkillInfo = [
    {cooltime: 800},
    {cooltime: 1500},
    {cooltime: 1300},
    {cooltime: 1700}
]

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
body.addEventListener('keydown', (e) => {
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
        skill(job);
    }

    if (e.key == 'k') {
        hp.p = 100;
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

    if (attackSpeed == 0) {
        attackSpeed = attackSpeedInit;

        const mouseX = e.clientX;
        const mouseY = e.clientY - 10;

        if (e.button === 0) {
            if (job == 3) {
                for (let i = -2; i < 3; i++) {
                    const angle = Math.atan2(position.p.y - mouseY + (i * 100), position.p.x - mouseX + (i * 100))
                    bullets.p.push(new Bullet().setDegree(angle).setReach(reach).setExtra({dmgToHeal: dmgToHeala}).build());
                }
            } else {
                const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
                keyDown.mouse = true;
                bullets.p.push(new Bullet().setDegree(angle).setReach(reach).setExtra({dmgToHeal: dmgToHeala}).build());
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
        
            bullets.p.push(new Bullet().setDegree(angle).setDamage(damageInit).setReach(reach).setExtra({dmgToHeal: dmgToHeala}).build());
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

        bullets.p.push(new Bullet().setDegree(angle).setDamage(damageInit).setReach(reach).setExtra({dmgToHeal: dmgToHeala}).build());
    }

    const myHp: HTMLDivElement = document.querySelector('.hp-progress.player');
    const enemyHp: HTMLDivElement = document.querySelector('.hp-progress.enemy');
    const hpInfo: HTMLDivElement = document.querySelector('#hp-info-pro');
    const hpPInfo: HTMLParagraphElement = document.querySelector('#hp-p');

    myHp.style.width = `${ hp.p }%`
    enemyHp.style.width = `${ hp.e }%`
    hpInfo.style.width = `${ hp.p }%`; hpPInfo.innerHTML = `HP: ${ hp.p} / 100`;

    position.p.x = Number(player.style.left.replace('px', ''))
    position.p.y = Number(player.style.top.replace('px', ''))

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


    socket.send(JSON.stringify(resJson));

    bullets.p.forEach(e => {
        e.isSent = true;
    });

    if (hp.p < 0) {
        hp.p = 0;
        socket.send(`{"message":"gameover"}`);
        window.location.href = './result.html?result=lose'
    } else if (hp.p > 100) {
        hp.p = 100;
    }

}, 16);

setInterval(() => {
    if (keyDown.userSkillKey.cooltime > 0) {
        dashBtn.innerHTML = `${ Math.floor(keyDown.userSkillKey.cooltime / 10) / 10 }`
        dashBtn.style.backgroundColor = 'black';
        dashBtn.style.color = 'white';
        keyDown.userSkillKey.cooltime -= 1;
    } else {
        dashBtn.innerHTML = ['DASH', 'FLASH', 'HEAL', 'VAMP'][userSkill] + " (F)";
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
    } else {
        skillBtn.innerHTML = "SKILL (E)";
        skillBtn.style.backgroundColor = '#00aaff';
        skillBtn.style.color = 'black';
    }
}, 10);