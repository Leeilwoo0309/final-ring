socket.onopen = () => {
    socket.send(`{"job":"${job}"}`);

    socket.onmessage = (event) => {
        const blob = event.data;

        const reader = new FileReader();
        reader.onload = function() {
            //@ts-ignore
            const sentJson: {hp: {p, e}, position, bullets, message, job} = JSON.parse(reader.result);
            
            if (sentJson.hp != undefined) {
                
                hp.e = sentJson.hp.p;
                position.e = sentJson.position.p;
                
                bullets.e = sentJson.bullets.p
                sentJson.bullets.p.forEach((e) => {
                    if (e.isArrive && !e.isSent) new Bullet()
                        .setDegree(e.degree)
                    .setDamage(e.damage)
                    .setPos(e.pos.x, e.pos.y)
                    .setReach(e.reach)
                    .setSpeed(e.speed)
                    .setExtra({dmgToHeal: e.dmgToHeal})
                    .build('enemy');
                });
                
                enemy.style.top = `${ position.e.y }px`;
                enemy.style.left = `${ position.e.x }px`;
            } else {
                console.log(sentJson)
                if (sentJson.message == "dmgToHeal") {
                    hp.p += Math.floor(damageInit);
                } else if (sentJson.message == "gameover") {
                    if (id == 1) {
                        window.location.href = `./result.html?result=win&job=${job}&userskill=${userSkill}`
                    } else {
                        setTimeout(() => {window.location.href = `./result.html?result=win&job=${job}&userskill=${userSkill}`}, 400)
                    }
                } else if (sentJson.message == 'ready') {
                    if (!readyStatus.e) socket.send(JSON.stringify({message: "ready"}));
                    readyStatus.e = true;
                } else if (sentJson.message == 'getJob') {
                    socket.send(`{"job":${job}}`);
                } else if (sentJson.job != undefined) {
                    enemyJob = Number(sentJson.job);
                }
                
            }

        };
        try {
            reader.readAsText(blob);
        } catch (err) {
            if (JSON.parse(blob).message == 'disconnect')
                readyStatus.e = false;
        }
    };
}