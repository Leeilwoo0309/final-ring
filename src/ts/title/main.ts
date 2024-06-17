const _socket = new WebSocket("ws://kimchi-game.kro.kr:8000");
const startBtn: HTMLDivElement = document.querySelector('#start-btn');
const classSelect: NodeListOf<HTMLDivElement> = document.querySelectorAll('.job-btn');
const skillSelect: NodeListOf<HTMLDivElement> = document.querySelectorAll('.skill-btn');
const helpGun: HTMLHeadingElement = document.querySelector('#info>h2');
const helpContent: HTMLParagraphElement = document.querySelector('#info>p');

let _job: number = 0;
let _ski: number = 0;
let _isEnemyReady: boolean = false;
let _isPlayerReady: boolean = false;

async function getData() {
    const res =  await fetch("http://kimchi-game.kro.kr:1972/getData")
    return res.json();
}

async function getData2() {
    return await getData();
}

let fetchedHelp = getData2();
fetchedHelp.then(r => titleStart(r))

classSelect.forEach((e, i) => {
    e.addEventListener('click', () => {
        _job = i;
    })
});

skillSelect.forEach((e, i) => {
    e.addEventListener('click', () => {
        _ski = i;
    })
})

function titleStart(fetchedData) {
    const help = fetchedData.data.job
    
    setInterval(() => {
        classSelect.forEach((e, i) => {
            e.innerHTML = help[i].name;
            e.style.backgroundColor = 'black';
            e.style.color = 'white';
        });
    
        skillSelect.forEach(e => {
            e.style.backgroundColor = 'gray';
            e.style.color = 'white';
        })
    
        classSelect[_job].style.backgroundColor = 'yellow';
        classSelect[_job].style.color = 'black';
    
        skillSelect[_ski].style.backgroundColor = '#00aaff';
        skillSelect[_ski].style.color = 'white';
    
        helpGun.innerHTML = help[_job].name;
        helpContent.innerHTML = `
            <p>대미지 - ${ help[_job].damage.toString() }</p>
            <p>공격속도 - ${ (Math.floor(100 / help[_job].attackSpd * 100) / 100).toString() }</p>
            <p>사거리 - ${ Math.floor(help[_job].reach * 100).toString() }</p>
            <p>탄속 - ${ (help[_job].bulletSpd).toString() }</p>
        `

        help[_job].skill.forEach((e, i) => {
            helpContent.innerHTML += `<p>스킬 ${i + 1} [쿨타임:  ${ ( e.ct / 100).toFixed() }s] - ${ e.des }</p>`
        });
    
    
        if (!_isPlayerReady && !_isEnemyReady) {
            startBtn.innerHTML = "준비하기";
            startBtn.style.backgroundColor = "gray";
        }
    }, 16);
}

_socket.onopen = () => {
    _socket.send(`{"message": "initReady"}`);

    startBtn.addEventListener('click', () => {
        _socket.send(`{"message": "ready"}`);
        if (_isPlayerReady) {
            _isPlayerReady = false;
        } else {
            _isPlayerReady = true;
    
            startBtn.innerHTML = "준비 완료..";
            startBtn.style.backgroundColor = "#6292a1";
    
            
            if (_isEnemyReady) {
                window.location.href = `./client.html?job=${_job}&uski=${_ski}&id=1`;
            }
        }
    });
        
        _socket.onmessage = (event) => {
            const blob = event.data;
            const reader = new FileReader();
            
            reader.onload = () => {
                if (reader.result == 'max') {
                    document.querySelector('main').innerHTML = "정원이 초과되었습니다. (2명)";
                }
                
                //@ts-ignore
                const result = JSON.parse(reader.result);
                if (result.message == 'ready') {
                    if (_isEnemyReady) {
                        _isEnemyReady = false;
                    } else {
                        _isEnemyReady = true;
    
                        startBtn.innerHTML = "적 준비 완료..<br />(눌러서 준비)";
                        startBtn.style.backgroundColor = "#a16262";
    
                        if (_isPlayerReady) {
                            window.location.href = `./client.html?job=${_job}&uski=${_ski}&id=2`;
                        }
                    }
                    //@ts-ignore
                } else if (result.message == 'initReady') {
                    _isEnemyReady = false;
                    _isPlayerReady = false;
                }
                console.log(result);
            }

        reader.readAsText(blob);
    }
}