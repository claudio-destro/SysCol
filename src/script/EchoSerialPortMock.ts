import {SerialPortMock, SerialPortMockOpenOptions} from "serialport/dist/serialport-mock";
import {ErrorCallback} from "@serialport/stream";
import {SerialPort} from "serialport";

const SERIAL_PORT_MOCK_PATH = "/dev/ROBOT";

SerialPortMock.binding.createPort(SERIAL_PORT_MOCK_PATH);

export class EchoSerialPortMock extends SerialPortMock {
  constructor(options: SerialPortMockOpenOptions, openCallback?: ErrorCallback) {
    super({...options, path: SERIAL_PORT_MOCK_PATH}, openCallback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  write(chunk: any, encodingOrCallback: BufferEncoding | ErrorCallback, callback?: ErrorCallback): boolean {
    const params: {
      encoding: BufferEncoding;
      callback?: ErrorCallback;
    } =
      typeof encodingOrCallback === "function"
        ? {
            encoding: "utf8",
            callback: encodingOrCallback,
          }
        : {
            encoding: encodingOrCallback,
            callback,
          };
    const sent = super.write(chunk, params.encoding, params.callback);
    if (chunk === "{sc,ver,?}") this.port.emitData("{SC,VER,FWSC:1.4 HWSC:1.2 HWRM:1.3}\n");
    else if (chunk === "{sc,tst,7.0.1,c}") this.port.emitData("{SC,TST,7.0.1:FAIL}\n");
    else if (chunk === "{sc,tst,9.0.1,c}") this.port.emitData("{SC,TST,9.0.1:PASS Vint:0839d}\r\n");
    else if (chunk === "{sc,tst,19}") this.port.emitData("{SC,TST,?.x.xx,x,ERR}\r\n");
    else this.port.emitData(`${chunk.toString()}\r\n`);
    return sent;
  }

  asSerialPort<T extends SerialPort>(): T {
    return this as unknown as T;
  }
}
