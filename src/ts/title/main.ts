const _socket = new WebSocket("ws://localhost:8000");
const startBtn = document.querySelector('#start-btn');
const classSelect: NodeListOf<HTMLDivElement> = document.querySelectorAll('.job-btn');
const skillSelect: NodeListOf<HTMLDivElement> = document.querySelectorAll('.skill-btn');
const helpGun: HTMLHeadingElement = document.querySelector('#info>h2');
const helpContent: HTMLParagraphElement = document.querySelector('#info>p');

let _job: number = 0;
let _ski: number = 0;

async function getData() {
    const res =  await fetch("http://localhost:1972/getData")
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
        classSelect.forEach(e => {
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
            <p>공격속도 - ${ help[_job].attackSpd.toString() }</p>
            <p>사거리 - ${ help[_job].reach.toString() }</p>
            <p>스킬 [쿨타임: ${ help[_job].ct.toFixed() }s] - ${ help[_job].skill }</p>
        `
    }, 16);    
}

_socket.onopen = () => {
    startBtn.addEventListener('click', () => {
        _socket.send(`{"message": "start"}`);
        window.location.href = `./client.html?job=${_job}&uski=${_ski}&id=1`;
        });
        
        _socket.onmessage = (event) => {
            const blob = event.data;
            const reader = new FileReader();
            
            reader.onload = () => {
                //@ts-ignore
                const result = JSON.parse(reader.result);
                if (result.message == 'start') {
                    window.location.href = `./client.html?job=${_job}&uski=${_ski}&id=2`;
                    //@ts-ignore
                }
                console.log(result);
            }

        reader.readAsText(blob);
    }
}