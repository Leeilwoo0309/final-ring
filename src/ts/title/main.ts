const _socket = new WebSocket("ws://localhost:8000");
const startBtn = document.querySelector('#start-btn');
const classSelect: NodeListOf<HTMLDivElement> = document.querySelectorAll('.job-btn');
let _job: number = 0;

classSelect.forEach((e, i) => {
    e.addEventListener('click', () => {
        _job = i;
    })
});

setInterval(() => {
    classSelect.forEach(e => {
        e.style.backgroundColor = 'black';
        e.style.color = 'white';
    })
    classSelect[_job].style.backgroundColor = 'yellow';
    classSelect[_job].style.color = 'black';
}, 16);

_socket.onopen = () => {
    startBtn.addEventListener('click', () => {
        _socket.send(`{"message": "start"}`);
        window.location.href = `./client.html?job=${_job}`;
        });
        
        _socket.onmessage = (event) => {
            const blob = event.data;
            const reader = new FileReader();
            
            reader.onload = () => {
                //@ts-ignore
                if (JSON.parse(reader.result).message == 'start') {
                    window.location.href = `./client.html?job=${_job}`;
                }
            }

        reader.readAsText(blob);
    }
}