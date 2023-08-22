const {SerialPort} = require("serialport");
const {EchoSerialPortMock} = require("./EchoSerialPortMock");
const {parseSerialPortConfiguration} = require("./parseSerialPortOptions");

const openSerialPort = async (path, args) => {
  const options = {
    ...parseSerialPortConfiguration(args),
    autoOpen: false,
    path,
  };
  const mock = process.env.SERIAL_PORT_MOCK === "1";
  const serialPort = mock ? new EchoSerialPortMock(options) : new SerialPort(options);
  return new Promise((resolve, reject) => {
    serialPort.open(err => (err ? reject(err) : resolve(serialPort)));
  });
};

module.exports = {
  openSerialPort,
};
