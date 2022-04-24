let usrName: string = `swan`
let usrAge: number = 28
let isDone: boolean = false
let list1: number[] = [1, 2, 3]
let list2: Array<string> = ['1', '2', '3']
let greeting: string = `Hello, my name is ${usrName}, ${usrAge} years old`
let greeting2: string =
  'Hello, my name is ' + usrName + ', ' + usrAge + 'years old'
list1.push(1)
// list1.push('1') 字符串不能赋值给number类型的数组
// list2.push(2) 数值不能赋值给number类型的数组
list2.push('2')
let u: undefined = undefined
let n: null = null

let num: number = undefined

// any
let anything: any = 1
anything = '1'
anything = null
anything = undefined
anything = function() {}
// union type
let myFavotiteNum: string | number
myFavotiteNum = 1
myFavotiteNum = '1'
