# SysCol

Read and execute simple test scripts using [Node SerialPort](https://serialport.io) and [Electron](https://www.electronjs.org).

## Getting Started

Pre-requisites:

- [Node.js](https://nodejs.org/)
- [git](https://git-scm.com) (optional)

Clone the repository using `git` and `cd` into it:

```shell
git clone https://github.com/claudio-destro/SysCol
cd SysCol
```

Alternatively

1. download the ZIP
2. unpack it
3. `cd` into it

Then install and start the project for local development:

```shell
npm install
npm start
```

## Packaging the application

```shell
npm run make
```

Eventually, the final distributable ZIP will be in

`out/make/zip/[PLATFORM]/[ARCH]/SysCol-[PLATFORM]-[ARCH]-[VERSION].zip`

## Communication Protocol and Commands

### Command

A command has the following format:

```
{sc, xxx, yyyy1, ... zzzzN}
```

- starts with `"{sc,"` (`sc` stands for SysCol)
- ends with `"}"`
- `xxx` is the 3-letter command code lowercase
- `y` is the first parameter
- `z` is the Nth parameter

### Response

A response has the same format of the command, except

- it is all uppercase.
- ends with `"}\r\n"`

### Macro

A macro starts with a `@`.

- `@open COM BAUD_RATE-START_BITS-PARITY-STOP_BITS` - open the given COM port
- `@timeout MILLISECONDS` - set the execution timeout in milliseconds
- `@wait MILLISECONDS` - stop execution for the given milliseconds
- `@close` - close the COM port
