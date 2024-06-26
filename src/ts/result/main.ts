const resultParams = new URLSearchParams(window.location.search);
const resultH3: HTMLHeadingElement = document.querySelector('h3');
const homeBtn: HTMLDivElement = document.querySelector('#go-home');
const resultSocket = new WebSocket("ws://kimchi-game.kro.kr:8000");

const result: string = resultParams.get("result");
const resultJob = resultParams.get("job");
const resultUserSkill = resultParams.get("userskill");

console.log(resultJob, resultUserSkill, result)
fetch(`http://kimchi-game.kro.kr:1972/statistics/gameover?job=${ resultJob }&userskill=${ resultUserSkill }&result=${ result }`);

if (result == 'lose') {
    resultH3.innerHTML = "패배";
    resultH3.className = 'lose'
} else if (result == 'win') {
    resultH3.innerHTML = "승리";
    resultH3.className = 'win'
}

homeBtn.addEventListener('click', () => {
    window.location.href = './title.html';
});

resultSocket.onopen = () => {
    socket.onmessage = (event) => {
        const blob = event.data;
        
        const reader = new FileReader();

        reader.onload = () => {
            //@ts-ignore
            if (JSON.parse(reader.result).message == 'start') {
                let _job = 0;
                let _ski = 0;
                window.location.href = `./client.html?job=${_job}&uski=${_ski}&id=2`;
            }
        }
        reader.readAsText(blob)
    }
}