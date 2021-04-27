<!-- # Bubble Sort -->
<!-- ![](../images/bubbleSort.gif 'bubble sort') -->
```js
var arr = [5, 1, 9, 2, 3];
function bubbleSort_1(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('[err][param]: only support array !!')
  }
	for (var j=arr.length; j>0; j--) {
		var num = arr[j];
		for (var i=0; i<j; i++) {
      // 关键在于交换各自的位置
      arr[i] > arr [i+1] && [arr[i], arr[i+1]] = [arr[i+1], arr[i]]
		}
	}
	return arr;
}
function bubbleSort_2(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('[err][param]: only support array !!')
  }
  let i = arr.length - 1;
  while (!!i) {
    var pos = 0;
    for (var j = 0; j < i; j++) {
      // 优化在于减少循环的次数
      if (arr[j] > arr[j + 1]) {
        pos = j;
        [arr[j], arr[j + 1]] = [arr[j+1], arr[j]]
      }
    }
    i = pos;
  }
	return arr; 
}
var result_bubble = arrSort(arr);
console.log(result_bubble);
```
<!-- # Quick Sort -->
```js
function quickSort(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('[err][param]: only support array !!')
  }
  if (arr.length <= 1) {
    return arr;
  }
  // 设置基准数
  let pivotIndex = parseInt(arr.length/2);
  let pivot = arr.splice(pivotIndex, 1)[0]
  
  let left = [];
  let right = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  }
  
  return quickSort(left).concat([pivot], quickSort(right))
}
```
<!-- # insertion Sort -->
```js
var arr = [1, 3, 4, 52, 4, 623, 6, 8, 9]
function insertionSort(arr) {
  if (arr.length <= 1) {
    return arr
  }
  let len = arr.length
  // 以最后一个元素为基准进行插入排序
  let result = []
  result.push(arr[len - 1])
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < result.length; j++) {
      if (arr[i] < result[j]) {
        result.splice(j, 0, arr[i])
        break
      } 
      if (j >= copy.length - 1) {
        result.push(arr[i])
      }
    }
    console.log(result)
  }
  return result
}
insertionSort(arr)
```