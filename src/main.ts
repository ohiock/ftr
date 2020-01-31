import * as readline from 'readline';
const BigNumber = require('bignumber.js');

interface NumberFrequency {
  [key: string]: number;
}

export interface AppState {
  totalTime: number;
  lastStartTime: number;
  remainingTime: number;
  timer: NodeJS.Timeout;
  numbersMap: NumberFrequency;
}

const isSquare = (number: any) =>
  number.isGreaterThan(0) &&
  number
    .squareRoot()
    .mod(1)
    .isEqualTo(0);

const isFibonacci = (number: string) => {
  const n = new BigNumber(5).multipliedBy(
    new BigNumber(number).multipliedBy(new BigNumber(number)),
  );

  return isSquare(n.plus(4)) || isSquare(n.minus(4));
};

const printNumberFrequencies = (appState: AppState) => {
  const numberWithFrequency = Object.entries(appState.numbersMap)
    .sort((a, b) => b[1] - a[1])
    .map(([currentNumber, frequency]) => `${currentNumber}:${frequency}`);

  console.log(numberWithFrequency.join(', '));
};

const setResumedTimeout = (appState: AppState): void => {
  setTimeout(() => printNumberFrequencies(appState), appState.remainingTime);
};

export const setTimer = (appState: AppState): void => {
  appState.timer = setInterval(() => {
    appState.lastStartTime = Number(new Date());
    printNumberFrequencies(appState);
  }, appState.totalTime);
};

export const clearTimer = (timer: NodeJS.Timeout) => {
  clearInterval(timer);
};

export const killApp = () => process.exit(0);

export const onLine = (input: string, appState: AppState): void => {
  if (!appState.timer) {
    appState.totalTime = parseInt(input) * 1000;
    setTimer(appState);

    console.log('Please enter a number');

    return;
  }

  switch (input) {
    case 'halt': {
      const pausedTime = Number(new Date());
      console.log('Timer paused');
      appState.remainingTime =
        appState.totalTime - (pausedTime - appState.lastStartTime);
      clearTimer(appState.timer);
      break;
    }
    case 'resume': {
      console.log('Timer resumed');
      setResumedTimeout(appState);
      setTimer(appState);
      break;
    }
    case 'quit': {
      console.log('See ya!');
      printNumberFrequencies(appState);
      clearTimer(appState.timer);
      killApp();
      break;
    }
    default: {
      isFibonacci(input) && console.log('FIB');

      appState.numbersMap[input] = !!appState.numbersMap[input]
        ? appState.numbersMap[input] + 1
        : 1;

      console.log('Please enter a number');
    }
  }
};

export const init = (): void => {
  const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const appState: AppState = {
    totalTime: 0,
    lastStartTime: 0,
    remainingTime: 0,
    timer: null,
    numbersMap: {},
  };

  read.on('line', (input: string) => onLine(input, appState));

  console.log('Please enter desired delay (in seconds):');
};
