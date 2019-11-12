/*eslint-disable*/
;
(function (window, undefined) {
	var taskList = [];

	//订阅
	function subscribe() {
		// 创建一个对象，存储需要触发的信息，以及所需要的参数队列
		var param = {};
		var args = Array.prototype.slice.call(arguments);
		// 代码健全
		if (args.length < 1) {
			throw new Error("需要输入信息");
		}
		// 分别给msg args赋值
		param.msg = args[0];
		param.args = args.slice(1);
		// 是否为sleepFirst
		if (param.msg === "sleepFirst") {
			taskList.unshift(param);
		} else {
			taskList.push(param);
		}
	}

	// 发布
	function publish() {
		if (taskList.length >= 1) {
			run(taskList.shift());
		}
	}

	// 暴露接口
	window.LazyMan = function (str) {
		subscribe("lazyMan", str);

		setTimeout(function () {
			publish();
		}, 0);

		return new LazyMan();
	};


	// 定义一个基类
	function LazyMan() {}
	// 定义eat sleep sleepFirst 
	LazyMan.prototype.eat = function (str) {
		subscribe("eat", str);
		return this;
	}
	LazyMan.prototype.sleep = function (num) {
		subscribe("sleep", num);
		return this;
	}
	LazyMan.prototype.sleepFirst = function (num) {
		subscribe("sleepFirst", num);
		return this;
	}

	// 定义输出函数
	function lazyManLog(text) {
		console.log(text);
	}

	// 具体方法
	function lazyMan(str) {
		lazyManLog("Hi!This is " + str + "!");

		publish();
	}

	function eat(str) {
		lazyManLog("Eat " + str + "~");
		publish();
	}

	function sleep(num) {
		setTimeout(function () {
			lazyManLog("Wake up after " + num);
			publish();
		}, num * 1000);

	}

	function sleepFirst(num) {
		setTimeout(function () {
			lazyManLog("Wake up after " + num);

			publish();
		}, num * 1000);
	}

	// 实现run方法
	function run(option) {
		var msg = option.msg;
		var args = option.args;

		switch (msg) {
			case "lazyMan":
				lazyMan.apply(null, args);
				break;
			case "eat":
				eat.apply(null, args);
				break;
			case "sleep":
				sleep.apply(null, args);
				break;
			case "sleepFirst":
				sleepFirst.apply(null, args);
				break;
			default:
				;
		}
	}


})(window);



// LazyMan("Kent").eat("dinner").eat("supper").sleep(2).sleepFirst(2);
LazyMan("Hank").sleep(1).eat("supper").sleep(2);
// LazyMan("Hank").eat("dinner").eat("supper").sleep(3).sleepFirst(2);