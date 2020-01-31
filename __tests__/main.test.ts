import SpyInstance = jest.SpyInstance;
import * as app from '../src/main';
import { AppState } from '../src/main';

const wait = (delay: number) =>
  new Promise(resolve => setTimeout(() => resolve(), delay));

describe('App', () => {
  let appState: AppState;
  let logSpy: SpyInstance;
  let setTimerSpy: SpyInstance;
  let clearTimerSpy: SpyInstance;
  let exitSpy: SpyInstance;

  beforeEach(() => {
    appState = {
      totalTime: 0,
      lastStartTime: 0,
      remainingTime: 0,
      timer: null,
      numbersMap: {},
    };

    logSpy = jest.spyOn(global.console, 'log');
    setTimerSpy = jest.spyOn(app, 'setTimer');
    clearTimerSpy = jest.spyOn(app, 'clearTimer');
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);
  });

  afterEach(() => {
    clearInterval(appState.timer);

    logSpy.mockClear();
    setTimerSpy.mockClear();
    clearTimerSpy.mockClear();
    exitSpy.mockClear();
  });

  it('should prompt the user for the number of seconds between outputting numbers', () => {
    app.init();

    expect(logSpy).toHaveBeenCalledWith(
      'Please enter desired delay (in seconds):',
    );
  });

  it('should set the timer and prompt the user for a number after they have entered a delay', () => {
    app.onLine('2', appState);

    expect(appState.timer).not.toBeNull();
    expect(setTimerSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Please enter a number');
  });

  it('should output numbers and their frequency in frequency descending order', async () => {
    app.onLine('1', appState);

    app.onLine('4', appState);
    app.onLine('6', appState);
    app.onLine('6', appState);

    expect(logSpy).not.toHaveBeenCalledWith('6:2, 4:1');

    await wait(3100);

    expect(logSpy).toHaveBeenNthCalledWith(5, '6:2, 4:1');
  });

  it('should pause the timer when "halt" is entered', async () => {
    app.onLine('1', appState);

    app.onLine('4', appState);
    app.onLine('6', appState);

    await wait(3100);

    app.onLine('halt', appState);

    expect(logSpy).toHaveBeenNthCalledWith(6, '4:1, 6:1');
    expect(logSpy).toHaveBeenNthCalledWith(7, 'Timer paused');
    expect(logSpy).toHaveBeenCalledTimes(7);
    expect(clearTimerSpy).toHaveBeenCalled();
  });

  it('should resume the timer when "resume" is entered', async () => {
    app.onLine('4', appState);

    app.onLine('4', appState);
    app.onLine('4', appState);

    await wait(2100);

    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Please enter a number');

    app.onLine('halt', appState);

    await wait(4100);

    expect(logSpy).toHaveBeenNthCalledWith(4, 'Timer paused');

    app.onLine('resume', appState);

    await wait(3100);

    expect(logSpy).toHaveBeenNthCalledWith(5, 'Timer resumed');
    expect(logSpy).toHaveBeenNthCalledWith(6, '4:2');
    expect(logSpy).toHaveBeenCalledTimes(6);
  });

  it('should print "FIB" if the number entered is one of the first 1000 fibonacci numbers', () => {
    app.onLine('100', appState);

    // FIB
    app.onLine('0', appState);
    app.onLine('1', appState);
    app.onLine('3', appState);
    app.onLine('5', appState);
    app.onLine('1', appState);
    app.onLine('8146227408089084511865756065370647467555938', appState);
    app.onLine(
      '74938658661142424746936931013871484819301255773627024651689719443505027723135990224027850523592585',
      appState,
    );
    app.onLine(
      '43466557686937456435688527675040625802564660517371780402481729089536555417949051890403879840079255169295922593080322634775209689623239873322471161642996440906533187938298969649928516003704476137795166849228875',
      appState,
    );

    // not FIB
    app.onLine('8146227408089084511865756065370647467555937', appState);
    app.onLine(
      '74938658661142424746936931013871484819301255773627024651689719443505027723135990224027850523592584',
      appState,
    );
    app.onLine(
      '43466557686937456435688527675040625802564660517371780402481729089536555417949051890403879840079255169295922593080322634775209689623239873322471161642996440906533187938298969649928516003704476137795166849228874',
      appState,
    );

    expect(logSpy).toHaveBeenNthCalledWith(2, 'FIB');
    expect(logSpy).toHaveBeenNthCalledWith(4, 'FIB');
    expect(logSpy).toHaveBeenNthCalledWith(6, 'FIB');
    expect(logSpy).toHaveBeenNthCalledWith(8, 'FIB');
    expect(logSpy).toHaveBeenNthCalledWith(10, 'FIB');
    expect(logSpy).toHaveBeenNthCalledWith(12, 'FIB');
    expect(logSpy).toHaveBeenNthCalledWith(14, 'FIB');
    expect(logSpy).toHaveBeenNthCalledWith(16, 'FIB');

    expect(logSpy).toHaveBeenNthCalledWith(17, 'Please enter a number');
    expect(logSpy).toHaveBeenNthCalledWith(18, 'Please enter a number');
    expect(logSpy).toHaveBeenNthCalledWith(19, 'Please enter a number');
  });

  it('should quit the program and print a farewell message when "quit" is entered', () => {
    app.onLine('4', appState);

    app.onLine('4', appState);

    app.onLine('quit', appState);

    expect(logSpy).toHaveBeenNthCalledWith(3, 'See ya!');
    expect(logSpy).toHaveBeenNthCalledWith(4, '4:1');
    expect(exitSpy).toHaveBeenCalled();
  });
});
