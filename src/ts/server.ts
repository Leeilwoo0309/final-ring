socket.onopen = () => {
    socket.onmessage = (event) => {
        const blob = event.data;
        
        const reader = new FileReader();
        reader.onload = function() {
            //@ts-ignore
            const sentJson: string = reader.result;
            
            hp.e = JSON.parse(sentJson).hp.p;
            position.e = JSON.parse(sentJson).position.p;
            
            bullets.e = JSON.parse(sentJson).bullets.p
            JSON.parse(sentJson).bullets.p.forEach((e) => {
                if (e.isArrive && !e.isSent) new Bullet().setDegree(e.degree).setDamage(e.damage).setPos(e.pos.x, e.pos.y).build('enemy');
            });

            enemy.style.top = `${ position.e.y }px`;
            enemy.style.left = `${ position.e.x }px`;
        };
        reader.readAsText(blob);
    };
}