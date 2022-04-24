/*eslint-disable*/
class Animal {
  constructor(name) {
    this.name = name
  }
  sayHi() {
    console.log(`My name is ${this.name}`)
  }
}

let dog = new Animal('Dog')
dog.sayHi()

class Dog extends Animal {
  constructor(name) {
    super(name)
  }
  getInfo() {
    super.sayHi()
    this.sayHi()
    console.log(this.name)
  }
}

let dog2 = new Dog('dog2')
dog2.getInfo()

class Cat {
  constructor(name) {
    this.name = name
  }
  get name() {
    return 'jack'
  }
  set name(value) {
    console.log('setter ' + value)
  }
}

let cat = new Cat('123')
console.log(cat.name)
