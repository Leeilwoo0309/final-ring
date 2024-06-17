socket.onopen = function () {
    socket.send("{\"job\":\"".concat(job, "\"}"));
    socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            var sentJson = JSON.parse(reader.result);
            if (sentJson.hp != undefined) {
                hp.e = sentJson.hp.p;
                position.e = sentJson.position.p;
                bullets.e = sentJson.bullets.p;
                sentJson.bullets.p.forEach(function (e) {
                    if (e.isArrive && !e.isSent)
                        new Bullet()
                            .setDegree(e.degree)
                            .setDamage(e.damage)
                            .setPos(e.pos.x, e.pos.y)
                            .setReach(e.reach)
                            .setSpeed(e.speed)
                            .setExtra({ dmgToHeal: e.dmgToHeal })
                            .build('enemy');
                });
                enemy.style.top = "".concat(position.e.y, "px");
                enemy.style.left = "".concat(position.e.x, "px");
            }
            else {
                console.log(sentJson);
                if (sentJson.message == "dmgToHeal") {
                    hp.p += Math.floor(damageInit);
                }
                else if (sentJson.message == "gameover") {
                    if (id == 1) {
                        window.location.href = "./result.html?result=win&job=".concat(job, "&userskill=").concat(userSkill);
                    }
                    else {
                        setTimeout(function () { window.location.href = "./result.html?result=win&job=".concat(job, "&userskill=").concat(userSkill); }, 400);
                    }
                }
                else if (sentJson.message == 'ready') {
                    if (!readyStatus.e)
                        socket.send(JSON.stringify({ message: "ready" }));
                    readyStatus.e = true;
                }
                else if (sentJson.message == 'getJob') {
                    socket.send("{\"job\":".concat(job, "}"));
                }
                else if (sentJson.job != undefined) {
                    enemyJob = Number(sentJson.job);
                }
            }
        };
        try {
            reader.readAsText(blob);
        }
        catch (err) {
            if (JSON.parse(blob).message == 'disconnect')
                readyStatus.e = false;
        }
    };
};
