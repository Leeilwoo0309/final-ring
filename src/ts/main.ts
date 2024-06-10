const socket = new WebSocket("ws://localhost:8000");

const body: HTMLElement = document.body;
const player: HTMLDivElement = document.querySelector('.character.player');
const enemy: HTMLDivElement = document.querySelector('.character.enemy');
const cursor: HTMLImageElement = document.querySelector('#cursor');
const dash: HTMLDivElement = document.querySelector('#dash');
const params = new URLSearchParams(window.location.search);

/**
 * 0: 돌격소총
 * 1: 기관총
 * 2: 저격소총
 * 3: 샷건
 */
const job: number = Number(params.get("job"));

let moveSpeed: number = 8;
let attackSpeedInit: number = [20, 10, 100, 50][job];
let damageInit: number = [10, 7, 45, 10][job];

let attackSpeed: number = 0;
let keyDown: KeyDown = {
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

body.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        keyDown.w = true;
    } else if (e.key === 'a') {
        keyDown.a = true;
    } else if (e.key === 's') {
        keyDown.s = true;
    } else if (e.key === 'd') {
        keyDown.d = true;
    } else if (e.key === 'e') {
        keyDown.e.isDown = true;
    } else if (e.key == 'f') {
        if (job == 0) {
            keyDown.f.cooltime = 2800;
            moveSpeed = 12;

            const interval = setInterval(() => {
                if (keyDown.e.cooltime > 401) {
                    keyDown.e.cooltime = 400;
                }
            }, 16);

            setTimeout(() => {
                moveSpeed = 8;
                clearInterval(interval);
            }, 8000);

        } else if (job == 1) {
            keyDown.f.cooltime = 1500;
            attackSpeedInit = 5;
            damageInit = 5;

            setTimeout(() => {
                attackSpeedInit = 10;
                damageInit = 7;
            }, 2000);

        } else if (job == 2) {
            keyDown.f.cooltime = 1500;
            const mouseX = parseFloat(cursor.style.left);
            const mouseY = parseFloat(cursor.style.top);

            const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
                bullets.p.push(new Bullet().setDegree(angle).setDamage(80).setSpeed(30).build());

        } else if (job == 3) {
            keyDown.f.cooltime = 2000;

            for (let i = -6; i <= 6; i++) {
                const angle = i / 2
                bullets.p.push(new Bullet().setDegree(angle).setDamage(30).build());
            }
        }
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
    } else if (e.key === 'e') {
        keyDown.e.isDown = false;
        keyDown.e.dashLength = 0;
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
                    bullets.p.push(new Bullet().setDegree(angle).build());
                }
            } else {
                const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
                keyDown.mouse = true;
                bullets.p.push(new Bullet().setDegree(angle).build());
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

    if ((keyDown.e.isDown || keyDown.e.dashLength > 0) && (keyDown.e.cooltime == 0 || keyDown.e.dashLength > 0)) {
        keyDown.e.cooltime = 800;
        keyDown.e.dashLength += 1;
        const mouseX = Number(cursor.style.left.replace('px', ''))
        const mouseY = Number(cursor.style.top.replace('px', ''))

        const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX);

        const playerX = parseFloat(player.style.left);
        const playerY = parseFloat(player.style.top);

        const newX =  -1 * 15 * Math.cos(angle);
        const newY =  -1 * 15 * Math.sin(angle);

        if (keyDown.e.dashLength <= 10) {
            player.style.left = `${playerX + newX}px`;
            player.style.top = `${playerY + newY}px`;
        }
        
    }

    if (keyDown.mouse && job == 1) {
        if (attackSpeed == 0) {
            attackSpeed = attackSpeedInit;
    
            const mouseX = parseFloat(cursor.style.left) + Math.random() * 400 - 200;
            const mouseY = parseFloat(cursor.style.top) + Math.random() * 400 - 200;
        
            const angle = Math.atan2(position.p.y - mouseY, position.p.x - mouseX)
        
            bullets.p.push(new Bullet().setDegree(angle).setDamage(damageInit).build());
        }
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
    }

}, 16);

setInterval(() => {
    if (keyDown.e.cooltime > 0) {
        dash.innerHTML = `${ Math.floor(keyDown.e.cooltime / 10) / 10 }`
        dash.style.backgroundColor = 'black';
        dash.style.color = 'white';
        keyDown.e.cooltime -= 1;
    } else {
        dash.innerHTML = `DASH`;
        dash.style.backgroundColor = '#00aaff';
        dash.style.color = 'black';
    }

    if (attackSpeed > 0) {
        attackSpeed -= 1;
    }
}, 10);

