socket.onopen = function () {
    socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            var sentJson = reader.result;
            hp.e = JSON.parse(sentJson).hp.p;
            position.e = JSON.parse(sentJson).position.p;
            bullets.e = JSON.parse(sentJson).bullets.p;
            JSON.parse(sentJson).bullets.p.forEach(function (e) {
                if (e.isArrive && !e.isSent)
                    new Bullet().setDegree(e.degree).setDamage(e.damage).setPos(e.pos.x, e.pos.y).build('enemy');
            });
            enemy.style.top = "".concat(position.e.y, "px");
            enemy.style.left = "".concat(position.e.x, "px");
        };
        reader.readAsText(blob);
    };
};
