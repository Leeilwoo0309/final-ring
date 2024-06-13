socket.onopen = () => {
    socket.onmessage = (event) => {
        const blob = event.data;
        
        const reader = new FileReader();
        reader.onload = function() {
            //@ts-ignore
            const sentJson: string = reader.result;
            
            if (JSON.parse(sentJson).hp != undefined) {
                
                hp.e = JSON.parse(sentJson).hp.p;
                position.e = JSON.parse(sentJson).position.p;
                
                bullets.e = JSON.parse(sentJson).bullets.p
                JSON.parse(sentJson).bullets.p.forEach((e) => {
                    if (e.isArrive && !e.isSent) new Bullet()
                        .setDegree(e.degree)
                        .setDamage(e.damage)
                        .setPos(e.pos.x, e.pos.y)
                        .setReach(e.time)
                        .setExtra({dmgToHeal: e.dmgToHeal})
                        .build('enemy');
                    });
                    
                    enemy.style.top = `${ position.e.y }px`;
                    enemy.style.left = `${ position.e.x }px`;
            } else {
                console.log(sentJson)
                if (JSON.parse(sentJson).message == "dmgToHeal") {
                    hp.p += Math.floor(damageInit / 2);
                } else if (JSON.parse(sentJson).message == "gameover") {
                    window.location.href = './result.html?result=win'
                }
            }
        };
        reader.readAsText(blob);
    };
}