var resultParams = new URLSearchParams(window.location.search);
var resultH3 = document.querySelector('h3');
var homeBtn = document.querySelector('#go-home');
var result = resultParams.get("result");
var resultSocket = new WebSocket("ws://localhost:8000");
if (result == 'lose') {
    resultH3.innerHTML = "패배";
    resultH3.className = 'lose';
}
else if (result == 'win') {
    resultH3.innerHTML = "승리";
    resultH3.className = 'win';
}
homeBtn.addEventListener('click', function () {
    window.location.href = './title.html';
});
resultSocket.onopen = function () {
    socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            if (JSON.parse(reader.result).message == 'start') {
                var _job_1 = 0;
                var _ski_1 = 0;
                window.location.href = "./client.html?job=".concat(_job_1, "&uski=").concat(_ski_1, "&id=2");
            }
        };
        reader.readAsText(blob);
    };
};