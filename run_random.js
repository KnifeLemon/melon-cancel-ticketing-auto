var iframe = $('#oneStopFrame');
var disableColor = "#DDD";
var refreshTimer, findTimer;

// 프레임 로드
iframe.on('load', attachAlertController);

// alert 제어
function attachAlertController() {
    window.alert = alertController;
    iframe[0].contentWindow.window.alert = alertController;

    function alertController(text) {
        console.log('Alert Say : ' + text);
        refreshSeat();
        stop();
        start();
        return true;
    }
}

async function sortSeatList() {
    // 좌석 객체
    function getRectsAsync() {
        return new Promise((resolve) => {
            var rects = iframe[0].contentWindow.document.querySelectorAll('#ez_canvas rect');
            var rectsArray = Array.prototype.slice.call(rects);
            resolve(rectsArray);
        });
    }

    // 좌석 정렬 ( Y축 맨위, X축 중앙 )
    function sortRectsAsync(rectsArray) {
        return new Promise((resolve) => {
            // X 중심 좌표 계산
            const centerX = rectsArray.reduce((sum, rect) => sum + parseFloat(rect.getAttribute('x')), 0) / rectsArray.length;

            rectsArray.sort(function (a, b) {
                const aX = parseFloat(a.getAttribute('x'));
                const aY = parseFloat(a.getAttribute('y'));
                const bX = parseFloat(b.getAttribute('x'));
                const bY = parseFloat(b.getAttribute('y'));

                if (aY === bY) {
                    const aDist = Math.abs(aX - centerX);
                    const bDist = Math.abs(bX - centerX);
                    return aDist - bDist; // 중심에 가까운 순
                }

                return aY - bY; // 위쪽(Y 작을수록 먼저)
            });

            resolve(rectsArray);
        });
    }


    // 정렬된 좌석 HTML에 다시 정렬
    function appendRectsAsync(sortedRects) {
        return new Promise((resolve) => {
            var svg = iframe[0].contentWindow.document.querySelector('#ez_canvas svg');
            sortedRects.forEach(function (rect) {
                svg.appendChild(rect);
            });
            resolve();
        });
    }

    // 좌석 정렬 실행
    var rectsArray = await getRectsAsync();
    var sortedRects = await sortRectsAsync(rectsArray);
    await appendRectsAsync(sortedRects);
}

function simulateClick(ele) {
    let event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
    });

    ele.dispatchEvent(event);
}
function startRefresh() {
    refreshTimer = setInterval(refreshSeat, 800);
}

function refreshSeat() {
    if (iframe[0].contentWindow.lastZone == null) {
        init();
        $('#gd' + iframe[0].contentWindow.lastGrade).click();
    } else {
        iframe[0].contentWindow.init_suv();
        parent.data.selectedSeatCount = 0;
        iframe[0].contentWindow.setSelectSeatCount(true);
        iframe[0].contentWindow.getBlockSeatList();
    }
}

function findRect() {
    findTimer = setInterval(() => {
        var rect = $(`#ez_canvas rect:not([fill*='${disableColor}']):not([fill*='none'])`, iframe.contents());
        if (rect.length > 0) {
            attachAlertController();
            simulateClick(rect[0]);
            clearInterval(refreshTimer);
            clearInterval(findTimer);
        }

        if (parent.data.selectedSeatCount > 0) iframe[0].contentWindow.goTicketType();
    }, 10);
}

function start() {
    sortSeatList().then(() => {
        startRefresh();
        findRect();
    });
}

function stop() {
    clearInterval(refreshTimer);
    clearInterval(findTimer);
}

start();
