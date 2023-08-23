import {SerialPortMock, SerialPortMockOpenOptions} from "serialport/dist/serialport-mock";
import {ErrorCallback} from "@serialport/stream";
import {SerialPort} from "serialport";

const SERIAL_PORT_MOCK_PATH = "/dev/ROBOT";

SerialPortMock.binding.createPort(SERIAL_PORT_MOCK_PATH);

/* eslint no-dupe-else-if: "off" */

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
    else if (chunk === "{sc,tst,7.0.1,c}") this.port.emitData("{SC,TST,7.0.1:PASS}\n");
    else if (chunk === "{sc,tst,7.0.0,c}") this.port.emitData("{SC,TST,7.0.0:PASS}\n");
    else if (chunk === "{sc,tst,7.0.1,c}") this.port.emitData("{SC,TST,7.0.1:PASS}\n");
    else if (chunk === "{sc,tst,7.1.0,c}") this.port.emitData("{SC,TST,7.1.0:PASS}\n");
    else if (chunk === "{sc,tst,7.1.1,c}") this.port.emitData("{SC,TST,7.1.1:PASS}\n");
    else if (chunk === "{sc,tst,7.1.2,c}") this.port.emitData("{SC,TST,7.1.2:PASS}\n");
    else if (chunk === "{sc,tst,7.1.3,c}") this.port.emitData("{SC,TST,7.1.3:PASS}\n");
    else if (chunk === "{sc,tst,7.1.4,c}") this.port.emitData("{SC,TST,7.1.4:PASS}\n");
    else if (chunk === "{sc,tst,7.1.5,c}") this.port.emitData("{SC,TST,7.1.5:PASS}\n");
    else if (chunk === "{sc,tst,7.1.6,c}") this.port.emitData("{SC,TST,7.1.6:PASS}\n");
    else if (chunk === "{sc,tst,7.1.7,c}") this.port.emitData("{SC,TST,7.1.7:PASS}\n");
    else if (chunk === "{sc,tst,7.1.8,c}") this.port.emitData("{SC,TST,7.1.8:PASS}\n");
    else if (chunk === "{sc,tst,7.1.9,c}") this.port.emitData("{SC,TST,7.1.9:PASS}\n");
    else if (chunk === "{sc,tst,7.1.10,c}") this.port.emitData("{SC,TST,7.1.10:PASS}\n");
    else if (chunk === "{sc,tst,7.1.11,c}") this.port.emitData("{SC,TST,7.1.11:PASS}\n");
    else if (chunk === "{sc,tst,7.1.12,c}") this.port.emitData("{SC,TST,7.1.12:PASS}\n");
    else if (chunk === "{sc,tst,7.1.13,c}") this.port.emitData("{SC,TST,7.1.13:FAIL}\n");
    else if (chunk === "{sc,tst,7.1.13,c}") this.port.emitData("{SC,TST,7.1.13:FAIL}\n");
    else if (chunk === "{sc,tst,7.1.14,c}") this.port.emitData("{SC,TST,7.1.14:PASS}\n");
    else if (chunk === "{sc,tst,7.1.15,c}") this.port.emitData("{SC,TST,7.1.15:FAIL}\n");
    else if (chunk === "{sc,tst,7.1.15,c}") this.port.emitData("{SC,TST,7.1.15:FAIL}\n");
    else if (chunk === "{sc,tst,7.1.16,c}") this.port.emitData("{SC,TST,7.1.??,x,ERR}\n");
    else if (chunk === "{sc,tst,7.2.0,c}") this.port.emitData("{SC,TST,7.2.??,x,ERR}\n");
    else if (chunk === "{sc,tst,7.2.1,c}") this.port.emitData("{SC,TST,7.2.1:PASS}\n");
    else if (chunk === "{sc,tst,7.2.2,c}") this.port.emitData("{SC,TST,7.2.2:PASS}\n");
    else if (chunk === "{sc,tst,7.2.3,c}") this.port.emitData("{SC,TST,7.2.3:PASS}\n");
    else if (chunk === "{sc,tst,7.2.4,c}") this.port.emitData("{SC,TST,7.2.4:PASS}\n");
    else if (chunk === "{sc,tst,7.2.5,c}") this.port.emitData("{SC,TST,7.2.5:PASS}\n");
    else if (chunk === "{sc,tst,7.2.6,c}") this.port.emitData("{SC,TST,7.2.6:PASS}\n");
    else if (chunk === "{sc,tst,7.2.7,c}") this.port.emitData("{SC,TST,7.2.??,x,ERR}\n");
    else if (chunk === "{sc,tst,7.3.0,c}") this.port.emitData("{SC,TST,7.3.0:PASS 0A:0514d +A:0317d -A:0713d}\n");
    else if (chunk === "{sc,tst,7.3.1,c}") this.port.emitData("{SC,TST,7.3.1:FAIL 0A:0516d +A:0480d -A:0000d}\n");
    else if (chunk === "{sc,tst,7.3.1,c}") this.port.emitData("{SC,TST,7.3.1:PASS 0A:0516d +A:0479d -A:0553d}\n");
    else if (chunk === "{sc,tst,7.3.2,c}") this.port.emitData("{SC,TST,7.3.2:PASS 0A:0518d +A:0477d -A:0556d}\n");
    else if (chunk === "{sc,tst,7.3.3,c}") this.port.emitData("{SC,TST,7.3.3:PASS 0A:0516d +A:0404d -A:0628d}\n");
    else if (chunk === "{sc,tst,7.3.3,c}") this.port.emitData("{SC,TST,7.3.3:PASS 0A:0515d +A:0404d -A:0629d}\n");
    else if (chunk === "{sc,tst,7.3.4,c}") this.port.emitData("{SC,TST,7.3.4:FAIL 0A:0516d +A:0401d -A:0000d}\n");
    else if (chunk === "{sc,tst,7.3.4,c}") this.port.emitData("{SC,TST,7.3.4:FAIL 0A:0517d +A:0401d -A:0000d}\n");
    else if (chunk === "{sc,tst,7.3.4,c}") this.port.emitData("{SC,TST,7.3.4:FAIL 0A:0516d +A:0401d -A:0000d}\n");
    else if (chunk === "{sc,tst,7.3.4,c}") this.port.emitData("{SC,TST,7.3.4:PASS 0A:0517d +A:0401d -A:0631d}\n");
    else if (chunk === "{sc,tst,7.3.4,c}") this.port.emitData("{SC,TST,7.3.4:FAIL 0A:0516d +A:0401d -A:0631d}\n");
    else if (chunk === "{sc,tst,7.3.4,c}") this.port.emitData("{SC,TST,7.3.4:PASS 0A:0517d +A:0401d -A:0632d}\n");
    else if (chunk === "{sc,tst,7.3.5,c}") this.port.emitData("{SC,TST,7.3.5:PASS 0A:0005d +A:0633d -A:0000d}\n");
    else if (chunk === "{sc,tst,7.3.6,c}") this.port.emitData("{SC,TST,7.3.6:PASS 0V:0515d +V:0153d -V:0877d}\n");
    else if (chunk === "{sc,tst,7.3.7,c}") this.port.emitData("{SC,TST,7.3.7:PASS 0V:0514d +V:0155d -V:0875d}\n");
    else if (chunk === "{sc,tst,7.3.8,c}") this.port.emitData("{SC,TST,7.3.8:PASS 0V:0514d +V:0156d -V:0876d}\n");
    else if (chunk === "{sc,tst,7.3.9,c}") this.port.emitData("{SC,TST,7.3.9:PASS 0V:0515d +V:0158d -V:0876d}\n");
    else if (chunk === "{sc,tst,7.3.10,c}") this.port.emitData("{SC,TST,7.3.10:FAIL 0V:0515d +V:0158d -V:0000d}\n");
    else if (chunk === "{sc,tst,7.3.10,c}") this.port.emitData("{SC,TST,7.3.10:PASS 0V:0516d +V:0156d -V:0877d}\n");
    else if (chunk === "{sc,tst,7.3.10,c}") this.port.emitData("{SC,TST,7.3.10:FAIL 0V:0516d +V:0157d -V:0518d}\n");
    else if (chunk === "{sc,tst,7.3.10,c}") this.port.emitData("{SC,TST,7.3.10:FAIL 0V:0516d +V:0156d -V:0518d}\n");
    else if (chunk === "{sc,tst,7.3.11,c}") this.port.emitData("{SC,TST,7.3.??,x,ERR}\n");
    else if (chunk === "{sc,tst,7.3.12,c}") this.port.emitData("{SC,TST,7.3.??,x,ERR}\n");
    else if (chunk === "{sc,tst,7.3.13,c}") this.port.emitData("{SC,TST,7.3.??,x,ERR}\n");
    else if (chunk === "{sc,tst,7.3.14,c}") this.port.emitData("{SC,TST,7.3.14:PASS 0V:0515d +V:0157d -V:0877d}\n");
    else if (chunk === "{sc,tst,7.3.14,c}") this.port.emitData("{SC,TST,7.3.14:PASS 0V:0517d +V:0168d -V:0877d}\n");
    else if (chunk === "{sc,tst,7.3.14,c}") this.port.emitData("{SC,TST,7.3.14:FAIL 0V:0516d +V:0158d -V:0877d}\n");
    else if (chunk === "{sc,tst,7.3.14,c}") this.port.emitData("{SC,TST,7.3.14:PASS 0V:0517d +V:0156d -V:0878d}\n");
    else if (chunk === "{sc,tst,8.0.1,c}") this.port.emitData("{SC,TST,8.0.1:PASS}\n");
    else if (chunk === "{sc,tst,8.0.2,c}") this.port.emitData("{SC,TST,8.0.2:PASS}\n");
    else if (chunk === "{sc,tst,8.0.3,c}") this.port.emitData("{SC,TST,8.0.3:PASS}\n");
    else if (chunk === "{sc,tst,8.0.4,c}") this.port.emitData("{SC,TST,8.0.4:PASS}\n");
    else if (chunk === "{sc,tst,8.5.1,c}") this.port.emitData("{SC,TST,8.5.1:FAIL}\n");
    else if (chunk === "{sc,tst,8.5.2,c}") this.port.emitData("{SC,TST,8.5.2:FAIL}\n");
    else if (chunk === "{sc,tst,8.5.2,c}") this.port.emitData("{SC,TST,8.5.2:FAIL}\n");
    else if (chunk === "{sc,tst,8.5.3,c}") this.port.emitData("{SC,TST,8.5.3:FAIL}\n");
    else if (chunk === "{sc,tst,8.5.3,c}") this.port.emitData("{SC,TST,8.5.3:FAIL}\n");
    else if (chunk === "{sc,tst,7.0.0,c}") this.port.emitData("{SC,TST,7.0.0:PASS}\n");
    else if (chunk === "{sc,tst,7.0.1,c}") this.port.emitData("{SC,TST,7.0.1:PASS}\n");
    else if (chunk === "{sc,tst,8.5.0,c}") this.port.emitData("{SC,TST,8.5.??,x,ERR}\n");
    else if (chunk === "{sc,tst,8.5.1,c}") this.port.emitData("{SC,TST,8.5.1:PASS}\n");
    else if (chunk === "{sc,tst,8.5.2,c}") this.port.emitData("{SC,TST,8.5.2:PASS}\n");
    else if (chunk === "{sc,tst,8.5.3,c}") this.port.emitData("{SC,TST,8.5.3:PASS}\n");
    else if (chunk === "{sc,tst,8.5.4,c}") this.port.emitData("{SC,TST,8.5.4:PASS}\n");
    else if (chunk === "{sc,tst,8.5.5,c}") this.port.emitData("{SC,TST,8.5.??,x,ERR}\n");
    else if (chunk === "{sc,tst,8.6.0,c}") this.port.emitData("{SC,TST,8.6.??,x,ERR}\n");
    else if (chunk === "{sc,tst,8.6.1,c}") this.port.emitData("{SC,TST,8.6.1:PASS}\n");
    else if (chunk === "{sc,tst,8.6.2,c}") this.port.emitData("{SC,TST,8.6.2:PASS}\n");
    else if (chunk === "{sc,tst,8.6.3,c}") this.port.emitData("{SC,TST,8.6.3:PASS}\n");
    else if (chunk === "{sc,tst,8.6.4,c}") this.port.emitData("{SC,TST,8.6.??,x,ERR}\n");
    else if (chunk === "{sc,tst,9.0.1,c}") this.port.emitData("{SC,TST,9.0.1:PASS Vint:0846d}\n");
    else if (chunk === "{sc,tst,9.0.2,c}") this.port.emitData("{SC,TST,9.0.2:PASS Vint:0774d}\n");
    else if (chunk === "{sc,tst,9.0.3,c}") this.port.emitData("{SC,TST,9.0.3:PASS Vint:0444d}\n");
    else if (chunk === "{sc,tst,9.0.4,c}") this.port.emitData("{SC,TST,9.0.4:FAIL Vint:0943d}\n");
    else if (chunk === "{sc,tst,9.1.0,c}") this.port.emitData("{SC,TST,9.1.0:PASS +15V :15.27V}\n");
    else if (chunk === "{sc,tst,9.1.1,c}") this.port.emitData("{SC,TST,9.1.1:PASS +15V :15.24V}\n");
    else if (chunk === "{sc,tst,9.1.2,c}") this.port.emitData("{SC,TST,9.1.2:FAIL +15V :00.01V}\n");
    else if (chunk === "{sc,tst,9.1.3,c}") this.port.emitData("{SC,TST,9.1.3:PASS +15V :15.24V}\n");
    else if (chunk === "{sc,tst,9.1.4,c}") this.port.emitData("{SC,TST,9.1.4:PASS +15V :15.24V}\n");
    else if (chunk === "{sc,tst,9.1.5,c}") this.port.emitData("{SC,TST,9.1.5:PASS +15V :15.26V}\n");
    else if (chunk === "{sc,tst,9.1.6,c}") this.port.emitData("{SC,TST,9.1.6:PASS +15V :15.28V}\n");
    else if (chunk === "{sc,tst,9.1.7,c}") this.port.emitData("{SC,TST,9.1.7:PASS +15V :15.23V}\n");
    else if (chunk === "{sc,tst,9.1.8,c}") this.port.emitData("{SC,TST,9.1.8:PASS +15V :15.23V}\n");
    else if (chunk === "{sc,tst,9.1.9,c}") this.port.emitData("{SC,TST,9.1.9:FAIL +15VG:17.58V}\n");
    else if (chunk === "{sc,tst,9.1.10,c}") this.port.emitData("{SC,TST,9.1.10:FAIL +15VG:17.57V}\n");
    else if (chunk === "{sc,tst,9.1.11,c}") this.port.emitData("{SC,TST,9.1.11:FAIL -15V :17.26V}\n");
    else if (chunk === "{sc,tst,9.1.12,c}") this.port.emitData("{SC,TST,9.1.12:FAIL -15V :17.25V}\n");
    else if (chunk === "{sc,tst,9.1.13,c}") this.port.emitData("{SC,TST,9.1.13:FAIL -15V :17.25V}\n");
    else if (chunk === "{sc,tst,9.1.14,c}") this.port.emitData("{SC,TST,9.1.14:FAIL -15V :17.24V}\n");
    else if (chunk === "{sc,tst,9.1.15,c}") this.port.emitData("{SC,TST,9.1.15:FAIL -15V :00.01V}\n");
    else if (chunk === "{sc,tst,9.1.16,c}") this.port.emitData("{SC,TST,9.1.??,x,ERR}\n");
    else if (chunk === "{sc,tst,a.0.0,c}") this.port.emitData("{SC,TST,a.0.??,x,ERR}\n");
    else if (chunk === "{sc,tst,a.0.1,c}") this.port.emitData("{SC,TST,a.0.1:PASS FRQ:004950Hz TON:0098.95us}\n");
    else if (chunk === "{sc,tst,a.0.2,c}") this.port.emitData("{SC,TST,a.0.2:PASS FRQ:004950Hz TON:0099.06us}\n");
    else if (chunk === "{sc,tst,a.0.3,c}") this.port.emitData("{SC,TST,a.0.3:PASS FRQ:004950Hz TON:0098.96us}\n");
    else if (chunk === "{sc,tst,a.0.4,c}") this.port.emitData("{SC,TST,a.0.4:PASS FRQ:004950Hz TON:0099.06us}\n");
    else if (chunk === "{sc,tst,a.0.5,c}") this.port.emitData("{SC,TST,a.0.5:PASS FRQ:004950Hz TON:0099.06us}\n");
    else if (chunk === "{sc,tst,a.0.6,c}") this.port.emitData("{SC,TST,a.0.6:PASS FRQ:004950Hz TON:0098.96us}\n");
    else if (chunk === "{sc,tst,a.0.7,c}") this.port.emitData("{SC,TST,a.0.7:PASS FRQ:003999Hz TON:0112.52us}\n");
    else if (chunk === "{sc,tst,a.0.8,c}") this.port.emitData("{SC,TST,a.0.8:PASS FRQ:003999Hz TON:0112.51us}\n");
    else if (chunk === "{sc,tst,a.0.9,c}") this.port.emitData("{SC,TST,a.0.9:FAIL FRQ:000000Hz TON:0000.00us}\n");
    else if (chunk === "{sc,tst,a.0.10,c}") this.port.emitData("{SC,TST,a.0.10:PASS FRQ:007998Hz TON:0050.03us}\n");
    else if (chunk === "{sc,tst,a.0.11,c}") this.port.emitData("{SC,TST,a.0.11:FAIL FRQ:000000Hz TON:0000.00us}\n");
    else if (chunk === "{sc,tst,a.0.12,c}") this.port.emitData("{SC,TST,a.0.12:FAIL FRQ:000000Hz TON:0000.00us}\n");
    else if (chunk === "{sc,tst,a.0.13,c}") this.port.emitData("{SC,TST,a.0.??,x,ERR}\n");
    else if (chunk === "{sc,tst,b.0.1,c}") this.port.emitData("{SC,TST,b.0.1:PASS}\n");
    else this.port.emitData(`${chunk.toString()}\n`);
    return sent;
  }

  asSerialPort<T extends SerialPort>(): T {
    return this as unknown as T;
  }
}
