import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})


export class InterfaceComponent implements OnInit {

  equation: string[] = ['0'];
  result: number = 0;
  PreviousEquation: string[] = [];

  resulted: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  evaluate() {

    let i: number = 0;
    let z: number = 0;
    let NumBracketPairs: number = 0;
    let Error: boolean = false;

    //Sets previous equation
    this.PreviousEquation.splice(0,this.PreviousEquation.length);
    for (i; i < this.equation.length; i++) {
      this.PreviousEquation.push(this.equation[i]);
    }
    this.PreviousEquation.push('=');

    i = 0;

    //Checks to see brackets are even
    for (i; i < this.equation.length; i++) {
      if (this.equation[i] == '('){
        z++
      }
      else if (this.equation[i] == ')') {
        NumBracketPairs++
      }
      else if (this.equation[i] == '(' && this.equation[i+1] == ')') {
        Error = true;
      }
    }

    //if brackets are even and not "()"
    if (z == NumBracketPairs || !Error) {

      if (NumBracketPairs >= 0) {

        //Evaluates brackets
        this.EvalBrackets(NumBracketPairs);
      }

      //Solves final equation
      this.EvalODMAS(this.equation);
    }

    //If there is error
    else {
      this.clear()
      this.equation[0] = 'NaN';
    }

    //Sets previous equation
    if (this.equation[0] != 'Infinity' && this.equation[0] != 'NaN') {
      this.PreviousEquation.push(this.equation[0])
    }
  }

  EvalBrackets (NumBracketPairs: number) {

    let i: number = 0;
    let z: number = 0;
    let x: number = 0;
    let y: number = 0;
    let MultiplyBracket: boolean = false;
    let InnerBrackets: boolean = false;
    let TempEquation: string[] = [];

    for (y; y < NumBracketPairs; y++) {

      //Finds first left bracket index
      for (i;(this.equation[i] != '(') && i < this.equation.length; i++) {
      }

      //Moves z to 1 in front of bracket to avoid infinite loop
      z = i + 1;

      //Checks for inner brackets
      do {
        //Finds first right bracket and any brackets in between
        for (z;(this.equation[z] != ')');z++) {

          if (this.equation[z] == '(') {
            InnerBrackets = true;
            i = z;
            break
          }
          else if (this.equation[z] != '(') {
            InnerBrackets = false;
          }
        }
        console.log('Inner brackets '+ InnerBrackets)
        //Moves z in front of bracket to avoid infinite loop
        z++;
      } while (InnerBrackets);

      //Finds end of final set of inner brackets
      z = i;
      for (z;this.equation[z] != ')';z++) {
      }

      //index of final inner bracket
      console.log('Start of final bracket index: ' + i)
      //End of new array
      console.log('End of final bracket index: ' + z)

      //Checks for multiplication
      if (this.equation[i-1] != '+' && this.equation[i-1] != '-' && this.equation[i-1] != '/' && this.equation[i-1] != 'X' && this.equation[i-1] != '(' && this.equation[i-1] != '√' && i != 0 ) {
        MultiplyBracket = true;
      }
      console.log('Multiply brackets = ' + MultiplyBracket)

      //Sets previous equation
      x = i;
      for (i; i < (z + 1); i++) {
        TempEquation.push(this.equation[i]);
      }

      i = x;

      console.log('Final brackets equation: ' + TempEquation);
      console.log('Full equation: ' + this.equation);

      //Solves brackets
      this.EvalODMAS(TempEquation);

      console.log(TempEquation)

      if (MultiplyBracket) {
        this.equation.splice(i,(z-i+1),'X',TempEquation.join(""))
      }
      else {
        this.equation.splice(i,(z-i+1),TempEquation.join(""))
      }

      console.log('New equation: ' + this.equation)

      //resets values
      i = 0;
      z = 0;
      x = 0;
      MultiplyBracket = false;
      InnerBrackets = false;
      TempEquation = [];
    }
  }

