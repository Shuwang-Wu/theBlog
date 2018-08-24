function add(x: number, y: number): number {
  return x + y;
}

let myAdd1 = function (x: number, y: number): number { return x + y; };

let myAdd2: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y;
}

let myAdd3: (x: number, y: number) => number = function (x, y) {
  return x + y;
}
// myAdd3('1', 2) // Error: require number but get string!字符串不能复制给数值类型

function buildName(firstName: string, lastName: string) {
  return firstName + ' ' + lastName;
}
// buildName('a'); // error, too few parameters
// buildName('a', 'b', 'c'); // error, too many parameters
buildName('a', 'b'); // correct

// 可选参数
function buildName2(firstName: string, lastName?: string): string {
  return firstName + ' ' + lastName;
}
buildName2('1')
// 当第一参数为默认值的时候, 如果想得到默认值需要将对于未知的参数复制为undefined
function buildName3(firstName = 'fir', lastName: string) {
  return firstName + ' ' + lastName;
}
// buildName3('1') // error: too few parameters
// buildName3('1', '1', '1') // error: too many parameters
buildName3('1', '1') // return '1 1'
buildName3(undefined, '1') // return 'fir 1'

function buildName4(firstName: string, ...restName: string[]) {
  return firstName + ' ' + restName.join('');
}
buildName4('a', 'b', 'c', 'd', 'e');

let buildFunc: (firstName: string, ...rest: string[]) => string = buildName4;