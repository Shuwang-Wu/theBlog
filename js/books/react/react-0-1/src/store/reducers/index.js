/*
 * @author       : shuwang.wu@getech.cn
 * @createdDate  : 2020-08-27 17:28:40
 * @version      : 1.0
 * @modifier     : shuwang.wu@getech.cn
 * @modifiedDate : 2020-08-28 10:29:49
 * @reason       :
 * @FilePath     : \webpack-1\src\store\reducers\index.js
 */
import { combineReducers } from 'redux'
import todos from './todo'
import visibilityFilter from './visibilityFilter'

export default combineReducers({
  todos,
  visibilityFilter
})
