class Bullet {
    public degree: number = 0;
    public pos: {x: number, y:  number} = {x: 0, y: 0};
    private speed: number = 15;
    private _movedDistance: number = 0;
    public isArrive: boolean = true;
    public isSent: boolean = false;
    public isColid: boolean = false;
    public damage: number = damageInit;
    public reach: number = -1;
    public random: number = 0;
    public dmgToHeal: boolean = false;

    public setDegree(degree: number): Bullet {
        this.degree = degree;

        return this;
    }

    public setDamage(damage: number, random?: number): Bullet {
        this.damage = damage;
        if (random) {
            this.random = random;
        }
        return this;
    }

    public setSpeed(spd: number): Bullet {
        this.speed = spd;
        return this;
    }

    public setPos(x: number, y: number): Bullet {
        this.pos.x = x;
        this.pos.y = y;

        return this;
    }

    public setReach(time: number): Bullet {
        this.reach = time;
        return this;
    }

    public setExtra(extra: {dmgToHeal: boolean}): Bullet {
        this.dmgToHeal = extra.dmgToHeal;

        return this;
    }

    public build(type: 'player' | 'enemy' = 'player'): Bullet {
        const _main: HTMLElement = document.querySelector('main');
        let _bullet: HTMLDivElement = document.createElement('div');

        _bullet.className = `${ type } bullet`;

        if (type == "player") {
            _bullet.style.top = `${ Number(player.style.top.replace('px', '')) + 10}px`;
            _bullet.style.left = `${ Number(player.style.left.replace('px', '')) + 10}px`;
        } else if (type == "enemy") {
            _bullet.style.top = `${ Number(enemy.style.top.replace('px', '')) + 10}px`;
            _bullet.style.left = `${ Number(enemy.style.left.replace('px', '')) + 10}px`;
        }

        if (this.damage == 0) {
            _bullet.style.opacity = `20%`;
            _bullet.style.backgroundColor = `black`;
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

        const interval = setInterval(() => {
            this._movedDistance += this.speed;
            
            const bulletX = parseFloat(_bullet.style.left);
            const bulletY = parseFloat(_bullet.style.top);

            const newX = bulletX - this.speed * Math.cos(this.degree);
            const newY = bulletY - this.speed * Math.sin(this.degree);

            _bullet.style.left = `${newX}px`;
            _bullet.style.top = `${newY}px`;

            this.pos.x = newX;
            this.pos.y = newY;

            if (type == "enemy") {
                // if (Math.abs(this.pos.x - position.p.x - 12) <= 27 && Math.abs(this.pos.y - position.p.y - 12) <= 27 && !this.isColid) {
                if (Math.abs(newX - position.p.x - 10) <= 30 && Math.abs(newY - position.p.y - 10) <= 30 && !this.isColid) {
                    //                             ^^ 있는 이유: 총알의 반지름
                    if (job == 0 && keyDown.jobSkill2.isSkillOn) {
                        hp.p -= Math.floor(this.damage * (skillData[1].extraData * 0.01));
                    } else {
                        hp.p -= this.damage;
                    }

                    if (enemyJob == 1) {
                        moveSpeed = allSkillData[1][1].moveSpd;

                        setTimeout(() => {
                            moveSpeed = 8;
                        }, allSkillData[1][1].skillDuration * 10)
                    }

                    this.isColid = true;
                    this.isArrive = false;

                    if (this.dmgToHeal) {
                        socket.send(`{"message":"dmgToHeal"}`);
                    }
                }
            }

            // 화면 밖으로 나가면 탄환 제거
            if ((newX < 0 || newX > _main.clientWidth || newY < 0 || newY > _main.clientHeight) && this.isArrive) {
                clearInterval(interval);
                this.isArrive = false;
                _main.removeChild(_bullet);
            }

            if (this._movedDistance >= this.reach * 8000) {
                clearInterval(interval);
                this.isArrive = false;
                _main.removeChild(_bullet);
            }
        }, 16);

        // clearInterval(interval);

        return this;
    }
}