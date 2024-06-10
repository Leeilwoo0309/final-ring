var _socket = new WebSocket("ws://localhost:8000");
var startBtn = document.querySelector('#start-btn');
var classSelect = document.querySelectorAll('.job-btn');
var _job = 0;
classSelect.forEach(function (e, i) {
    e.addEventListener('click', function () {
        _job = i;
    });
});
setInterval(function () {
    classSelect.forEach(function (e) {
        e.style.backgroundColor = 'black';
        e.style.color = 'white';
    });
    classSelect[_job].style.backgroundColor = 'yellow';
    classSelect[_job].style.color = 'black';
}, 16);
_socket.onopen = function () {
    startBtn.addEventListener('click', function () {
        _socket.send("{\"message\": \"start\"}");
        window.location.href = "./client.html?job=".concat(_job);
    });
    _socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            if (JSON.parse(reader.result).message == 'start') {
                window.location.href = "./client.html?job=".concat(_job);
            }
        };
        reader.readAsText(blob);
    };
};