  EvalODMAS (arr: string[]) {

    let i: number = 0;
    let z: number = 0;
    let x: number = 0;
    let n1: number = 0;
    let n2: number = 0;

    //If () deletes them
    if (arr[0] == '(' && arr[arr.length - 1] == ')') {
      arr.splice((arr.length-1),1);
      arr.splice(0,1)
      console.log('Brackets removed: ' + arr)
    }

    //Solves each √
    for (i; i < arr.length; i++) {

      if (arr[i] == '√') {

        z = i+1;

        //finds n2
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && (arr[z] != '√' ) && z < arr.length; z++) {
        }

        console.log((arr.slice(i+1,z)).join(""));
        n2 = Number((arr.slice(i+1,z)).join(""));
        console.log('n2: ' + n2);

        //Checks for multiplication
        if (this.equation[i-1] != '+' && this.equation[i-1] != '-' && this.equation[i-1] != '/' && this.equation[i-1] != 'X' && this.equation[i-1] != '(' && this.equation[i-1] != '√' && i != 0 ) {

          //calculates result and inputs it into array aswell as X
          this.result = Math.sqrt(n2);
          console.log('result = '+this.result)
          arr.splice(i,z-i,'X',this.result.toString());
          console.log(arr);
        }
        else {

          //calculates result and inputs it into array
          this.result = Math.sqrt(n2);
          console.log('result = '+this.result)
          arr.splice(i,z-i,this.result.toString());
          console.log(arr);
        }

        //resets i to 0 so it can recheck the array
        i = 0;

        //Signals that resulted
        this.resulted = true;
        console.log('Resulted: ' + this.resulted);
      }
    }

    i =0;
    z = 0;
    n2 =0;

