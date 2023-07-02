/*
  Implement a class `Calculator` having below methods
    - initialise a result variable in the constructor and keep updating it after every arithmetic operation
    - add: takes a number and adds it to the result
    - subtract: takes a number and subtracts it from the result
    - multiply: takes a number and multiply it to the result
    - divide: takes a number and divide it to the result
    - clear: makes the `result` variable to 0
    - getResult: returns the value of `result` variable
    - calculate: takes a string expression which can take multi-arithmetic operations and give its result
      example input: `10 +   2 *    (   6 - (4 + 1) / 2) + 7`
      Points to Note: 
        1. the input can have multiple continuous spaces, you're supposed to avoid them and parse the expression correctly
        2. the input can have invalid non-numerical characters like `5 + abc`, you're supposed to throw error for such inputs

  Once you've implemented the logic, test your code by running
  - `npm run test-calculator`
*/

class Calculator {

  constructor() {
    this.result = 0;
  }

  add(num) {
    this.result += num;
  }

  subtract(num) {
    this.result -= num;
  }

  multiply(num) {
    this.result *= num;
  }

  divide(num) {
    if ( num == 0 ) {
      throw new Error('Division by 0 Encountered!');
    }
    this.result /= num;
  }

  clear() {
    this.result = 0;
  }

  getResult() {
    return this.result;
  }

  _extractNumberNOperatorsFromExpression(expression) {
    var usefulElementsOfExpression = expression.match(/([/*\-+()])|([\d.]+)|([\w]+)/g).filter( elt => elt !== '' );
    return usefulElementsOfExpression
  }

  _isStrNumeric(str) {
    // isNaN function checks if the values is "Not a Number". But it has limitations.
    // The other 2 if conditions joined by && takes care of this
    //  1. If its a boolean (then the value can be converted to 0 or 1, a number)
    //  2. Empty string '', (then will give 0)
    var res = null;
    if (!(isNaN(str)) && typeof str !== 'boolean' && str.trim() !== '') {
      res = true;
    } else {
      res = false;
    }
    return res;
  }

  _isStrOperation(str) {
    var res = null;
    if ( ['+', '-', '*', '/'].includes(str) ) {
      res = true;
    } else {
      res = false;
    }
    return res;
  }

  _isStrOpenningBracket(str) {
    var res = null;
    if ( str=='(' ) {
      res = true;
    } else {
      res = false;
    }
    return res;
  }

  _isStrClosingBracket(str) {
    var res = null;
    if (str === ')') {
      res = true;
    } else {
      res = false;
    }
    return res;
  }

  _isElt1ImportanceGreaterThanElt2s(elt1, elt2) {
    const precedenceOrder = {
      '(': 0,
      '+': 1,
      '-': 2,
      '*': 3,
      '/': 4
    };

    const elt1PrecedenceOrder = precedenceOrder[elt1];
    const elt2PrecedenceOrder = precedenceOrder[elt2];
    
    var res = null;
    if (elt1PrecedenceOrder > elt2PrecedenceOrder) {
      res = true;
    } else {
      res = false;
    }

    return res;
  }

  _evaluateOperation(num1, num2, operator) {
    var res = null;
    if (operator == '/') {
      if (num2 == 0) {
        throw new Error('Encountered Division by 0!');
      }
      res = num1 / num2;
    } else if (operator == '*') {
      res = num1 * num2;
    } else if (operator == '-') {
      res = num1 - num2;
    } else if (operator == '+') {
      res = num1 + num2;
    } else {
      throw new Error('Encountered Invalid Operator inside _evaluateOperation function: ' + operator);
    }
    return res
  }

  _popStackAndEvaluateOperation(numberStack, operatorStack) {
    const stackNumber2 = numberStack.pop();
    const stackNumber1 = numberStack.pop();
    const stackPoppedOperator = operatorStack.pop();
    var evaluatedResult = this._evaluateOperation(stackNumber1, stackNumber2, stackPoppedOperator);
    numberStack.push( evaluatedResult );
  }

  calculate(exp) {

    exp = this._extractNumberNOperatorsFromExpression(exp);

    this.clear();

    var numberStack = [];
    var operatorStack = [];

    for (var elt of exp) {
      if (this._isStrNumeric(elt)) {

        elt = Number(elt);
        numberStack.push(elt);

      } else if ( this._isStrOperation(elt) || this._isStrOpenningBracket(elt) ) {

        while ( (operatorStack.length !== 0) && ( this._isElt1ImportanceGreaterThanElt2s( operatorStack.at(-1), elt ) ) ) {
          if ( this.  _isStrOpenningBracket( elt ) )  {
            break;
          }
          this._popStackAndEvaluateOperation(numberStack, operatorStack);
        }
        operatorStack.push(elt);

      } else if (this._isStrClosingBracket(elt)) {

        while ( !this._isStrOpenningBracket( operatorStack.at(-1) ) ) {
          this._popStackAndEvaluateOperation(numberStack, operatorStack);
        }
        operatorStack.pop()

      } else {
        throw new Error('Invalid Element Encountered: ' + String(elt));
      }
    }

    while (operatorStack.length !== 0) {
      this._popStackAndEvaluateOperation(numberStack, operatorStack);
    }

    const result = numberStack[0];
    this.result = result;

    return result;
  }

}

module.exports = Calculator;
