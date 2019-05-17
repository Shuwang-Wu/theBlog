# react-router

[react-router](https://github.com/ReactTraining/react-router/tree/master/packages/react-router)

```js
$ npm install -S react-router
```

> if you are writting an application that will run in the browser, you should instead install **react-router-dom**.
> Similarly, if you are writting an React Native application, you should instead install **react-router-native**.
> Both of those will will install **react-router** as a dependency.

# react-router-dom

[react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)

```js
$ npm install -S react-router-dom
```

> then with a module bundler like webpack, use as you would anything else:

```js
import { browserRouter as Router, Route, Link } from 'react-router-dom'
```

```html
<Router>
  <Route path="/" component="{Home}" />
  <Route path="/login" component="{Login}" />
</Router>
```
