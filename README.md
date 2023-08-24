# SysCol

Read and execute simple test scripts using [Node SerialPort](https://serialport.io), based on [Electron](https://www.electronjs.org).

## Getting Started

Pre-requisites:

- [Node.js](https://nodejs.org/)

```bash
npm install
npm start
```

## Packaging

```bash
npm run make
```

Eventually, the final zip will be in

`out/make/zip/[PLATFORM]/[ARCH]/SysCol-[PLATFORM]-[ARCH]-[VERSION].zip`

## Communication Protocol

### Command

A command has the following format:

```
{sc, xxx, yyyy1, ... zzzzN}
```

- start with `"{sc,"` (`sc` is for SysCol)
- end with `"}"`
- `xxx` is the 3-letter command code lowercase
- `y` is the first parameter
- `z` is the Nth parameter

### Response

A response has the same format of the command, except it is all uppercase.

### Macro

A macro starts with a `@`.

- `@open COM BAUD_RATE-START_BITS-PARITY-STOP_BITS` - open the given COM port
- `@timeout MILLISECONDS` - set the execution timeout in milliseconds
- `@wait MILLISECONDS` - stop execution for the given milliseconds
- `@close` - close the COM port
