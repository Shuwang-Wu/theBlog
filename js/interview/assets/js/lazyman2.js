/*eslint-disable*/
// 这里传入window undefined是为了避免命名冲突，而传入undefined是为了避免undefin被改写或者是重新赋值
;
(function(window, undefined) {
	var taskList = [];
	// 訂閲
	function subscribe() {
		var param = {};
		var args = Array.prototype.slice.call(arguments);
		if (args.length < 1) {
			throw new Error("please send params");
		}
		param.msg = args[0];
		param.args = args.slice(1);
		if (param.msg === "sleepFirst") {
			taskList.unshift(param);
		} else {
			taskList.push(param);
		}
		// publish();
	}

	function publish() {
		if (taskList.length >= 1) {
			run(taskList.shift());
		}
		
	}

	function run(param) {
		var {
			msg,
			args
		} = param;
		switch (msg) {
			case "sleepFirst":
				sleepFirst.apply(null, args);
				break;
			case "lazyman":
				lazyMan.apply(null, args);
				break;
			case "eat":
				eat.apply(null, args);
				break;
			case "sleep":
				sleep.apply(null, args);
				break;
			default:
				;
		}
	}

	window.LazyMan = function(name) {
		subscribe("lazyMan", name);
		setTimeout(function() {
			publish();
		}, 0);
		return new LazyMan();

	}

	class LazyMan {
		eat(food) {
			subscribe("eat", food);
			return this;
		}
		sleep(count) {
			subscribe("sleep", count);
			return this;
		}
		sleepFirst(count) {
			subscribe("sleepFirst", count);
			return this;
		}
	}

	function lazyMan(name) {
		console.log("Hi!This is " + name + "!");
		publish();
	}

	function eat(food) {
		console.log("eat" + food + "~");
		publish();
	}

	function sleep(count) {
		setTimeout(function() {
			console.log("wake up for " + count + " second");
			publish();
		}, count * 1000);
	}

	function sleepFirst(count) {
		setTimeout(function() {
			console.log("wake up for " + count + " second");
			publish();
		}, count * 1000);
	}
})(window);
LazyMan("Hank").sleep(1).eat("supper").sleep(2).sleepFirst(2);
