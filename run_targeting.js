var iframe = $('#oneStopFrame');
var disableColor = "#DDD";
var selectColor = "#BEA886"; // 선택할 좌석 색상
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

function hexToRgb(hex) {
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function colorDistance(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

function isSimilarColor(color1Hex, color2Hex, threshold = 20) {
    const rgb1 = hexToRgb(color1Hex);
    const rgb2 = hexToRgb(color2Hex);
    return colorDistance(rgb1, rgb2) <= threshold;
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
        var rects = iframe.contents().find("#ez_canvas rect");

        // 비활성 색 제외하고 유사 색상 필터
        var filteredRects = rects.filter(function () {
            var fill = this.getAttribute("fill");
            return (
                fill &&
                fill !== "none" &&
                !fill.includes(disableColor) &&
                isSimilarColor(fill, selectColor)
            );
        });

        if (filteredRects.length > 0) {
            attachAlertController();
            simulateClick(filteredRects[0]);
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
