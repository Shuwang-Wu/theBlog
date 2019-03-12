interface Person {
  readonly id: number
  name: string
  age: number
  weight?: number
  height?: number
  [propName: string]: any
}

let swan: Person = {
  id: 71108,
  name: 'swan',
  age: 28,
  weight: 57,
  gender: 'male'
}
