function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if(a === 0 || (a === 0 && b === 0)) {
        return 'nope';
    } else if(b === 0) {
        return 0;
    }
    return a / b;
}

function operate(operator, a, b) {
    let sum;
    if(operator === '+') {
       sum = add(a, b); 
    } else if(operator === '-') {
        sum = subtract(a, b);
    } else if(operator === '*') {
        sum = multiply(a, b);
    } else if(operator === '/') {
        sum = divide(a, b);
    } else {
        throw 'Fatal error, invalid operator';
    }
    return sum;
}

// https://medium.com/swlh/how-to-round-to-a-certain-number-of-decimal-places-in-javascript-ed74c471c1b8
const roundAccurately = (number, decimalPlaces) => Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces)

class InputProcessor {
    constructor() {
        this.digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.operators = ['+', '-', '*', '/'];
        this.firstOperand = '';
        this.operator = '';
        this.secondOperand = '';
    }

    logInput() {
        console.log(`${this.firstOperand} (${this.operator}) ${this.secondOperand}`);
    }

    clearInput() {
        this.firstOperand = '';
        this.operator = '';
        this.secondOperand = '';
    }

    addToDisplay(string) {
        display.value += string;
    }

    getDisplay() {
        return display.value;
    }

    replaceDisplay(string) {
        display.value = string;
    }

    clearDisplay() {
        display.value = '';
    }

    anyInputEmpty() {
        if(!this.firstOperand || !this.operator || !this.secondOperand) {
            return true;
        }
        return false;
    }

    noInputEmpty() {
        return this.firstOperand || this.operator || this.secondOperand;
    }

    charInOperand(input, char) {
        return input.includes(char);
    }

    invalidOperand(input) {
        return input === '.' || input === '-' || input === '-.';
    }

    numberOfDigits(input) {
        let newStr = input.replace('-', '');
        newStr = input.replace('.', '');
        return newStr.length;
    }

    clearButton() {
        this.clearInput();
        this.clearDisplay();
    }

    delButton() {
        let currentDisplay = this.getDisplay();
        if(currentDisplay === this.firstOperand) {
            this.firstOperand = this.firstOperand.slice(0, -1);
            this.replaceDisplay(this.firstOperand);
            if(this.operator) {
                this.operator = '';
            }
        } else {
            this.secondOperand = this.secondOperand.slice(0, -1);
            this.replaceDisplay(this.secondOperand);
        }
    }

    negateButton() {
        if(this.getDisplay() === this.firstOperand && !this.operator) {
            if(this.charInOperand(this.firstOperand, '-')) {
                this.firstOperand = this.firstOperand.slice(1);
            } else {
                this.firstOperand = '-' + this.firstOperand;
            }
            this.replaceDisplay(this.firstOperand);
        } else {
            if(this.charInOperand(this.secondOperand, '-')) {
                this.secondOperand = this.secondOperand.slice(1);
            } else {
                this.secondOperand = '-' + this.secondOperand;
            }
            this.replaceDisplay(this.secondOperand);
        }
    }

    operatorButtons(operator) {
        if(!this.firstOperand || this.invalidOperand(this.firstOperand)) {
            // Operator won't be stored if there aren't any operands yet.
            return;
        } else if(this.invalidOperand(this.secondOperand)) {
            return;
        } else if(this.noInputEmpty()) {
            this.evaluateExpression(); 
        }
        this.operator = operator;
    }

    digitButtons(input) {
        if(!this.operator) {
            // If the first operand is empty, an expression might have just been
            // run and the display has the result so just in case clear display.
            if(!this.firstOperand) {
                this.clearDisplay();
            }
            if(input === '.' && this.charInOperand(this.firstOperand, '.')
               || this.numberOfDigits(this.firstOperand) >= 10) {
                return;
            }
            this.firstOperand += input;
        } else {
            // If the second operand is empty, the first operand is currently
            // on the screen so clear the display.
            if(!this.secondOperand) {
                this.clearDisplay();
            }
            if(input === '.' && this.charInOperand(this.secondOperand, '.')
               || this.numberOfDigits(this.secondOperand) >= 10) {
                return;
            }
            this.secondOperand += input;
        }
        this.addToDisplay(input);
    }

    equalsButton() {
        this.evaluateExpression();
    }

    evaluateExpression() {
        let result;
        if(this.anyInputEmpty()) {
            return;
        } else {
            result = operate(this.operator, Number(this.firstOperand), Number(this.secondOperand)).toString();
            this.clearInput();
            if(result !== 'nope') {
                // Check if the result is a decimal.
                if(Number(result) % 1 !== 0) {
                    result = roundAccurately(result, 10).toString();
                }
                this.firstOperand = result;
            }
            this.replaceDisplay(result);
        }
    }

    doButtonAction(input) {
        if(input === 'clear') {
            this.clearButton();
        } else if(input === 'del') {
            this.delButton();
        } else if(input === '+/-') {
            this.negateButton();
        } else if(this.operators.includes(input)) {
            this.operatorButtons(input);
        } else if(this.digits.includes(input) || input === '.') {
            this.digitButtons(input);
        } else if(input === '=') {
            this.equalsButton();
        } else {
            throw 'Error, invalid button';
        }
    }
}

const display = document.getElementById('results-text');
const calc_buttons = Array.from(document.getElementsByClassName('calc-button'));
const inputProcessor = new InputProcessor();
calc_buttons.forEach(button => button.addEventListener('click', event => {
    inputProcessor.doButtonAction(event.target.textContent);
    inputProcessor.logInput();
}));