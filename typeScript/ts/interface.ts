interface Person {
  readonly id: number;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  [propName: string]: any;
}

let swan: Person = {
  id: 1,
  name: "swan"
};

interface Point {
  readonly x: number;
  readonly y: number;
}

let p1: Point = {
  x: 10,
  y: 20
};

interface searchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: searchFunc;
mySearch = function(source: string, subString: string) {
  return source > subString;
};
