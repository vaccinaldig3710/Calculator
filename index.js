// Get all buttons, display, and total elements
const buttons = document.querySelectorAll('.btn');
const display = document.querySelector('.display');
const total = document.querySelector('.total');

// Variables for storing inputs and current operation
let inputs = [];
let newCalculation = false;

// Attach click event listeners to each button
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        handleButtonClick(button);
    });
});

// Function to handle button clicks
function handleButtonClick(button) {
    const buttonText = button.innerText;

    if (button.classList.contains('number')) {
        handleNumber(buttonText);
    } else if (button.classList.contains('grey')) {
        handleGrey(buttonText);
    } else if (button.classList.contains('yellow')) {
        handleYellow(buttonText);
    }

    calculateLiveTotal();
}

// Function to handle number button clicks
function handleNumber(number) {
    if (newCalculation) {
        display.textContent = '';
        newCalculation = false;
    }
    if (display.textContent === '0') {
        display.textContent = number;
    } else {
        display.textContent += number;
    }
    if (inputs.length > 0 && !isNaN(inputs[inputs.length - 1])) {
        inputs[inputs.length - 1] += number;
    } else {
        inputs.push(number);
    }

    adjustFontSize();
}

// Function to adjust font size based on display content length
function adjustFontSize() {
    let initialFontSize = 40;
    let minFontSize = 24;
    let decreaseFactor = 1.1;

    let newFontSize = initialFontSize - (display.textContent.length * decreaseFactor);
    newFontSize = Math.max(newFontSize, minFontSize);
    display.style.fontSize = newFontSize + 'px';
}

// Function to reset font size to the initial value
function resetFontSize() {
    let initialFontSize = 40;
    display.style.fontSize = initialFontSize + "px";
}

// Function to handle grey button clicks
function handleGrey(number) {
    switch (number) {
        case 'AC':
            if (display.textContent === '0') {
                return;
            }
            display.textContent = '0';
            total.textContent = '';
            firstOperand = null;
            secondOperand = null;
            currentOperation = null;
            inputs = []
            resetFontSize();
            break;
        case '+/-':
            if (Number(display.textContent) < 0) {
                display.textContent = Math.abs(Number(display.textContent)).toString();
            } else {
                display.textContent = '-' + display.textContent;
            }
            inputs[inputs.length - 1] = display.textContent;
            break;
        case '%':
            const currentValue = parseFloat(display.textContent);
            const percentageValue = currentValue / 100;
            display.textContent = percentageValue.toString();
            break;       
    } 
}

// Function to handle yellow button clicks
function handleYellow(operation) {
    const lastCharacter = display.textContent.slice(-1);
    const operators = "+-x÷=";

    if (operation === '=') {
        display.textContent = total.textContent;
        inputs = [total.textContent.toString()];
        newCalculation = true;
    } else if (!operators.includes(lastCharacter)) {
        if (newCalculation) {
            inputs = [display.textContent];
            newCalculation = false;
        }
        display.textContent += operation;
        inputs.push(operation);
    }
}

// Function to calculate live total based on current inputs
function calculateLiveTotal() {
    const parsedInputs = parseInputs(inputs); 
    if (parsedInputs.length >= 3) {
        const result = performOperation(parsedInputs);
        total.textContent = formatNumber(result);
    } else {
        total.textContent = '';
    }
}

// Function to parse inputs into an array of numbers and operators
function parseInputs(inputs) {
    const operators = "+-x÷";
    const parsedInputs = [];
    let currentNumber = '';

    for (const input of inputs) {
        if (operators.includes(input)) {
            if (currentNumber !== '') {
                parsedInputs.push(currentNumber);
                currentNumber = '';
            }
            parsedInputs.push(input);
        } else {
            currentNumber += input;
        }
    }

    if (currentNumber !== '') {
        parsedInputs.push(currentNumber);
    }

    return parsedInputs;
}

// Function to perform operation based on parsed inputs
function performOperation(parsedInputs) {
    while (parsedInputs.length > 1) {
        for (let i = 0; i < parsedInputs.length; i++) {
            if (parsedInputs[i] === 'x' || parsedInputs[i] === '÷') {
                const result = calculate(parsedInputs[i - 1], parsedInputs[i + 1], parsedInputs[i])
                parsedInputs.splice(i -1, 3, result);
                i--;
            } 
        }
        for (let i = 0; i < parsedInputs.length; i++) {
            if (parsedInputs[i] === '+' || parsedInputs[i] === '-') {
                const result = calculate(parsedInputs[i - 1], parsedInputs[i + 1], parsedInputs[i]);
                parsedInputs.splice(i - 1, 3, result);
                i--;
            }
        }
    }
    return parsedInputs[0];
}

// Function to calculate the result based on two inputs and an operation
function calculate(input1, input2, operation) {
    input1 = parseFloat(input1);
    input2 = parseFloat(input2);

    if (operation === "x") {
        return input1 * input2;
    } else if (operation === '÷') {
        return input1 / input2;
    } else if (operation === "+") {
        return input1 + input2
    } else if (operation === "-") {
        return input1 - input2;
    }
}

// Function to format the number for display
function formatNumber(number) {
    const absNumber = Math.abs(number);
    let formattedNumber;
    if (absNumber >= 1e6) {
        formattedNumber = number.toExponential(6);
    } else {
        formattedNumber = number.toFixed(8);
    }
    if (formattedNumber.includes('.')) {
        formattedNumber = formattedNumber.replace(/\.?0+$/, '');
    }
    return formattedNumber;
}
    