class Bullet {
    public degree: number = 0;
    public pos: {x: number, y:  number} = {x: 0, y: 0};
    private speed: number = 15;
    public isArrive: boolean = true;
    public isSent: boolean = false;
    public isColid: boolean = false;
    public damage: number = damageInit;

    public setDegree(degree: number): Bullet {
        this.degree = degree;

        return this;
    }

    public setDamage(damage: number): Bullet {
        this.damage = damage;
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
        
        _main.appendChild(_bullet)

        const interval = setInterval(() => {
            const bulletX = parseFloat(_bullet.style.left);
            const bulletY = parseFloat(_bullet.style.top);

            const newX = bulletX - this.speed * Math.cos(this.degree);
            const newY = bulletY - this.speed * Math.sin(this.degree);
            
            _bullet.style.left = `${newX}px`;
            _bullet.style.top = `${newY}px`;

            this.pos.x = newX;
            this.pos.y = newY;

            if (type == "enemy") {
                
                if (Math.abs(this.pos.x - position.p.x - 12) <= 27 && Math.abs(this.pos.y - position.p.y - 12) <= 27 && !this.isColid) {
                    hp.p -= this.damage;
                    this.isColid = true;
                }
            }

            // 화면 밖으로 나가면 탄환 제거
            if (newX < 0 || newX > _main.clientWidth || newY < 0 || newY > _main.clientHeight) {
                clearInterval(interval);
                this.isArrive = false;
                _main.removeChild(_bullet);
            }
            }, 16);

        // clearInterval(interval);

        return this;
    }
}