<!--
 * @Author: Shuwang_wu
 * @Date: 2024-01-03 10:02:18
 * @LastEditTime: 2024-01-03 15:28:51
 * @LastEditors: Shuwang_wu
 * @FilePath: \theBlog\js\babel7\README.md
 * @Description: please edit
-->
# Babel 7

## 配置文件

1. babel.config.js
2. .babelrc
3. package.json配置babel字段
4. .babelrc.js

最常用的是babel.config.js 和 .babelrc,Babel官方推荐babel.config.js，因为该配置是项目级别的配置，会影响这个项目的代码，包括node_modules.
有了babel.config.js就不会执行.babelrc

## 工作过程

1. 解析

   - 词法分析
   - 语法分析

2. 转换

   - 遍历抽象语法树（AST），进行相应的转换

3. 生成

   - 根据转换后的AST重新生成代码

## 插件

1. 语法插件

   - 转换新的语法

2. 转译插件

   - 转换新的API

3. 预设

   - 是一组插件的集合

## 预设

1. @babel/preset-env

   - 转换新的语法

2. @babel/preset-react

   - 转换新的JSX语法

3. @babel/preset-typescript

   - 转换新的TypeScript语法

4. @babel/preset-flow

   - 转换新的Flow语法

5. @babel/preset-minify

   - 压缩代码

## 插件

1. @babel/plugin-transform-arrow-functions

   - 转换箭头函数

2. @babel/plugin-transform-block-scoping

   - 转换块级作用域

3. @babel/plugin-transform-classes

   - 转换类

4. @babel/plugin-transform-computed-properties

   - 转换计算属性

5. @babel/plugin-transform-destructuring
   - 转换解构赋值

6. @babel/plugin-transform-dotall-regex

   - 转换正则表达式

7. @babel/plugin-transform-duplicate-keys

   - 转换重复的键
8. @babel/plugin-transform-exponentiation-operator

   - 转换指数运算符

9. @babel/plugin-transform-for-of

   - 转换for...of循环
10. @babel/plugin-transform-function-name

- 转换函数名
  
11. @babel/plugin-transform-literals

- 转换字面量

12. @babel/plugin-transform-modules

- 转换模块化

13. @babel/plugin-transform-modules-amd

- 转换AMD模块化

14. @babel/plugin-transform-modules-commonjs

- 转换CommonJS模块化

15. @babel/plugin-transform-modules-systemjs

- 转换SystemJS模块化

16. @babel/plugin-transform-named-capturing-groups

- 转换命名捕获组

17. @babel/plugin-transform-new-target

- 转换new.target

18. @babel/plugin-transform-object-super

- 转换对象super

19. @babel/plugin-transform-parameters

- 转换函数参数

20. @babel/plugin-transform-property-literals

- 转换属性字面量

21. @babel/plugin-transform-regenerator

- 转换regenerator

22. @babel/plugin-transform-reserved-words

- 转换保留字

23. @babel/plugin-transform-shorthand-properties

- 转换简写属性

24. @babel/plugin-transform-spread

- 转换展开运算符

25. @babel/plugin-transform-sticky-regex

- 转换粘性正则表达式

26. @babel/plugin-transform-template-literals

- 转换模板字符串

27. @babel/plugin-transform-typeof-symbol

- 转换typeof符号

28. @babel/plugin-transform-typeof-symbol

- 转换typeof符号

29. @babel/plugin-transform-unicode-regex

- 转换Unicode正则表达式

30. @babel/plugin-transform-block-scoping

- 转换块作用域

31. @babel/plugin-transform-block-scoping

- 转换块作用域

32. @babel/plugin-transform-classes

- 转换类

33. @babel/plugin-transform-computed-properties

- 转换计算属性

34. @babel/plugin-transform-destructuring

- 转换解构

35. @babel/plugin-transform-dotall-regex

- 转换全匹配正则表达式

36. @babel/plugin-transform-duplicate-keys

- 转换重复键

37. @babel/plugin-transform-exponentiation-operator

- 转换指数运算符

38. @babel/plugin-transform-for-of

- 转换for-of循环

39. @babel/plugin-transform-function-name

- 转换函数名

40. @babel/plugin-transform-literals

- 转换字面量

41. @babel/plugin-transform-modules-amd

- 转换AMD模块

42. @babel/plugin-transform-modules-commonjs

- 转换CommonJS模块

43. @babel/plugin-transform-modules-systemjs

- 转换SystemJS模块

44. @babel/plugin-transform-modules-umd

- 转换UMD模块

45. @babel/plugin-transform-named-capturing-groups-regex

- 转换命名捕获组正则表达式

46. @babel/plugin-transform-new-target

- 转换new.target

47. @babel/plugin-transform-object-super

- 转换对象super

48. @babel/plugin-transform-parameters

- 转换函数参数

49. @babel/plugin-transform-property-literals

- 转换属性字面量

50. @babel/plugin-transform-regenerator

- 转换regenerator

51. @babel/plugin-transform-reserved-words

- 转换保留字

52. @babel/plugin-transform-shorthand-properties

- 转换简写属性

53. @babel/plugin-transform-spread

- 转换spread

54. @babel/plugin-transform-sticky-regex

- 转换粘性正则表达式

55. @babel/plugin-transform-template-literals

- 转换模板字面量

56. @babel/plugin-transform-typeof-symbol

- 转换typeof符号

57. @babel/plugin-transform-typeof-symbol

- 转换typeof符号

58. @babel/plugin-transform-unicode-regex

- 转换Unicode正则表达式
