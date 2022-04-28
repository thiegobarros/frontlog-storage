# Frontlog Storage
### _A logging tool for the front-end of web applications_

[![Status](https://img.shields.io/badge/npm-v1.3.1-green.svg)](https://www.npmjs.com/package/frontlog-storage)

## Instalation

#### NPM

```sh
npm install frontlog-storage
```

#### Import

```sh
import frontlog from "frontlog-storage";
```

#### How to use _data-front-log_

```sh
<p id="elem_id" name="elem_name" data-front-log></p> (Get all available logs)
<p id="elem_id" name="elem_name" data-front-log="click"></p> (Catch only the "click" events on the element)
<input id="elem_id" name="elem_name" data-front-log="keypress"/> (Gets only the "keypress" events on the element)
<p id="elem_id" name="elem_name" data-front-log="onhover"></p> (Catch only the "on hover" events on the element)
```

#### Configurations

```sh
frontLog({
    storage: 'local|session', (Selects which storage will be used, default: local)
    logByAttribute: boolean, (Makes selection by "data-front-log" attribute on HTML elements, default: true)
    logClicks: boolean, (Logs clicks on elements, default: true)
    logKeyPress: boolean, (Logs key presses on elements, default: true)
    logErrors: boolean, (Log errors generated in console and browser window, default: true)
    logOnHover: boolean, (Logs mouse "on hover" event on elements, default: true)
    onHoverTiming: Integer(milliseconds), (Time parameter for "on hover" log, default: 1000)
    endPoint: 'URL', (Endpoint for sending information via fetch, default: "")
    sendingTiming: Integer(milliseconds), (Time parameter for sending information to the server, default: 10000)
    headers: array[], (Parameter to customize request headers, default: [ ['Content-Type', 'application/json'] ])
});
```

## Storage keys

| Key | Value |
| ------ | ------ |
| frontlog_click | List that stores the references of the clicked elements |
| frontlog_keypress | List that stores the references of the pressed keys in the elements |
| frontlog_onhover | List that stores the references of the elements that had the "pointer" on top from X milliseconds |
| frontlog_error | List that stores the references of the errors shown in the console or in the browser window |

## Objects

#### Click

```sh
{
    date: (Event date and time),
    tag: (Element tag),
    id: (Element id),
    name: (Element name),
    element: (String-shaped element)
}
```

#### Key Press

```sh
{
    date: (Event date and time),
    element_id: (Element id),
    element_name: (Element name),
    key_id: (The key code),
    key_name: (The key name),
    key_value: (The value of the key)
}
```

#### On Hover

```sh
{
    date: (Event date and time),
    tag: (Element tag),
    id: (Element id),
    name: (Element name),
    timeStamp: (How long the "pointer" was on the element [milliseconds])
}
```

#### Error

```sh
{
    date: (Error date and time),
    type: (Error type [window|console]),
    error: (Error information)
}
```

## Preview

<https://thiegobarros.github.io/frontlog-test/>