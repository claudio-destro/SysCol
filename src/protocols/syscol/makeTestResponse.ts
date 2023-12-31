import {CommandResponse, TestResponse} from "../../script/CommandResponse";

const TEST_TO_LABEL: Record<string, string> = {
  "7.0.0": "POWER OFF",
  "7.0.1": "POWER ON",
  //
  "7.1.0": "Digital Input 0",
  "7.1.1": "Digital Input 1",
  "7.1.2": "Digital Input 2",
  "7.1.3": "Digital Input 3",
  "7.1.4": "Digital Input 4",
  "7.1.5": "Digital Input 5",
  "7.1.6": "Digital Input 6",
  "7.1.7": "Digital Input 7",
  "7.1.8": "Digital Input 8",
  "7.1.9": "Digital Input 9",
  "7.1.10": "Digital Input 10",
  "7.1.11": "Digital Input 11",
  "7.1.12": "Digital Input 12",
  "7.1.13": "Digital Input 13",
  "7.1.14": "Digital Input 14",
  "7.1.15": "TST 7.1.15",
  //
  "7.2.1": "Digital Output 1",
  "7.2.2": "Digital Output 2",
  "7.2.3": "Digital Output 3",
  "7.2.4": "Digital Output 4",
  "7.2.5": "Digital Output 5",
  "7.2.6": "Digital Output 6",
  //
  "7.3.0": "ADC 0",
  "7.3.1": "ADC 1",
  "7.3.2": "ADC 2",
  "7.3.3": "ADC 3",
  "7.3.4": "ADC 4",
  "7.3.5": "ADC 5",
  "7.3.6": "ADC 6",
  "7.3.7": "ADC 7",
  "7.3.8": "ADC 8",
  "7.3.9": "ADC 9",
  "7.3.10": "ADC 10",
  "7.3.11": "ADC 11",
  "7.3.12": "ADC 12",
  "7.3.13": "ADC 13",
  "7.3.14": "ADC 14",
  //
  "8.0.1": "GUA",
  "8.0.2": "GUB",
  "8.0.3": "GUC",
  "8.0.4": "PWM",
  //
  "8.5.1": "CH1",
  "8.5.2": "CH2",
  "8.5.3": "CH3",
  "8.5.4": "CH4",
  //
  "8.6.1": "Protection phase #1",
  "8.6.2": "Protection phase #2",
  "8.6.3": "Protection phase #3",
  //
  "9.0.1": "ADC 1 Voltage",
  "9.0.2": "ADC 2 Voltage",
  "9.0.3": "ADC 3 Voltage",
  "9.0.4": "ADC 4 Voltage",
  //
  "9.1.0": "CNT P2-15",
  "9.1.1": "CNT P2-21",
  "9.1.2": "CNT P3-15",
  "9.1.3": "CNT P14-14",
  "9.1.4": "CNT P14-15",
  "9.1.5": "CNT P14-26",
  "9.1.6": "CNT P30-3",
  "9.1.7": "CNT P30-5",
  "9.1.8": "CNT P30-9",
  "9.1.9": "CNT P2-23",
  "9.1.10": "CNT P14-19",
  "9.1.11": "CNT P2-18",
  "9.1.12": "CNT P3-18",
  "9.1.13": "CNT P14-23",
  "9.1.14": "CNT P30-4",
  "9.1.15": "CNT P30-8",
  //
  "a.0.1": "PWMA 1",
  "a.0.2": "PWMA 2",
  "a.0.3": "PWMA 3",
  "a.0.4": "PWMA 4",
  "a.0.5": "PWMA 5",
  "a.0.6": "PWMA 6",
  "a.0.7": "PWMB 1",
  "a.0.8": "PWMB 2",
  "a.0.9": "TST a.0.9",
  "a.0.10": "PWMB 4",
  "a.0.11": "TST a.0.11",
  "a.0.12": "TST a.0.12",
  //
  "b.0.1": "Watchdog",
};

const testToLabel = (testNum: string): string => TEST_TO_LABEL[testNum] ?? `(unknown ${testNum})`;

export const makeTestResponse = (response: CommandResponse): TestResponse => ({...response, label: testToLabel(response.argv[0]?.key)});
