# SysCol

Read and execute simple test scripts using [Node SerialPort](https://serialport.io) and [Electron](https://www.electronjs.org).

## Getting Started

Pre-requisites:

- [Node.js](https://nodejs.org/)
- [git](https://git-scm.com)

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

## Packaging the Application

```shell
npm run make
```

Eventually, the final distributable ZIP will be in

`out/make/zip/[PLATFORM]/[ARCH]/SysCol-[PLATFORM]-[ARCH]-[VERSION].zip`

### Examples

- Windows
  - `out\make\zip\squirrel.windows\x64\SysCol-1.0.0 Setup.exe`
- macOS
    - `out/make/zip/darwin/x64/SysCol-darwin-x64-1.0.0.zip`
    - `out/make/zip/darwin/arm64/SysCol-darwin-arm64-1.0.0.zip`


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

- `@close_log_file` - close the log file
- `@close_serial_port` - close the COM port
- `@confirm_test PROMPT TEST_ID LABEL_1 VALUE_1 LABEL_2 VALUE_2 SUCCESS_VALUE` - fake test
- `@echo` - print a debug text line
- `@if fail | pass COMMAND` - execute the specified command on given condition
- `@open_log_file FILENAME FORMAT` - write a log file in the given format (`full` or `tests-only`) 
- `@open_serial_port COM BAUD_RATE-START_BITS-PARITY-STOP_BITS` - open the given COM port
- `@run_script SCRIPT_FILE` - run sub script (serial port can be reused)
- `@timeout TIME` - set the execution timeout of subsequent commands
- `@wait TIME` - stop execution for the given amount of time

## GUI

- Windows
  - `Control` + `N` - `File` > `New Window` - open a script in a new window
  - `Control` + `O` - `File` > `Open Script` - open a script in the current window
  - `Control` + `W` - `File` > `Close Window` - close the current window
  - `Alt` + `F4` - `File` > `Exit` - quit the application
  - `Control` + `R` - `Script` > `Run` - (reload and) run the current script
  - `F8` - `Script` > `Interrupt` - interrupt current script execution

- macOS
  - `Command` + `N` - `File` > `New Window` - open a script in a new window
  - `Command` + `O` - `File` > `Open Script` - open a script in the current window
  - `Command` + `W` - `File` > `Close Window` - close the current window
  - `Command` + `Q` - `SysCol` > `Quit` - quit the application
  - `Command` + `R` - `Script` > `Run` - (reload and) run the current script
  - `Command` + `.` - `Script` > `Interrupt` - interrupt current script execution