    //Solves each x²
    for (i; i < arr.length; i++) {

      if (arr[i] == '²') {
        console.log('squared')

        z = i-1;

        //finds n1
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z >= 0; z--) {
        }

        n1 = Number((arr.slice(z+1,i)).join(""));
        console.log('n1: ' + n1);

        //calculates result and inputs it into array
        this.result = n1*n1;
        console.log('result = '+this.result)
        arr.splice(z+1,i-z,this.result.toString());
        console.log(arr);

        //resets i to 0 so it can recheck the array
        i = 0;

        //Signals that resulted
        this.resulted = true;
        console.log('Resulted: ' + this.resulted);
      }
    }

    i = 0;
    z = 0;
    n1 =0;

    //Solves each division/multiplication
    for (i; i < arr.length; i++) {

      if (arr[i] == '/') {
        console.log('division')

        z = i-1;

        //finds n1
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z >= 0; z--) {
        }

        n1 = Number((arr.slice(z+1,i)).join(""));
        console.log('n1: ' + n1);

        //resets z to 1 index in front of i
        x = z+1;
        z = i+1;


        //Accounts for -n2
        if (arr[i+1] == '-') {
          z = i+2;
        }

        //finds n2
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z < arr.length; z++) {
        }

        n2 = Number((arr.slice(i+1,z)).join(""));
        console.log('n2: ' + n2);

        //calculates result and inputs it into array
        this.result = n1/n2;
        console.log('result = '+this.result)
        arr.splice(x,z-x,this.result.toString());
        console.log(arr);

        //resets i to 0 so it can recheck the array
        i = 0;

        //Signals that resulted
        this.resulted = true;
        console.log('Resulted: ' + this.resulted);
      }

      else if (arr[i] == 'X') {
        console.log('multiplication')
        z = i-1;

        //finds n1
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z >= 0; z--) {
        }
        n1 = Number((arr.slice(z+1,i)).join(""));
        console.log('n1: ' + n1);

        //resets z to 1 index in front of i
        x = z+1;
        z = i+1;

        //Accounts for -n2
        if (arr[i+1] == '-') {
          z = i+2;
        }

        //finds n2
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z < arr.length; z++) {
        }
        n2 = Number((arr.slice(i+1,z)).join(""));
        console.log('n2: ' + n2);

        //calculates result and inputs it into array
        this.result = n1*n2;
        console.log('result = '+this.result)
        arr.splice(x,z-x,this.result.toString());
        console.log(arr);

        //resets i to 0 so it can recheck the array
        i=0;

        //Signals that resulted
        this.resulted = true;
        console.log('Resulted: ' + this.resulted);
      }
    }

    i = 0;

    //Solves each addition/subtraction
    for (i; i < arr.length; i++) {

      if (arr[i] == '+') {
        console.log('addition')
        z = i-1;

        //finds n1
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z >= 0; z--) {
        }
        n1 = Number((arr.slice(z+1,i)).join(""));
        console.log('n1: ' + n1);

        //resets z to 1 index in front of i
        x = z+1;
        z = i+1;

        //Accounts for -n2
        if (arr[i+1] == '-') {
          z = i+2;
        }

        //finds n2
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z < arr.length; z++) {
        }
        n2 = Number((arr.slice(i+1,z)).join(""));
        console.log('n2: ' + n2);

        //calculates result and inputs it into array
        this.result = n1+n2;
        console.log('result = '+this.result)
        arr.splice(x,z-x,this.result.toString());
        console.log(arr);

        //resets i to 0 so it can recheck the array
        i=0;

        //Signals that resulted
        this.resulted = true;
        console.log('Resulted: ' + this.resulted);
      }
      else if (arr[i] == '-') {
        console.log('subtraction')
        z = i-1;

        //finds n1
        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z >= 0; z--) {
        }
        n1 = Number((arr.slice(z+1,i)).join(""));
        console.log('n1: ' + n1);

        //resets z to 1 index in front of i
        x = z+1;
        z = i+1;

        //finds n2

        //Accounts for -n2
        if (arr[i+1] == '-') {
          z = i+2;
        }

        for (z;(arr[z] != '+') && (arr[z] != '-') && (arr[z] != '/') && (arr[z] != 'X' ) && (arr[z] != '²' ) && z < arr.length; z++) {
        }
        n2 = Number((arr.slice(i+1,z)).join(""));
        console.log('n2: ' + n2);

        //calculates result and inputs it into array
        this.result = n1-n2;
        console.log('result = '+this.result)
        arr.splice(x,z-x,this.result.toString());
        console.log(arr);

        //resets i to 0 so it can recheck the array
        i=0;

        //Signals that resulted
        this.resulted = true;
        console.log('Resulted: ' + this.resulted);
      }
    }
  }

  MainDisplay() {
    if (this.equation[0] == 'NaN') {
      return 'Malformed expression'
    }
    else if (this.equation[0] == 'Infinity') {
      return 'Math error: dividing by 0'
    }
    else {
      return this.equation.join("");
    }
  }

  SecondDisplay() {
      return this.PreviousEquation.join("");
  }

  square() {
    if (this.resulted) {

      this.resulted = false;

      this.equation.push('²');
      console.log('Resulted: ' + this.resulted);
    }

    else {
      this.equation.push('²');
      console.log(this.equation);
    }
  }

  SquareRoute() {

    if ((this.equation[0] == '0') && this.equation.length == 1) {
      this.equation.splice((this.equation.length-1),1);
      this.equation.push('√');
      this.equation.push('(');
      console.log(this.equation);
    }

    else {
      this.equation.push('√');
      this.equation.push('(');
      console.log(this.equation);
    }

    if (this.resulted) {

      this.resulted = false;
      console.log(this.resulted);
    }
  }

  DM (event: MouseEvent) {
    //gets id
    const eventTarget: Element = event.target as Element;
    const elementId: string = eventTarget.id;

    let x: string = elementId;

    if (this.resulted) {
      this.resulted = false;
    }

    if (this.equation[this.equation.length -1] == '/') {
      this.equation.splice((this.equation.length-1),1);
      this.equation.push(x);
      console.log(this.equation);
    }
    else if (this.equation[this.equation.length -1] == 'X') {
      this.equation.splice((this.equation.length-1),1);
      this.equation.push(x);
      console.log(this.equation);
    }
    else {
      this.equation.push(x);
      console.log(this.equation);
    }
  }

  subtract() {

    if (this.resulted) {

      this.resulted = false;

      this.equation.push('-');
      console.log(this.equation);
    }

    else {
      this.equation.push('-');
      console.log(this.equation);
    }
  }

  add() {

    if (this.resulted) {
      this.resulted = false;
    }

    if (this.equation[this.equation.length -1] == '+' || this.equation[this.equation.length -1] == 'X' || this.equation[this.equation.length -1] == '/') {
      this.equation.splice((this.equation.length-1),1);
      this.equation.push('+');
      console.log(this.equation);
    }
    else if ((this.equation[this.equation.length -1] == '-' && this.equation[this.equation.length -2] == '+') || (this.equation[this.equation.length -1] == '-' && this.equation[this.equation.length -2] == '-')) {
      this.equation.splice((this.equation.length-2),2);
      this.equation.push('+');
      console.log(this.equation);
    }
    else {
      this.equation.push('+');
      console.log(this.equation);
    }
  }

  clear() {
    this.equation.splice(0,this.equation.length);
    console.log(this.equation);
    this.equation.push('0');
  }

  delete() {
    this.equation.splice((this.equation.length-1),1);
    console.log(this.equation);
    console.log(this.equation.length);

    if (0==this.equation.length) {
      this.equation.push('0');
    }
  }

  decimal() {

    //checks if array is a result and if so removes it
    if (this.resulted) {
      this.equation.splice(0,this.equation.length);
      this.equation.push('.');
      console.log(this.equation);
    }

    else {
      this.equation.push('.');
      console.log(this.equation);
    }

    //resets resulted
    this.resulted = false;
  }

  LeftBracket () {
    //deletes initial 0
    if ((this.equation[0] == '0') && this.equation.length == 1) {
      this.equation.splice((this.equation.length-1),1);
      console.log(this.equation);
      this.equation.push('(');
      console.log(this.equation.length);
    }

    //checks if array is a result and if so removes it
    else if (this.resulted) {
      this.equation.splice(0,this.equation.length);
      this.equation.push('(');
      console.log(this.equation);
    }

    else {
      this.equation.push('(');
      console.log(this.equation);
    }

    //resets resulted
    this.resulted = false;
  }

  RightBracket () {
    //deletes initial 0
    if ((this.equation[0] == '0') && this.equation.length == 1) {
      this.equation.splice((this.equation.length-1),1);
      console.log(this.equation);
      this.equation.push(')');
      console.log(this.equation.length);
    }

    //checks if array is a result and if so removes it
    else if (this.resulted) {
      this.equation.splice(0,this.equation.length);
      this.equation.push(')');
      console.log(this.equation);
    }

    else {
      this.equation.push(')');
      console.log(this.equation);
    }

    //resets resulted
    this.resulted = false;
  }

  Numbers (event: MouseEvent) {

    //gets id
    const eventTarget: Element = event.target as Element;
    const elementId: string = eventTarget.id;

    let x: string = elementId;

    //deletes initial 0
    if ((this.equation[0] == '0') && this.equation.length == 1) {
      this.equation.splice((this.equation.length-1),1);
      this.equation.push(x);
      console.log(this.equation);
    }

    //checks if array is a result and if so removes it
    else if (this.resulted) {
      this.equation.splice(0,this.equation.length);
      this.equation.push(x);
      console.log(this.equation);
    }

    else {
      this.equation.push(x);
      console.log(this.equation);
    }

    //resets resulted
    this.resulted = false;
  }
}
