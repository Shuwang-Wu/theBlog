# Provide & Inject 依赖注入

## intro

### 类型

Vue 2.2.1 或更高版本

- provide: Object | () => Object
- inject: Array<String> | { [localname]: [value] }
  一个字符串数组，或一个对象，对象的 key 是本地的绑定名，value 是在可用的注入内容中搜索用的 key (字符串或 Symbol)，或一个对象，该对象的：
  from 属性是在可用的注入内容中搜索用的 key (字符串或 Symbol)
  default 属性是降级情况下使用的 value
