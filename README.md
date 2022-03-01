# Front Log Storage
## _Ferramenta de registro de logs para o frontend de aplicações Web_

[![Status](https://img.shields.io/badge/npm-v1.0.0-green.svg)](https://www.npmjs.com/package/frontlog-storage)

## Instalação

Instalando o pacote.

```sh
npm install frontlog-storage
```

Importação

```sh
import * as FrontLog from "frontlog-storage";
```

Objeto de configuração

```sh
FrontLog.setup({
    storage: 'local|session',
    logByAttribute: boolean,
    logClicks: boolean,
    logKeyPress: boolean,
    logErrors: boolean,
    logOnHover: boolean,
    onHoverTime: Integer(milissegundos),
});
```