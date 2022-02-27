var storage = 'local';
var logByAttr = true;
var logClicks = true;
var logErrors = true;
var logKeyPress = true;
var logHover = true;
var timeStamp = 0;
var minTime = 1000;

export function setup(setup) {
    storage = setup.storage === undefined ? storage: setup.storage;
    logClicks = setup.logClicks === undefined ? logClicks: setup.logClicks;
    logErrors = setup.logErrors === undefined ? logErrors: setup.logErrors;
    logKeyPress = setup.logKeyPress === undefined ? logKeyPress: setup.logKeyPress;
    logHover = setup.logHover === undefined ? logHover: setup.logHover;
    minTime = setup.minTime === undefined ? minTime: setup.minTime;
}

function getStorageItem (param) {
    return (storage === 'session') ? JSON.parse(sessionStorage.getItem(param) || '[]') : JSON.parse(localStorage.getItem(param) || '[]');
}

function setStorageItem (param, obj) {
    (storage === 'session') ? sessionStorage.setItem(param, JSON.stringify(obj)) : localStorage.setItem(param, JSON.stringify(obj));
}

function canSave (elem, param) {
    if (!logByAttr) return true;
    if (logByAttr && elem.dataset.frontLog==="true") return true;
    if (logByAttr && param==="click" && elem.dataset.frontLog==="click") return true;
    if (logByAttr && param==="keypress" && elem.dataset.frontLog==="keypress") return true;
    if (logByAttr && param==="hover" && elem.dataset.frontLog==="hover") return true;
    return false;
}

//Log click
function clickMouse(event) {
    if (logClicks && canSave(event.target, "click")) {
        var clicks = getStorageItem("log_clicks");
        clicks.push(
            {
                date: new Date(),
                tag: event.target.tagName,
                id: event.target.id,
                name: event.target.name,
                element: event.target.outerHTML
            }
        );
        setStorageItem("log_clicks", clicks);
    }
}
document.addEventListener('click', clickMouse);

//Log key press
function keyPress(event) {
    if (logKeyPress && canSave(event.target, "keypress")) {
        var keyPress = getStorageItem("log_keyPress");
        keyPress.push(
            {
                date: new Date(),
                id: event.charCode || event.keyCode,
                name: event.code,
                value: event.key
            }
        );
        setStorageItem("log_keyPress", keyPress);
    }
}
document.addEventListener('keypress', keyPress);

//log errors
console.defaultError = console.error.bind(console);
console.errors = [];

console.error = function(){
    if (logErrors) {
        console.defaultError.apply(console, arguments);
        console.errors.push(Array.from(arguments));

        var errors = getStorageItem("log_errors");
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
        setStorageItem("log_errors", errors);
    }
}

window.onerror = function(message, source, lineno, colno) {
    if (logErrors) {
        var errors = getStorageItem("log_errors");
        errors.push(
            {
                date: new Date(),
                type: "window",
                error: `Line: ${lineno} Column: ${colno} Source: ${source} Message: ${message}`
            }
        );
        setStorageItem("log_errors", errors);
    }
    return false;
};

//log hover
function mouseOver(event) {
    timeStamp = event.timeStamp;
}
document.addEventListener('mouseover', mouseOver);

function mouseOut(event) {
    timeStamp = event.timeStamp - timeStamp;
    if (logHover && timeStamp >= minTime && canSave(event.target, "hover")) {
        var hover = getStorageItem("log_hover");
        hover.push(
            {
                date: new Date(),
                tag: event.target.tagName,
                id: event.target.id,
                name: event.target.name,
                timeStamp: timeStamp
            }
        );
        setStorageItem("log_hover", hover);
    }
}
document.addEventListener('mouseout', mouseOut);