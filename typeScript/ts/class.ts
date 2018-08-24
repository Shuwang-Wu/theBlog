class Person {
  constructor(theName) {
    this.name = theName;
  }
  private name: string;
  protected age: number;
  readonly height: number;
  public width: number;
  getInfo() {
    console.log(this.name, this.age, this.height, this.width);
  };
}

class Student extends Person {
  constructor(words) {
    super(name)
    this.words = words
  }
  private words: string;
  sayHi() {
    console.log(`I'm ${this.age}, ${this.words}`)
  }
}

let p = new Person('abc');
let s = new Student('abc');

// p.name; // private不能在当前类的外部进行访问
// p.age; // protected 不能被实例，所以也不能在外部进行访问
p.height;
// p.height = 100;
p.width;
s.sayHi()

// 抽象类
abstract class Department {
  constructor(public name: string) {
  }
  printName(): void { }
  abstract printMeeting(): void;
}


class AccountingDepartment extends Department {

  constructor() {
      super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
  }

  printMeeting(): void {
      console.log('The Accounting Department meets each Monday at 10am.');
  }

  generateReports(): void {
      console.log('Generating accounting reports...');
  }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在