# typescript
- 数据类型
  > TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用。
  ```js
    // 布尔值 
    let isShow: boolean = true;
    // 数字     
    let num: number = 1;
    // 字符串
    let str: string = 'hello';
    // 数组
    let arr: number[] = [1, 2, 3]; // 指定数字类型组成的数组
    let arr: Array[] = [1, 2, 3]; // 指定泛类型数组
    // 元组tulpe
    let x: [string, number]; // declare a tulpe
    x = ['a', 1]; // initial it
    x = [1, 'a']; // initial incorrectly
    // 枚举
    enum Color {red, green, blue};
    let c: Color = Color.green;
    // any 当我们不确定值类型时可以通过any来设置值的类型
    let notSure: any = 4;
    // Void
    let unusable: void = undefined;
    // Never类型 表示的是那些永不存在的值的类型
    // 返回never的函数必须存在无法达到的终点
    function error(message: string): never {
        throw new Error(message);
    }
    // 类型断言 没有运行时的影响，只是在编译阶段起作用
    let someValue: any = "this is a string";
    // let strLength: number = (<string>someValue).length;
    let strLength: number = (someValue as string).length; // jsx 里面只有这一种起作用
  ```
- 变量声明
  - const
  ```js
    const numLivesForCat = 9;
    const kitty = {
        name: "Aurora",
        numLives: numLivesForCat,
    }

    // Error
    kitty = {
        name: "Danielle",
        numLives: numLivesForCat
    };

    // all "okay"
    kitty.name = "Rory";
    kitty.name = "Kitty";
    kitty.name = "Cat";
    kitty.numLives--;
  ```
  - let 
  > 引入了块级作用域的概念，不能在同一作用域声明两次相同的变量
  ```js
  // 里面的i是合法的，因为内层的i屏蔽了外层的i
  function sumMatrix(matrix: number[][]) {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (let i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
  } 
  ```
  - 解构赋值
  ```js
  let input = [1, 2];
  // 作用于数组   
  let [first, second] = input;
  // 作用于函数
  function f([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
  }
  f(input)//
  ```
- 接口
  - 可选属性
  ```js
  interface SquareConfig {
    color?: string,
    width?: number
  }
  ```
  - 只读属性
  ```js
  interface Point {
    redonly x: string,
    redonly y: number
  }
  // 你可以通过赋值一个对象字面量来构造一个Point。 赋值后， x和y再也不能被改变了。
  let p1: Point = { x: 10, y: 20 };
  p1.x = 5; // error!
  ```