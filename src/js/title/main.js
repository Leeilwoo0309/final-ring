var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _socket = new WebSocket("ws://kimchi-game.kro.kr:8000");
var startBtn = document.querySelector('#start-btn');
var classSelect = document.querySelectorAll('.job-btn');
var skillSelect = document.querySelectorAll('.skill-btn');
var helpGun = document.querySelector('#info>h2');
var helpContent = document.querySelector('#info>p');
var _job = 0;
var _ski = 0;
var _isEnemyReady = false;
var _isPlayerReady = false;
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://kimchi-game.kro.kr:1972/getData")];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.json()];
            }
        });
    });
}
function getData2() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getData()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var fetchedHelp = getData2();
fetchedHelp.then(function (r) { return titleStart(r); });
classSelect.forEach(function (e, i) {
    e.addEventListener('click', function () {
        _job = i;
    });
});
skillSelect.forEach(function (e, i) {
    e.addEventListener('click', function () {
        _ski = i;
    });
});
function titleStart(fetchedData) {
    var help = fetchedData.data.job;
    setInterval(function () {
        classSelect.forEach(function (e, i) {
            e.innerHTML = help[i].name;
            e.style.backgroundColor = 'black';
            e.style.color = 'white';
        });
        skillSelect.forEach(function (e) {
            e.style.backgroundColor = 'gray';
            e.style.color = 'white';
        });
        classSelect[_job].style.backgroundColor = 'yellow';
        classSelect[_job].style.color = 'black';
        skillSelect[_ski].style.backgroundColor = '#00aaff';
        skillSelect[_ski].style.color = 'white';
        helpGun.innerHTML = help[_job].name;
        helpContent.innerHTML = "\n            <p>\uB300\uBBF8\uC9C0 - ".concat(help[_job].damage.toString(), "</p>\n            <p>\uACF5\uACA9\uC18D\uB3C4 - ").concat((Math.floor(100 / help[_job].attackSpd * 100) / 100).toString(), "</p>\n            <p>\uC0AC\uAC70\uB9AC - ").concat(Math.floor(help[_job].reach * 100).toString(), "</p>\n            <p>\uD0C4\uC18D - ").concat((help[_job].bulletSpd).toString(), "</p>\n        ");
        help[_job].skill.forEach(function (e, i) {
            helpContent.innerHTML += "<p>\uC2A4\uD0AC ".concat(i + 1, " [\uCFE8\uD0C0\uC784:  ").concat((e.ct / 100).toFixed(), "s] - ").concat(e.des, "</p>");
        });
        if (!_isPlayerReady && !_isEnemyReady) {
            startBtn.innerHTML = "준비하기";
            startBtn.style.backgroundColor = "gray";
        }
    }, 16);
}
_socket.onopen = function () {
    _socket.send("{\"message\": \"initReady\"}");
    startBtn.addEventListener('click', function () {
        _socket.send("{\"message\": \"ready\"}");
        if (_isPlayerReady) {
            _isPlayerReady = false;
        }
        else {
            _isPlayerReady = true;
            startBtn.innerHTML = "준비 완료..";
            startBtn.style.backgroundColor = "#6292a1";
            if (_isEnemyReady) {
                window.location.href = "./client.html?job=".concat(_job, "&uski=").concat(_ski, "&id=1");
            }
        }
    });
    _socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            if (reader.result == 'max') {
                document.querySelector('main').innerHTML = "정원이 초과되었습니다. (2명)";
            }
            //@ts-ignore
            var result = JSON.parse(reader.result);
            if (result.message == 'ready') {
                if (_isEnemyReady) {
                    _isEnemyReady = false;
                }
                else {
                    _isEnemyReady = true;
                    startBtn.innerHTML = "적 준비 완료..<br />(눌러서 준비)";
                    startBtn.style.backgroundColor = "#a16262";
                    if (_isPlayerReady) {
                        window.location.href = "./client.html?job=".concat(_job, "&uski=").concat(_ski, "&id=2");
                    }
                }
                //@ts-ignore
            }
            else if (result.message == 'initReady') {
                _isEnemyReady = false;
                _isPlayerReady = false;
            }
            console.log(result);
        };
        reader.readAsText(blob);
    };
};
