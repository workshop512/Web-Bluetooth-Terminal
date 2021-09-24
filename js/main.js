// UI elements.
const deviceNameLabel = document.getElementById('device-name');
const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const terminalContainer = document.getElementById('terminal');
const sendForm = document.getElementById('send-form');
const inputField = document.getElementById('input');

//action buttons
const actionButtonL = document.getElementById('buttonL');
const actionButtonX = document.getElementById('buttonX');
const actionButtonR = document.getElementById('buttonR');

const actionButton1 = document.getElementById('button1');
const actionButton2 = document.getElementById('button2');
const actionButton3 = document.getElementById('button3');
const actionButton4 = document.getElementById('button4');
const actionButton5 = document.getElementById('button5');
const actionButton6 = document.getElementById('button6');
const actionButton7 = document.getElementById('button7');
const actionButton8 = document.getElementById('button8');
const actionButton9 = document.getElementById('button9');

// Helpers.
const defaultDeviceName = 'Terminal';
const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2;
let isTerminalAutoScrolling = true;

const scrollElement = (element) => {
  const scrollTop = element.scrollHeight - element.offsetHeight;

  if (scrollTop > 0) {
    element.scrollTop = scrollTop;
  }
};

const logToTerminal = (message, type = '') => {
  terminalContainer.insertAdjacentHTML('beforeend',
      `<div${type && ` class="${type}"`}>${message}</div>`);

  if (isTerminalAutoScrolling) {
    scrollElement(terminalContainer);
  }
};

// Obtain configured instance.
const terminal = new BluetoothTerminal();

// Override `receive` method to log incoming data to the terminal.
terminal.receive = function(data) {
  logToTerminal(data, 'in');
};

// Override default log method to output messages to the terminal and console.
terminal._log = function(...messages) {
  // We can't use `super._log()` here.
  messages.forEach((message) => {
    logToTerminal(message);
    console.log(message); // eslint-disable-line no-console
  });
};

// Implement own send function to log outcoming data to the terminal.
const send = (data) => {
  terminal.send(data).
      then(() => logToTerminal(data, 'out')).
      catch((error) => logToTerminal(error));
};

// Bind event listeners to the UI elements.
connectButton.addEventListener('click', () => {
  terminal.connect().
      then(() => {
        deviceNameLabel.textContent = terminal.getDeviceName() ?
            terminal.getDeviceName() : defaultDeviceName;
      });
});

// Bind event listeners to the UI elements for action buttons.
actionButtonL.addEventListener('click', () => {
  send('!B03');
});
actionButtonX.addEventListener('click', () => {
  send('!B05');
});
actionButtonR.addEventListener('click', () => {
  send('!B07');
});

actionButton1.addEventListener('click', () => {
  send('!B11:');
});
actionButton2.addEventListener('click', () => {
  send('!B219');
});
actionButton3.addEventListener('click', () => {
  send('!B318');
});
actionButton4.addEventListener('click', () => {
  send('!B417');
});
actionButton5.addEventListener('click', () => {
  send('!B55:');
});
actionButton6.addEventListener('click', () => {
  send('!B66');
});
actionButton7.addEventListener('click', () => {
  send('!B77');
});
actionButton8.addEventListener('click', () => {
  send('!B88');
});
actionButton9.addEventListener('click', () => {
  send('!B99:');
});




disconnectButton.addEventListener('click', () => {
  terminal.disconnect();
  deviceNameLabel.textContent = defaultDeviceName;
});

sendForm.addEventListener('submit', (event) => {
  event.preventDefault();

  send(inputField.value);

  inputField.value = '';
  inputField.focus();
});

// Switch terminal auto scrolling if it scrolls out of bottom.
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight -
      terminalContainer.offsetHeight - terminalAutoScrollingLimit;

  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});
