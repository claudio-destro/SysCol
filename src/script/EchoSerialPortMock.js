const {SerialPortMock} = require("serialport");

const SERIAL_PORT_MOCK_PATH = "/dev/ROBOT";

SerialPortMock.binding.createPort(SERIAL_PORT_MOCK_PATH);

class EchoSerialPortMock extends SerialPortMock {
  constructor(options, openCallback) {
    super({...options, path: SERIAL_PORT_MOCK_PATH}, openCallback);
  }

  write(chunk, encoding, callback) {
    const sent = super.write(chunk, encoding, callback);
    if (chunk === "{sc,ver,?}") return this.port.emitData("{SC,VER,FWSC:1.4 HWSC:1.2 HWRM:1.3}\n");
    if (chunk === "{sc,tst,7.0.1,c}") return this.port.emitData("{SC,TST,7.0.1:FAIL}\n");
    if (chunk === "{sc,tst,9.0.1,c}") return this.port.emitData("{SC,TST,9.0.1:PASS Vint:0839d}\r\n");
    if (chunk === "{sc,tst,19}") return this.port.emitData("{SC,TST,?.x.xx,x,ERR}\r\n");
    this.port.emitData(`${chunk.toString()}\r\n`);
    return sent;
  }
}

module.exports = {
  SERIAL_PORT_MOCK_PATH,
  EchoSerialPortMock,
};
