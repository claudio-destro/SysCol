import {SerialPortMock, SerialPortMockOpenOptions} from "serialport/dist/serialport-mock";
import {ErrorCallback} from "@serialport/stream";

const SERIAL_PORT_MOCK_PATH = "/dev/ROBOT";

SerialPortMock.binding.createPort(SERIAL_PORT_MOCK_PATH);

/* eslint no-dupe-else-if: "off" */

// prettier-ignore
const COMMAND_RESPONSE: Record<string, string> = {
  "{sc,ver,?}": `{SC,VER,FWSC:1.4 HWSC:1.2 HWRM:1.3}`,
  "{sc,par,7.3,g,?}": "{SC,PAR,7.3,G:00000,00430,00430,00000,15000,15000,00000,15000,15000,00000,10000,10000,00000,10000,10000,00000,00430,00000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,07000,07000,00000,00000,00000,00000,00000,00000,00000,00000,00000,00000,07000,07000}",
  "{sc,par,7.3,e,?}": "{SC,PAR,7.3,E:00512,00313,00709,00512,00475,00547,00512,00475,00547,00512,00399,00625,00512,00399,00625,00000,00626,00000,00512,00148,00876,00512,00148,00876,00512,00148,00876,00512,00148,00876,00512,00148,00876,00000,00000,00000,00000,00000,00000,00000,00000,00000,00512,00148,00876}",
  "{sc,par,8.5,g,?}": "{SC,PAR,8.5,G,R:00000,00000,00000,00000,15000,15000,00000,15000,15000,00000,10000,10000,00000,10000,10000,00000,07000,07000,00000,07000,07000,00000,07000,07000}",
  "{sc,par,8.5,t,?}": "{SC,PAR,8.5,T,R:00000,00000,00000,00000,00428,00522,00000,00428,00522,00000,00372,00428,00000,00372,00428,00000,00130,00167,00000,00130,00167,00000,00130,00167}",
  "{sc,par,8.5,g,w:00000,00000,00000,00000,15000,15000,00000,15000,15000,00000,10000,10000,00000,10000,10000,00000,07000,07000,00000,07000,07000,00000,07000,07000}": "{SC,PAR,8.5,G,W:00000,00000,00000,00000,15000,15000,00000,15000,15000,00000,10000,10000,00000,10000,10000,00000,07000,07000,00000,07000,07000,00000,07000,07000}",
  "{sc,par,a.0,r,?}": "{SC,PAR,a.0,R,R:00000,00000,04950,09896,04950,09906,04950,09896,04950,09906,04950,09906,04950,09896,03999,11251,03999,11252,00000,00000,07998,05003,00000,00000,00000,00000}",
  "{sc,par,a.0,e,?}": "{SC,PAR,a.0,E,R:00000,00000,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,04000,11250,04000,11250,04000,11250,08000,05000,08000,05000,08000,05000}",
  "{sc,par,a.0,d,?}": "{SC,PAR,a.0,D,R:00000,00000,00100,00050,00100,00050,00100,0005000100,00050,00100,00050,00100,00050,00080,00030,00080,00030,00080,00030,00160,0050,00160,00050,00160,00050}",
  "{sc,par,a.0,e,w:00000,00000,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,04000,11250,04000,11250,04000,11250,08000,05000,08000,05000,08000,05000}": "{SC,PAR,a.0,E,W:00002,00055,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,05000,09900,04000,11250,04000,11250,04000,11250,08000,05000,08000,05000,08000,05000}",
  "{sc,tst,7.0.1,c}": `{SC,TST,7.0.1:PASS}`,
  "{sc,tst,7.0.0,c}": `{SC,TST,7.0.0:PASS}`,
  "{sc,tst,7.1.0,c}": `{SC,TST,7.1.0:PASS}`,
  "{sc,tst,7.1.1,c}": `{SC,TST,7.1.1:PASS}`,
  "{sc,tst,7.1.2,c}": `{SC,TST,7.1.2:PASS}`,
  "{sc,tst,7.1.3,c}": `{SC,TST,7.1.3:PASS}`,
  "{sc,tst,7.1.4,c}": `{SC,TST,7.1.4:PASS}`,
  "{sc,tst,7.1.5,c}": `{SC,TST,7.1.5:PASS}`,
  "{sc,tst,7.1.6,c}": `{SC,TST,7.1.6:PASS}`,
  "{sc,tst,7.1.7,c}": `{SC,TST,7.1.7:PASS}`,
  "{sc,tst,7.1.8,c}": `{SC,TST,7.1.8:PASS}`,
  "{sc,tst,7.1.9,c}": `{SC,TST,7.1.9:PASS}`,
  "{sc,tst,7.1.10,c}": `{SC,TST,7.1.10:PASS}`,
  "{sc,tst,7.1.11,c}": `{SC,TST,7.1.11:PASS}`,
  "{sc,tst,7.1.12,c}": `{SC,TST,7.1.12:PASS}`,
  "{sc,tst,7.1.13,c}": `{SC,TST,7.1.13:FAIL}`,
  "{sc,tst,7.1.14,c}": `{SC,TST,7.1.14:PASS}`,
  "{sc,tst,7.1.15,c}": `{SC,TST,7.1.15:FAIL}`,
  "{sc,tst,7.1.16,c}": `{SC,TST,7.1.??,x,ERR}`,
  "{sc,tst,7.2.0,c}": `{SC,TST,7.2.??,x,ERR}`,
  "{sc,tst,7.2.1,c}": `{SC,TST,7.2.1:PASS}`,
  "{sc,tst,7.2.2,c}": `{SC,TST,7.2.2:PASS}`,
  "{sc,tst,7.2.3,c}": `{SC,TST,7.2.3:PASS}`,
  "{sc,tst,7.2.4,c}": `{SC,TST,7.2.4:PASS}`,
  "{sc,tst,7.2.5,c}": `{SC,TST,7.2.5:PASS}`,
  "{sc,tst,7.2.6,c}": `{SC,TST,7.2.6:PASS}`,
  "{sc,tst,7.2.7,c}": `{SC,TST,7.2.??,x,ERR}`,
  "{sc,tst,7.3.0,c}": `{SC,TST,7.3.0:PASS 0A:0514d +A:0317d -A:0713d}`,
  "{sc,tst,7.3.1,c}": `{SC,TST,7.3.1:FAIL 0A:0516d +A:0480d -A:0000d}`,
  "{sc,tst,7.3.2,c}": `{SC,TST,7.3.2:PASS 0A:0518d +A:0477d -A:0556d}`,
  "{sc,tst,7.3.3,c}": `{SC,TST,7.3.3:PASS 0A:0516d +A:0404d -A:0628d}`,
  "{sc,tst,7.3.4,c}": `{SC,TST,7.3.4:FAIL 0A:0516d +A:0401d -A:0000d}`,
  "{sc,tst,7.3.5,c}": `{SC,TST,7.3.5:PASS 0A:0005d +A:0633d -A:0000d}`,
  "{sc,tst,7.3.6,c}": `{SC,TST,7.3.6:PASS 0V:0515d +V:0153d -V:0877d}`,
  "{sc,tst,7.3.7,c}": `{SC,TST,7.3.7:PASS 0V:0514d +V:0155d -V:0875d}`,
  "{sc,tst,7.3.8,c}": `{SC,TST,7.3.8:PASS 0V:0514d +V:0156d -V:0876d}`,
  "{sc,tst,7.3.9,c}": `{SC,TST,7.3.9:PASS 0V:0515d +V:0158d -V:0876d}`,
  "{sc,tst,7.3.10,c}": `{SC,TST,7.3.10:FAIL 0V:0515d +V:0158d -V:0000d}`,
  "{sc,tst,7.3.11,c}": `{SC,TST,7.3.??,x,ERR}`,
  "{sc,tst,7.3.12,c}": `{SC,TST,7.3.??,x,ERR}`,
  "{sc,tst,7.3.13,c}": `{SC,TST,7.3.??,x,ERR}`,
  "{sc,tst,7.3.14,c}": `{SC,TST,7.3.14:PASS 0V:0515d +V:0157d -V:0877d}`,
  "{sc,tst,8.0.1,c}": `{SC,TST,8.0.1:PASS}`,
  "{sc,tst,8.0.2,c}": `{SC,TST,8.0.2:PASS}`,
  "{sc,tst,8.0.3,c}": `{SC,TST,8.0.3:PASS}`,
  "{sc,tst,8.0.4,c}": `{SC,TST,8.0.4:PASS}`,
  "{sc,tst,8.5.1,c}": `{SC,TST,8.5.1:FAIL}`,
  "{sc,tst,8.5.2,c}": `{SC,TST,8.5.2:FAIL}`,
  "{sc,tst,8.5.3,c}": `{SC,TST,8.5.3:FAIL}`,
  "{sc,tst,8.5.0,c}": `{SC,TST,8.5.??,x,ERR}`,
  "{sc,tst,8.5.4,c}": `{SC,TST,8.5.4:PASS}`,
  "{sc,tst,8.5.5,c}": `{SC,TST,8.5.??,x,ERR}`,
  "{sc,tst,8.6.0,c}": `{SC,TST,8.6.??,x,ERR}`,
  "{sc,tst,8.6.1,c}": `{SC,TST,8.6.1:PASS}`,
  "{sc,tst,8.6.2,c}": `{SC,TST,8.6.2:PASS}`,
  "{sc,tst,8.6.3,c}": `{SC,TST,8.6.3:PASS}`,
  "{sc,tst,8.6.4,c}": `{SC,TST,8.6.??,x,ERR}`,
  "{sc,tst,9.0.1,c}": `{SC,TST,9.0.1:PASS Vint:0846d}`,
  "{sc,tst,9.0.2,c}": `{SC,TST,9.0.2:PASS Vint:0774d}`,
  "{sc,tst,9.0.3,c}": `{SC,TST,9.0.3:PASS Vint:0444d}`,
  "{sc,tst,9.0.4,c}": `{SC,TST,9.0.4:FAIL Vint:0943d}`,
  "{sc,tst,9.1.0,c}": `{SC,TST,9.1.0:PASS +15V :15.27V}`,
  "{sc,tst,9.1.1,c}": `{SC,TST,9.1.1:PASS +15V :15.24V}`,
  "{sc,tst,9.1.2,c}": `{SC,TST,9.1.2:FAIL +15V :00.01V}`,
  "{sc,tst,9.1.3,c}": `{SC,TST,9.1.3:PASS +15V :15.24V}`,
  "{sc,tst,9.1.4,c}": `{SC,TST,9.1.4:PASS +15V :15.24V}`,
  "{sc,tst,9.1.5,c}": `{SC,TST,9.1.5:PASS +15V :15.26V}`,
  "{sc,tst,9.1.6,c}": `{SC,TST,9.1.6:PASS +15V :15.28V}`,
  "{sc,tst,9.1.7,c}": `{SC,TST,9.1.7:PASS +15V :15.23V}`,
  "{sc,tst,9.1.8,c}": `{SC,TST,9.1.8:PASS +15V :15.23V}`,
  "{sc,tst,9.1.9,c}": `{SC,TST,9.1.9:FAIL +15VG:17.58V}`,
  "{sc,tst,9.1.10,c}": `{SC,TST,9.1.10:FAIL +15VG:17.57V}`,
  "{sc,tst,9.1.11,c}": `{SC,TST,9.1.11:FAIL -15V :17.26V}`,
  "{sc,tst,9.1.12,c}": `{SC,TST,9.1.12:FAIL -15V :17.25V}`,
  "{sc,tst,9.1.13,c}": `{SC,TST,9.1.13:FAIL -15V :17.25V}`,
  "{sc,tst,9.1.14,c}": `{SC,TST,9.1.14:FAIL -15V :17.24V}`,
  "{sc,tst,9.1.15,c}": `{SC,TST,9.1.15:FAIL -15V :00.01V}`,
  "{sc,tst,9.1.16,c}": `{SC,TST,9.1.??,x,ERR}`,
  "{sc,tst,a.0.0,c}": `{SC,TST,a.0.??,x,ERR}`,
  "{sc,tst,a.0.1,c}": `{SC,TST,a.0.1:PASS FRQ:004950Hz TON:0098.95us}`,
  "{sc,tst,a.0.2,c}": `{SC,TST,a.0.2:PASS FRQ:004950Hz TON:0099.06us}`,
  "{sc,tst,a.0.3,c}": `{SC,TST,a.0.3:PASS FRQ:004950Hz TON:0098.96us}`,
  "{sc,tst,a.0.4,c}": `{SC,TST,a.0.4:PASS FRQ:004950Hz TON:0099.06us}`,
  "{sc,tst,a.0.5,c}": `{SC,TST,a.0.5:PASS FRQ:004950Hz TON:0099.06us}`,
  "{sc,tst,a.0.6,c}": `{SC,TST,a.0.6:PASS FRQ:004950Hz TON:0098.96us}`,
  "{sc,tst,a.0.7,c}": `{SC,TST,a.0.7:PASS FRQ:003999Hz TON:0112.52us}`,
  "{sc,tst,a.0.8,c}": `{SC,TST,a.0.8:PASS FRQ:003999Hz TON:0112.51us}`,
  "{sc,tst,a.0.9,c}": `{SC,TST,a.0.9:FAIL FRQ:000000Hz TON:0000.00us}`,
  "{sc,tst,a.0.10,c}": `{SC,TST,a.0.10:PASS FRQ:007998Hz TON:0050.03us}`,
  "{sc,tst,a.0.11,c}": `{SC,TST,a.0.11:FAIL FRQ:000000Hz TON:0000.00us}`,
  "{sc,tst,a.0.12,c}": `{SC,TST,a.0.12:FAIL FRQ:000000Hz TON:0000.00us}`,
  "{sc,tst,a.0.13,c}": `{SC,TST,a.0.??,x,ERR}`,
  "{sc,tst,b.0.1,c}": `{SC,TST,b.0.1:PASS}`,
};

class TestSerialPortMock extends SerialPortMock {
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
    if (super.write(chunk, params.encoding, params.callback)) {
      const command: string = (chunk as Buffer).toString(params.encoding);
      const response: string = COMMAND_RESPONSE[command];
      const rnd = Math.random();
      const data = `${response ?? command.toUpperCase()}${rnd <= 0.333 ? "\r" : rnd <= 0.666 ? "\n" : "\r\n"}`;
      console.log(`<< ${JSON.stringify(command)}`);
      this.port.emitData(data);
      console.log(`>> ${JSON.stringify(data)}`);
      return true;
    }
    return false;
  }
}

export {TestSerialPortMock as SerialPortMock};
