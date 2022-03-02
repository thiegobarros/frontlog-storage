# Front Log Storage
### _Ferramenta de registro de logs para o frontend de aplicações Web_

[![Status](https://img.shields.io/badge/npm-v1.1.0-green.svg)](https://www.npmjs.com/package/frontlog-storage)

## Instalação

#### Via NPM

```sh
npm install frontlog-storage
```

#### Importação

```sh
import * as FrontLog from "frontlog-storage";
```

#### Configurações

```sh
FrontLog.setup({
    storage: 'local|session', //Seleciona qual storage irá ser usado, padrão: LocalStorage
    logByAttribute: boolean, //Torna a seleção pelo atributo "data-front-log" nos elementos HTML, padrão: true 
    logClicks: boolean, //Realiza o log dos clicks nos elementos, padrão: true
    logKeyPress: boolean, //Realiza o log das teclas pressionadas nos elementos, padrão: true
    logErrors: boolean, //Realiza o log dos erros gerados no console e na janela do navegador, padrão: true
    logOnHover: boolean, //Realiza o log do evento "on hover" do mouse nos elementos, padrão: true
    onHoverTime: Integer(milissegundos), //Parametro de tempo para o log de "on hover", padrão: 1000
});
```

#### Utilizando o _data-front-log_

```sh
<p id="elem_id" name="elem_name" data-front-log></p> //Pega todos os logs disponivéis
<p id="elem_id" name="elem_name" data-front-log="click"></p> //Pega somente os eventos de "click" no elemento
<input id="elem_id" name="elem_name" data-front-log="keypress"/> //Pega somente os eventos de "keypress" no elemento
<p id="elem_id" name="elem_name" data-front-log="onhover"></p> //Pega somente os eventos de "on hover" no elemento
```

## Variáveis no Storage

| Chave | Valor |
| ------ | ------ |
| frontlog_click | Lista que guarda as referências dos elementos clicados |
| frontlog_keypress | Lista que guarda as referências das teclas pressionadas nos elementos |
| frontlog_onhover | Lista que guarda as referências dos elementos que tiveram o "pointer" em cima a partir de X milissegundos |
| frontlog_error | Lista que guarda as referências dos dos erros mostrados no console ou na janela do navegador |

## Objetos

#### Click

```sh
{
    date: //pega data e hora que o elemento foi clicado,
    tag: //tag do elemento,
    id: //id do elemento,
    name: //name do elemento,
    element: //elemento em forma de string
}
```

#### Key Press

```sh
{
    date: //Pega data e hora que a tecla foi pressionada,
    id: //Código da tecla,
    name: //Nome da tecla,
    value: //A tecla
}
```

#### On Hover

```sh
{
    date: //Pega data e hora que o "pointer" deixou o elemento,
    tag: //Tag do elemento,
    id: //Id do elemento,
    name: //Name do elemento,
    timeStamp: //Quanto tempo o "pointer" ficou no elemento (milissegundos)
}
```

#### Error

```sh
{
    date: //Pega data e hora da ocorrência,
    type: 'window|console', //Tipo do erro
    error: //Todas as informações passadas pelo erro
}
```