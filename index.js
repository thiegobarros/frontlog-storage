var storage = 'local';
var logByAttribute = true;
var logClicks = true;
var logKeyPress = true;
var logErrors = true;
var logOnHover = true;
var onHoverTiming = 1000;
var timeStamp = 0;

var endPoint = '';
var sendingTiming = 10000;
var headers = [
    ['Content-Type', 'application/json']
];

var time;

function frontlog(setup) {
    storage = setup.storage === undefined ? storage: setup.storage;
    logByAttribute = setup.logByAttribute === undefined ? logByAttribute: setup.logByAttribute;
    logClicks = setup.logClicks === undefined ? logClicks: setup.logClicks;
    logKeyPress = setup.logKeyPress === undefined ? logKeyPress: setup.logKeyPress;
    logErrors = setup.logErrors === undefined ? logErrors: setup.logErrors;
    logOnHover = setup.logOnHover === undefined ? logOnHover: setup.logOnHover;
    onHoverTiming = setup.onHoverTiming === undefined ? onHoverTiming: setup.onHoverTiming;
    endPoint = setup.endPoint === undefined ? endPoint: setup.endPoint;
    sendingTiming = setup.sendingTiming === undefined ? sendingTiming: setup.sendingTiming;
    headers = setup.headers === undefined ? headers: setup.headers;
}

function getStorageItem (param) {
    return (storage === 'session') ? JSON.parse(sessionStorage.getItem(param) || '[]') : JSON.parse(localStorage.getItem(param) || '[]');
}

function setStorageItem (param, obj) {
    (storage === 'session') ? sessionStorage.setItem(param, JSON.stringify(obj)) : localStorage.setItem(param, JSON.stringify(obj));
}

function canSave (elem, param) {
    if (!logByAttribute) return true;
    if (logByAttribute && elem.dataset.frontLog==="true") return true;
    if (logByAttribute && param==="click" && elem.dataset.frontLog==="click") return true;
    if (logByAttribute && param==="keypress" && elem.dataset.frontLog==="keypress") return true;
    if (logByAttribute && param==="onhover" && elem.dataset.frontLog==="onhover") return true;
    return false;
}

function canSend () {
    let clicks = getStorageItem("frontlog_click");
    let keypress = getStorageItem("frontlog_keypress");
    let errors = getStorageItem("frontlog_error");
    let onhover = getStorageItem("frontlog_onhover");

    if (clicks.length === 0 && keypress.length === 0 && errors.length === 0 && onhover.length === 0 ) return false;
    return true;
}

//Logging Click
function clickMouse(event) {
    if (logClicks && canSave(event.target, "click")) {
        let clicks = getStorageItem("frontlog_click");
        clicks.push(
            {
                date: new Date(),
                tag: event.target.tagName,
                id: event.target.id,
                name: event.target.getAttribute('name'),
                element: event.target.outerHTML
            }
        );
        setStorageItem("frontlog_click", clicks);
    }
}
document.addEventListener('click', clickMouse);

//Logging Key Press
function keyPress(event) {
    if (logKeyPress && canSave(event.target, "keypress")) {
        let keyPress = getStorageItem("frontlog_keypress");
        keyPress.push(
            {
                date: new Date(),
                element_id: event.target.id,
                element_name: event.target.getAttribute('name'),
                key_id: event.charCode || event.keyCode,
                key_name: event.code,
                key_value: event.key
            }
        );
        setStorageItem("frontlog_keypress", keyPress);
    }
}
document.addEventListener('keypress', keyPress);

//logging Errors
console.defaultError = console.error.bind(console);
console.errors = [];

console.error = function(){
    if (logErrors) {
        console.defaultError.apply(console, arguments);
        console.errors.push(Array.from(arguments));

        let errors = getStorageItem("frontlog_error");
        console.errors.forEach(element => {
            element.forEach(error => {
                errors.push(
                    {
                        date: new Date(),
                        type: "console",
                        error: error
                    }
                );
            });
        });
        setStorageItem("frontlog_error", errors);
    }
}

window.onerror = function(message, source, lineno, colno) {
    if (logErrors) {
        let errors = getStorageItem("frontlog_error");
        errors.push(
            {
                date: new Date(),
                type: "window",
                error: `Line: ${lineno} Column: ${colno} Source: ${source} Message: ${message}`
            }
        );
        setStorageItem("frontlog_error", errors);
    }
    return false;
};

//logging On Hover
function mouseOver(event) {
    timeStamp = event.timeStamp;
}
document.addEventListener('mouseover', mouseOver);

function mouseOut(event) {
    timeStamp = event.timeStamp - timeStamp;
    if (logOnHover && timeStamp >= onHoverTiming && canSave(event.target, "onhover")) {
        let hover = getStorageItem("frontlog_onhover");
        hover.push(
            {
                date: new Date(),
                tag: event.target.tagName,
                id: event.target.id,
                name: event.target.getAttribute('name'),
                timeStamp: timeStamp
            }
        );
        setStorageItem("frontlog_onhover", hover);
    }
}
document.addEventListener('mouseout', mouseOut);

//Idle User
window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeydown = resetTimer;

//Sending to EndPoint
function sending() {
    if (canSend()) {
        fetch(endPoint, {
            method: "POST",
            headers: new Headers(headers),
            body: JSON.stringify({
                clicks: getStorageItem("frontlog_click"),
                keyPress: getStorageItem("frontlog_keypress"),
                onHover: getStorageItem("frontlog_onhover"),
                errors: getStorageItem("frontlog_error")
            })
        })
        .then(resp => {
            setStorageItem("frontlog_click", []);
            setStorageItem("frontlog_keypress", []);
            setStorageItem("frontlog_onhover", []);
            setStorageItem("frontlog_error", []);
        });
    }
}

function resetTimer() {
    if (endPoint !== '') {
        clearTimeout(time);
        time = setTimeout(sending, sendingTiming);
    }
}

export default frontlog;