var storage = 'local';
var logByAttribute = true;
var logClicks = true;
var logKeyPress = true;
var logErrors = true;
var logOnHover = true;
var onHoverTime = 1000;
var timeStamp = 0;

export function setup(setup) {
    storage = setup.storage === undefined ? storage: setup.storage;
    logByAttribute = setup.logByAttribute === undefined ? logByAttribute: setup.logByAttribute;
    logClicks = setup.logClicks === undefined ? logClicks: setup.logClicks;
    logKeyPress = setup.logKeyPress === undefined ? logKeyPress: setup.logKeyPress;
    logErrors = setup.logErrors === undefined ? logErrors: setup.logErrors;
    logOnHover = setup.logOnHover === undefined ? logOnHover: setup.logOnHover;
    onHoverTime = setup.onHoverTime === undefined ? onHoverTime: setup.onHoverTime;
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

//Logging Click
function clickMouse(event) {
    if (logClicks && canSave(event.target, "click")) {
        var clicks = getStorageItem("frontlog_click");
        clicks.push(
            {
                date: new Date(),
                tag: event.target.tagName,
                id: event.target.id,
                name: event.target.name,
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
        var keyPress = getStorageItem("frontlog_keypress");
        keyPress.push(
            {
                date: new Date(),
                id: event.charCode || event.keyCode,
                name: event.code,
                value: event.key
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

        var errors = getStorageItem("frontlog_error");
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
        var errors = getStorageItem("frontlog_error");
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
    if (logOnHover && timeStamp >= onHoverTime && canSave(event.target, "onhover")) {
        var hover = getStorageItem("frontlog_onhover");
        hover.push(
            {
                date: new Date(),
                tag: event.target.tagName,
                id: event.target.id,
                name: event.target.name,
                timeStamp: timeStamp
            }
        );
        setStorageItem("frontlog_onhover", hover);
    }
}
document.addEventListener('mouseout', mouseOut);