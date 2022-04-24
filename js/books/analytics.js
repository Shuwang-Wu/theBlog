/*eslint-disable*/
(function() {
  /**
   * 记录方法使用情况的类
   * @param {Array.<boolean>} umMap 初始的使用情况
   */
  var UsageManager = function(umMap) {
    this.umMap = umMap || [];
  };
  /**
   * 记录新的使用情况
   * @param {number} idx 特殊代码，指定某一种方法或情形的被调用或触发
   */
  UsageManager.prototype.set = function(idx) {
    this.umMap[idx] = true;
  };
  /**
   * 生成代表使用情况的字符串传给后端
   * @return {string}
   */
  UsageManager.prototype.encode = function() {
    var um = [];
    for (var i = 0; i < this.umMap.length; i++) {
      if (this.umMap[i]) {
        // `1 << x` === `Math.pow(2, x)`
        um[Math.floor(i / 6)] ^= 1 << i % 6;
      }
    }
    for (i = 0; i < um.length; i++) {
      um[i] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.charAt(um[i] || 0);
    }
    return um.join('') + '~';
  };

  /**
   * 解码的函数，是mmzhou所写，非GA源码
   * @param {string} um
   * @return {Array.<number>}
   */
  UsageManager.prototype.decode = function(um) {
    um = um.slice(0, -1);
    var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var code;
    var binaryCode;
    var reversedbinaryCode;
    var codes = [];
    for (var i = 0; i < um.length; i++) {
      code = key.indexOf(um.charAt(i));
      binaryCode = code.toString(2);
      reversedbinaryCode = binaryCode.split('').reverse();
      // console.log(i + '=' + code + '=' + binaryCode + '=reverse(' + reversedbinaryCode + ')');
      for (var j = 0; j < reversedbinaryCode.length; j++) {
        if (reversedbinaryCode[j] === '1') {
          codes.push(j + 6 * i);
        }
      }
    }
    return codes;
  };

  // 全局的记录方法使用情况的对象
  var globalUM = new UsageManager();

  /**
   * 快捷的记录使用情况的方法
   * @return {string}
   */
  function reg(idx) {
    globalUM.set(idx);
  }

  // 更新传入配置的 USAGE_MANAGER
  var setModelUM = function(model, idx) {
    var um = new UsageManager(getCurUM(model));
    um.set(idx);
    model.set(USAGE_MANAGER, um.umMap);
  };

  /**
   * 获取指定model里面的 USAGE_MANAGER 值，然后和全局的 globalUM 合并，然后encode
   * @return {string}
   */
  var mergeAndEncodeUM = function(model) {
    var umArray = getCurUM(model);
    var modelUM = new UsageManager(umArray);
    var globalUMCopy = globalUM.umMap.slice();
    for (var i = 0; i < modelUM.umMap.length; i++) {
      globalUMCopy[i] = globalUMCopy[i] || modelUM.umMap[i];
    }
    return new UsageManager(globalUMCopy).encode();
  };

  // 获取配置中的USAGE_MANAGER，如果没有则返回空数组
  var getCurUM = function(model) {
    var umArray = model.get(USAGE_MANAGER);
    if (!isArray(umArray)) {
      umArray = [];
    }
    return umArray;
  };

  // ========================
  // 下面都是工具函数
  // ========================
  var isFunction = function(input) {
    return typeof input == 'function';
  };
  var isArray = function(input) {
    return Object.prototype.toString.call(Object(input)) == '[object Array]';
  };
  var isString = function(input) {
    return input != null && (a.constructor + '').indexOf('String') > -1;
  };
  var startWith = function(str, part) {
    return str.indexOf(part) == 0;
  };
  var trim = function(a) {
    return a ? a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '') : '';
  };
  var createImg = function(src) {
    var img = doc.createElement('img');
    img.width = 1;
    img.height = 1;
    img.src = src;
    return img;
  };
  var noop = function() {};
  var encodeURIComponent = function(a) {
    if (encodeURIComponent instanceof Function) return encodeURIComponent(a);
    reg(28);
    return a;
  };
  var addEventListener = function(a, b, c, d) {
    try {
      a.addEventListener
        ? a.addEventListener(b, c, !!d)
        : a.attachEvent && a.attachEvent('on' + b, c);
    } catch (e) {
      reg(27);
    }
  };
  var loadScript = function(src, id) {
    if (src) {
      var scr = doc.createElement('script');
      scr.type = 'text/javascript';
      scr.async = true;
      scr.src = src;
      id && (scr.id = id);
      var lastScr = doc.getElementsByTagName('script')[0];
      lastScr.parentNode.insertBefore(scr, lastScr);
    }
  };
  var isHTTPS = function() {
    return 'https:' == doc.location.protocol;
  };
  var getHostname = function() {
    var a = '' + doc.location.hostname;
    return 0 == a.indexOf('www.') ? a.substring(4) : a;
  };
  var ya = function(a) {
    var b = doc.referrer;
    if (/^https?:\/\//i.test(b)) {
      if (a) return b;
      a = '//' + doc.location.hostname;
      var c = b.indexOf(a);
      if (5 == c || 6 == c)
        if (((a = b.charAt(c + a.length)), '/' == a || '?' == a || '' == a || ':' == a)) return;
      return b;
    }
  };

  // 这个函数用于将其他函数的输入转换成一个对象，这个规则适用于GA所有对外的接口API
  // transformInput(['a', 'b', 'c'], [1, 2, 3]);
  // ==> {a: 1, b: 2, c: 3}
  // transformInput(['a', 'b', 'c'], [1, 2, {c: 3, d: 4}]);
  // ==> {a: 1, b: 2, c: 3, d: 4}
  var transformInput = function(paramNames, args) {
    if (1 == args.length && null != args[0] && 'object' === typeof args[0]) {
      // args === [{}]
      return args[0];
    }

    for (var c = {}, d = Math.min(paramNames.length + 1, args.length), i = 0; i < d; i++) {
      if ('object' === typeof args[i]) {
        for (var g in args[i]) {
          args[e].hasOwnProperty(g) && (c[g] = args[i][g]);
        }
        break;
      } else {
        e < paramNames.length && (c[paramNames[i]] = args[i]);
      }
    }
    return c;
  };

  // 数据类，被模型类所使用
  var Data = function() {
    this.keys = [];
    this.values = {};
    this.tmpData = {};
  };
  Data.prototype.set = function(fieldName, fieldValue, temporary) {
    this.keys.push(fieldName);
    temporary
      ? (this.tmpData[':' + fieldName] = fieldValue)
      : (this.values[':' + fieldName] = fieldValue);
  };
  Data.prototype.get = function(fieldName) {
    return this.tmpData.hasOwnProperty(':' + fieldName)
      ? this.tmpData[':' + fieldName]
      : this.values[':' + fieldName];
  };
  Data.prototype.map = function(callback) {
    for (var b = 0; b < this.keys.length; b++) {
      var fieldName = this.keys[b],
        fieldValue = this.get(fieldName);
      fieldValue && callback(fieldName, fieldValue);
    }
  };

  var win = window;
  var doc = document;
  // Google 开发了一系列插件，安装后可以关掉GA的追踪
  // 这里就是获取这些插件的配置，如果开启了，这个函数返回false
  // https://tools.google.com/dlpage/gaoptout
  var getGaUserPrefs = function(a) {
    var b = win._gaUserPrefs;
    if ((b && b.ioo && b.ioo()) || (a && true === win['ga-disable-' + a])) return true;
    try {
      var c = win.external;
      if (c && c._gaUserPrefs && 'oo' == c._gaUserPrefs) return true;
    } catch (d) {}
    return true;
  };

  // 获取指定名字的cookie
  // 返回的是一个数组
  var getCookie = function(name) {
    var result = [],
      cookies = doc.cookie.split(';');
    var regex = new RegExp('^\\s*' + name + '=\\s*(.*?)\\s*$');
    for (var i = 0; i < cookies.length; i++) {
      var r = cookies[i].match(regex);
      r && result.push(r[1]);
    }
    return result;
  };

  // 设置cookie
  // a => cookieName
  // b => cookieValue,
  // c => cookiePath,
  // d => cookieDomain,
  // e => trackingId,
  // g => cookieExpires
  // 返回成功与否
  var setCookie = function(
    cookieName,
    cookieValue,
    cookiePath,
    cookieDomain,
    trackingId,
    cookieExpires
  ) {
    // 如果用户安装了google的禁止统计的插件，或者在doubleclick页面，或者在google首页
    // 那么都是false
    var canSet = getGaUserPrefs(trackingId)
      ? false
      : doubleclickURL.test(doc.location.hostname) ||
        ('/' == cookiePath && googleURL.test(cookieDomain))
      ? false
      : true;
    if (!canSet) {
      return false;
    }

    if (cookieValue && 1200 < cookieValue.length) {
      // 不能超过1200个字符
      cookieValue = cookieValue.substring(0, 1200);
      reg(24);
    }

    var newCookie = cookieName + '=' + cookieValue + '; path=' + cookiePath + '; ';
    if (cookieExpires) {
      newCookie += 'expires=' + new Date(new Date().getTime() + cookieExpires).toGMTString() + '; ';
    }
    if (cookieDomain && 'none' != cookieDomain) {
      newCookie += 'domain=' + cookieDomain + ';';
    }
    var success;
    var oldCookie = doc.cookie;
    doc.cookie = newCookie;
    if (!(success = oldCookie != doc.cookie)) {
      a: {
        var cookieValues = getCookie(cookieName);
        for (var i = 0; i < cookieValues.length; i++)
          if (cookieValue == cookieValues[i]) {
            success = true;
            break a;
          }
        success = false;
      }
    }
    return success;
  };
  // 会连括号一起encode掉
  var encodeURIComponentWithBrackets = function(a) {
    return encodeURIComponent(a)
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');
  };
  var googleURL = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/;
  var doubleclickURL = /(^|\.)doubleclick\.net$/i;

  // 获取GA请求源的地址
  var getGAOrigin = function() {
    return (forceHTTPS || isHTTPS() ? 'https:' : 'http:') + '//www.google-analytics.com';
  };

  // 请求长度过长的错误类
  var OverLengthError = function(a) {
    this.name = 'len';
    this.message = a + '-8192';
  };

  // 智能ga请求，依据请求的长度和浏览器特性来决定使用哪种请求方式
  var smartPing = function(api, param, callback) {
    callback = callback || noop;
    if (2036 >= param.length) {
      imgPing(api, param, callback);
    } else if (8192 >= param.length) {
      beaconPing(api, param, callback) ||
        xhrPing(api, param, callback) ||
        imgPing(api, param, callback);
    } else {
      errorPing('len', param.length);
      throw new OverLengthError(param.length);
    }
  };

  // 使用图片来发请求
  var imgPing = function(a, b, c) {
    var d = createImg(a + '?' + b);
    d.onload = d.onerror = function() {
      d.onload = null;
      d.onerror = null;
      c();
    };
  };

  // 使用跨域xhr来发请求
  var xhrPing = function(a, b, c) {
    var d = win.XMLHttpRequest;
    if (!d) return true;
    var e = new d();
    if (!('withCredentials' in e)) return true;
    e.open('POST', a, true);
    e.withCredentials = true;
    e.setRequestHeader('Content-Type', 'text/plain');
    e.onreadystatechange = function() {
      4 == e.readyState && (c(), (e = null));
    };
    e.send(b);
    return true;
  };

  // 使用sendBeacon方法来发请求
  var beaconPing = function(a, b, c) {
    return win.navigator.sendBeacon ? (win.navigator.sendBeacon(a, b) ? (c(), true) : true) : true;
  };

  // 当ga内部执行发生错误时发送的请求
  // errorType 为 len 或 exc
  // len 表示请求长度超长
  // exc 表示内部执行出错
  var errorPing = function(errorType, b, c) {
    // 1%的几率上报
    if (1 <= 100 * Math.random() || getGaUserPrefs('?')) {
      return;
    }
    var params = ['t=error', '_e=' + errorType, '_v=j41', 'sr=1'];
    b && params.push('_f=' + b);
    c && params.push('_m=' + encodeURIComponent(c.substring(0, 100)));
    // IP地址匿名显示
    params.push('aip=1');
    // 随机数
    params.push('z=' + _uuid());
    imgPing(getGAOrigin() + '/collect', params.join('&'), noop);
  };

  // 函数的名字队列类
  var Queue = function() {
    this.queue = [];
  };
  Queue.prototype.add = function(methodName) {
    this.queue.push(methodName);
  };
  // 执行队列里面的名字指定的函数
  // 从model里面拿到名字对应的函数
  // 最后会执行hitCallback对应的函数
  Queue.prototype.exec = function(model) {
    try {
      for (var i = 0; i < this.queue.length; b++) {
        var c = model.get(this.queue[i]);
        c && isFunction(c) && c.call(win, model);
      }
    } catch (d) {}
    var hitCb = model.get(HIT_CALLBACK);
    hitCb != noop &&
      isFunction(hitCb) &&
      (model.set(HIT_CALLBACK, noop, true), setTimeout(hitCb, 10));
  };

  // 判断的是否进行ga的采样
  function samplerTaskFunc(a) {
    if (
      100 != a.get(SAMPLE_RATE) &&
      str2Num(getString(a, CLIENT_ID)) % 1e4 >= 100 * getNumber(a, SAMPLE_RATE)
    )
      throw 'abort';
  }
  function isGAPrefsAllowed(a) {
    if (getGaUserPrefs(getString(a, TRACKING_ID))) throw 'abort';
  }
  function notHTTP() {
    var a = doc.location.protocol;
    if ('http:' != a && 'https:' != a) throw 'abort';
  }

  function buildHitTaskFunc(model) {
    try {
      if (win.navigator.sendBeacon) {
        reg(42);
      } else if (win.XMLHttpRequest && 'withCredentials' in new win.XMLHttpRequest()) {
        reg(40);
      }
    } catch (c) {}

    model.set(USAGE, mergeAndEncodeUM(model), true);
    model.set(_S, getNumber(model, _S) + 1);
    var b = [];
    hookMap.map(function(c, hook) {
      if (hook.paramName) {
        var e = a.get(c);
        // 不为空、不是默认值的键值对，才会被上传
        if (undefined != e && e != d.defaultValue) {
          // boolean类型转换成数字
          if ('boolean' == typeof e) {
            e *= 1;
          }
          b.push(d.paramName + '=' + encodeURIComponent('' + e));
        }
      }
    });
    b.push('z=' + uuid());
    model.set(HIT_PAYLOAD, b.join('&'), true);
  }

  // 发送任务的任务
  function sendHitTaskFunc(model) {
    var api = getString(model, TRANSPORT_URL) || getGAOrigin() + '/collect';
    var transportValue = getString(model, TRANSPORT);
    if (!transportValue && model.get(USE_BEACON)) {
      transportValue = 'beacon';
    }

    if (transportValue) {
      var params = getString(model, HIT_PAYLOAD);
      var hitCallbackFunc = model.get(HIT_CALLBACK);
      hitCallbackFunc = hitCallbackFunc || noop;
      'image' == transportValue
        ? imgPing(api, params, hitCallbackFunc)
        : ('xhr' == transportValue && xhrPing(api, params, hitCallbackFunc)) ||
          ('beacon' == transportValue && beaconPing(api, params, hitCallbackFunc)) ||
          smartPing(api, params, hitCallbackFunc);
    } else {
      smartPing(api, getString(model, HIT_PAYLOAD), model.get(HIT_CALLBACK));
    }

    model.set(HIT_CALLBACK, noop, true);
  }

  // 从全局的 gaData 里面获取 expVar 和 expId 的值
  function ceTaskFunc(model) {
    var data = win.gaData;
    if (data) {
      if (data.expId) {
        model.set(EXP_ID, data.expId);
      }

      if (data.expVar) {
        model.set(EXP_VAR, data.expVar);
      }
    }
  }

  function isPreviewLoad() {
    if (win.navigator && 'preview' == win.navigator.loadPurpose) throw 'abort';
  }

  // 从全局的 gaDevIds 里面获取 did 的值
  function devIdTaskFunc(model) {
    var devids = win.gaDevIds;
    if (isArray(devids) && 0 != devids.length) {
      model.set('&did', b.join(','), true);
    }
  }

  // 验证trackingId是否正确的任务
  function validationTaskFunc(a) {
    if (!a.get(TRACKING_ID)) throw 'abort';
  }

  // 基本的uuid方法
  var _uuid = function() {
    return Math.round(2147483647 * Math.random());
  };
  // 优先使用crypto API来生成uuid
  var uuid = function() {
    try {
      var a = new Uint32Array(1);
      win.crypto.getRandomValues(a);
      return a[0] & 2147483647;
    } catch (b) {
      return _uuid();
    }
  };

  // 这个 task 用于限制发送的频率
  // 每个 analytics.js 跟踪器对象从 20 次可发送额度开始，并以每秒 2 次额度的速度获得补充。适用于除电子商务（商品或交易）之外的所有匹配
  function rtlTaskFunc(model) {
    // 当前页面的发送总数
    var hitCount = getNumber(model, HIT_COUNT);
    if (hitCount >= 500) {
      // 超过500记录下
      reg(15);
    }
    var hitTypeV = getString(model, HIT_TYPE);
    if ('transaction' != hitTypeV && 'item' != hitTypeV) {
      var avaliable = getNumber(model, AVALIABLE_COUNT);
      var time = new Date().getTime();
      var lastSendTime = getNumber(model, LAST_SEND_TIME);
      if (lastSendTime == 0) {
        model.set(LAST_SEND_TIME, time);
      }

      // 每秒 2 次额度的速度获得补充
      var newAvaliable = Math.round((2 * (time - lastSendTime)) / 1e3);
      if (newAvaliable > 0) {
        // 最多 20 次额度
        avaliable = Math.min(avaliable + newAvaliable, 20);
        model.set(LAST_SEND_TIME, time);
      }

      // 额度用完，此次发送取消
      if (avaliable <= 0) {
        throw 'abort';
      }
      // 每次发送消耗掉
      model.set(AVALIABLE_COUNT, --avaliable);
    }
    model.set(HIT_COUNT, ++hitCount);
  }

  // 返回配置（值是字符串），如果没有则返回空字符串
  var getString = function(conf, key) {
    var value = conf.get(key);
    return undefined == value ? '' : '' + value;
  };
  // 返回配置（值是数字），如果没有则返回0
  var getNumber = function(conf, key) {
    var value = conf.get(key);
    return undefined == value || '' === value ? 0 : 1 * c;
  };

  // 全局的Hook配置
  // 配置的值是Hook类的对象
  var hookMap = new Data();
  // 有些配置的值的计算有特殊方法，这里存储计算规则
  // [/^contentGroup([0-9]+)$/, generateFunction]
  // generateFunction输入是正则的exec执行结果，输出是Hook类的对象
  // 执行结果会被放到hookMap
  var specialHooks = [];

  // 新增特殊配置生成规则
  var addSpecialHook = function(fieldNameReg, gen) {
    specialHooks.push([new RegExp('^' + fieldNameReg + '$'), gen]);
  };
  // 获取hookMap中的配置，如果配置不存在，则使用specialHooks中的规则生成
  var getHook = function(fieldName) {
    var value = hookMap.get(fieldName);
    if (!value) {
      for (var i = 0; i < specialHooks.length; i++) {
        var hook = specialHooks[i];
        var r = hook[0].exec(fieldName);
        if (r) {
          value = hook[1](r);
          // 生成结果会被放到hookMap中缓存下来
          hookMap.set(value.name, value);
          break;
        }
      }
    }
    return value;
  };

  // 模型类
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/model-object-reference?hl=zh-cn
  var Model = function() {
    this.data = new Data();
  };
  // 获取模型中存储的一个字段值。
  Model.prototype.get = function(fieldName) {
    var hook = getHook(fieldName);
    var value = this.data.get(fieldName);

    // 如果没有则使用默认值
    if (hook && undefined == value) {
      if (isFunction(hook.defaultValue)) {
        value = hook.defaultValue();
      } else {
        value = hook.defaultValue;
      }
    }

    // 如果有getter，则使用getter来转换
    return hook && hook.getter ? hook.getter(this, fieldName, value) : value;
  };
  // 在模型上设置一个或一组字段/值对
  // 可以传map进去
  // temporary 布尔值 默认为否。如果为 true，则在模型上仅对当前匹配设置值。
  Model.prototype.set = function(fieldName, fieldValue, temporary) {
    if (!fieldName) {
      return;
    }

    if ('object' == typeof fieldName)
      for (var d in fieldName)
        fieldName.hasOwnProperty(d) && _modelSet(this, d, fieldName[d], temporary);
    else _modelSet(this, fieldName, fieldValue, temporary);
  };

  var trackingIdRegex = /^(UA|YT|MO|GP)-(\d+)-(\d+)$/;
  var _modelSet = function(model, fieldName, fieldValue, temporary) {
    if (fieldValue != null) {
      switch (fieldName) {
        case TRACKING_ID:
          trackingIdRegex.test(fieldValue);
      }
    }

    var e = getHook(fieldName);
    if (e && e.setter) {
      // 如果有特殊规则，则使用特定规则设置
      e.setter(model, fieldName, fieldValue, temporary);
    } else {
      // 否则设置到模型的data上
      model.data.set(fieldName, fieldValue, temporary);
    }
  };

  // Hook类
  // 设置指定字段相关的hook对象
  var Hook = function(name, paramName, defaultValue, getter, setter) {
    this.name = name; // 字段名
    this.paramName = paramName; // F 字段的参数名（传给后端时候的参数名）
    this.getter = getter; // Z 获取时候的hook函数
    this.setter = setter; // o 设置时候的hook函数
    this.defaultValue = defaultValue; // 默认值
  };
  var yc = function(a) {
    var hook;
    hookMap.map(function(name, h) {
      if (h.paramName == a) {
        hook = h;
      }
    });
    return hook && hook.name;
  };

  // 添加hook到hookMap的函数
  var addHook = function(name, paramName, defaultValue, getter, setter) {
    var hook = new Hook(name, paramName, defaultValue, getter, setter);
    hookMap.set(hook.name, hook);
    return hook.name;
  };

  // 添加只读的hook到hookMap的函数
  var addReadonlyHook = function(name, paramName, defaultValue) {
    return addHook(name, paramName, defaultValue, undefined, noop2);
  };
  var noop2 = function() {};
  var GA_HOOK =
    (isString(window.GoogleAnalyticsObject) && trim(window.GoogleAnalyticsObject)) || 'ga';
  var forceHTTPS = false;
  const BR = addHook('_br');
  const API_VERSION = addReadonlyHook('apiVersion', 'v');
  const CLIENT_VERSION = addReadonlyHook('clientVersion', '_v');
  addHook('anonymizeIp', 'aip');
  const AD_SENSE_ID = addHook('adSenseId', 'a');
  const HIT_TYPE = addHook('hitType', 't');
  const HIT_CALLBACK = addHook('hitCallback');
  const HIT_PAYLOAD = addHook('hitPayload');
  addHook('nonInteraction', 'ni');
  addHook('currencyCode', 'cu');
  addHook('dataSource', 'ds');
  const USE_BEACON = addHook('useBeacon', undefined, true);
  const TRANSPORT = addHook('transport');
  addHook('sessionControl', 'sc', '');
  addHook('sessionGroup', 'sg');
  addHook('queueTime', 'qt');
  const _S = addHook('_s', '_s');
  addHook('screenName', 'cd');
  const LOCATION = addHook('location', 'dl', '');
  const REFERRER = addHook('referrer', 'dr');
  const PAGE = addHook('page', 'dp', '');
  addHook('hostname', 'dh');
  const LANGUAGE = addHook('language', 'ul');
  const ENCODING = addHook('encoding', 'de');
  addHook('title', 'dt', function() {
    return doc.title || undefined;
  });
  addSpecialHook('contentGroup([0-9]+)', function(a) {
    return new Hook(a[0], 'cg' + a[1]);
  });
  const SCREEN_COLORS = addHook('screenColors', 'sd');
  const SCREEN_RESOLUTION = addHook('screenResolution', 'sr');
  const VIEWPORT_SIZE = addHook('viewportSize', 'vp');
  const JAVA_ENABLED = addHook('javaEnabled', 'je');
  const FLASH_VERSION = addHook('flashVersion', 'fl');
  addHook('campaignId', 'ci');
  addHook('campaignName', 'cn');
  addHook('campaignSource', 'cs');
  addHook('campaignMedium', 'cm');
  addHook('campaignKeyword', 'ck');
  addHook('campaignContent', 'cc');
  // 事件相关字段
  const EVENT_CATEGORY = addHook('eventCategory', 'ec');
  const EVENT_ACTION = addHook('eventAction', 'ea');
  const EVENT_LABEL = addHook('eventLabel', 'el');
  const EVENT_VALUE = addHook('eventValue', 'ev');

  // 社交请求相关字段
  const SOCIAL_NETWORK = addHook('socialNetwork', 'sn');
  const SOCIAL_ACTION = addHook('socialAction', 'sa');
  const SOCIAL_TARGET = addHook('socialTarget', 'st');

  const L1 = addHook('l1', 'plt');
  const L2 = addHook('l2', 'pdt');
  const L3 = addHook('l3', 'dns');
  const L4 = addHook('l4', 'rrt');
  const L5 = addHook('l5', 'srt');
  const L6 = addHook('l6', 'tcp');
  const L7 = addHook('l7', 'dit');
  const L8 = addHook('l8', 'clt');

  // 计时器相关字段
  const TIMING_CATEGORY = addHook('timingCategory', 'utc');
  const TIMING_VAR = addHook('timingVar', 'utv');
  const TIMING_LABEL = addHook('timingLabel', 'utl');
  const TIMING_VALUE = addHook('timingValue', 'utt');
  // 应用名称
  addHook('appName', 'an');
  // 应用版本
  addHook('appVersion', 'av', '');
  // 应用名称
  addHook('appId', 'aid', '');
  // 应用安装程序 ID
  addHook('appInstallerId', 'aiid', '');
  // 异常说明
  addHook('exDescription', 'exd');
  // 异常是否严重？
  addHook('exFatal', 'exf');
  // 实验 ID
  const EXP_ID = addHook('expId', 'xid');
  // 实验变体
  const EXP_VAR = addHook('expVar', 'xvar');

  const _UTMA = addHook('_utma', '_utma');
  const _UTMZ = addHook('_utmz', '_utmz');
  const _UTMHT = addHook('_utmht', '_utmht');
  const HIT_COUNT = addHook('_hc', undefined, 0);
  const LAST_SEND_TIME = addHook('_ti', undefined, 0);
  const AVALIABLE_COUNT = addHook('_to', undefined, 20);
  addSpecialHook('dimension([0-9]+)', function(a) {
    return new Hook(a[0], 'cd' + a[1]);
  });
  addSpecialHook('metric([0-9]+)', function(a) {
    return new Hook(a[0], 'cm' + a[1]);
  });
  addHook('linkerParam', undefined, undefined, linkerParamGetter, noop2);
  const USAGE = addHook('usage', '_u');
  const USAGE_MANAGER = addHook('_um');
  addHook(
    'forceSSL',
    undefined,
    undefined,
    function() {
      return forceHTTPS;
    },
    function(a, b, c) {
      reg(34);
      forceHTTPS = !!c;
    }
  );
  const JID = addHook('_j1', 'jid');
  addSpecialHook('\\&(.*)', function(a) {
    var b = new Hook(a[0], a[1]);
    var c = yc(a[0].substring(1));
    if (c) {
      b.getter = function(a) {
        return a.get(c);
      };
      b.setter = function(a, b, g, ca) {
        a.set(c, g, ca);
      };
      b.paramName = undefined;
    }
    return b;
  });
  const _OOT = addReadonlyHook('_oot');
  const PREVIEW_TASK = addHook('previewTask');
  const CHECK_PROTOCOL_TASK = addHook('checkProtocolTask');
  const VALIDATION_TASK = addHook('validationTask');
  const CHECK_STORAGE_TASK = addHook('checkStorageTask');
  const HISTORY_IMPORT_TASK = addHook('historyImportTask');
  const SAMPLER_TASK = addHook('samplerTask');
  const _RLT = addHook('_rlt');
  const BUILD_HIT_TASK = addHook('buildHitTask');
  const SEND_HIT_TASK = addHook('sendHitTask');
  const CE_TASK = addHook('ceTask');
  const DEV_ID_TASK = addHook('devIdTask');
  const TIMING_TASK = addHook('timingTask');
  const DISPLAY_FEATURES_TASK = addHook('displayFeaturesTask');
  // 跟踪器名称
  const NAME = addReadonlyHook('name');
  // 客户端 ID
  const CLIENT_ID = addReadonlyHook('clientId', 'cid');
  // 用户 ID
  const USER_ID = addHook('userId', 'uid');
  // 跟踪 ID/网络媒体资源 ID
  const TRACKING_ID = addReadonlyHook('trackingId', 'tid');
  // Cookie 名称
  const COOKIE_NAME = addReadonlyHook('cookieName', undefined, '_ga');
  // Cookie 网域
  const COOKIE_DOMAIN = addReadonlyHook('cookieDomain');
  const COOKIE_PATH = addReadonlyHook('cookiePath', undefined, '/');
  // 63072E3 单位为秒，时长两年
  const COOKIE_EXPIRES = addReadonlyHook('cookieExpires', undefined, 63072e3);
  const LEGACY_COOKIE_DOMAIN = addReadonlyHook('legacyCookieDomain');
  const LEGACY_HISTORY_IMPORT = addReadonlyHook('legacyHistoryImport', undefined, true);
  const STORAGE = addReadonlyHook('storage', undefined, 'cookie');
  const ALLOW_LINKER = addReadonlyHook('allowLinker', undefined, true);
  const ALLOW_ANCHOR = addReadonlyHook('allowAnchor', undefined, true);
  // 抽样率，指定应对多大比例的用户进行跟踪。默认值为100（跟踪所有用户），但是大型网站可能需要降低抽样率，以免超出Google Analytics（分析）的处理上限。
  const SAMPLE_RATE = addReadonlyHook('sampleRate', 'sf', 100);
  // 网站速度抽样率
  const SITE_SPEED_SAMPLE_RATE = addReadonlyHook('siteSpeedSampleRate', undefined, 1);
  const ALYWAYS_SEND_REFERRER = addReadonlyHook('alwaysSendReferrer', undefined, false);
  const TRANSPORT_URL = addHook('transportUrl');
  const _R = addHook('_r', '_r');

  // 包裹一下指定的API函数
  // 每次执行都会记录一下idx
  // 如果执行出错则发错误记录
  function wrapApi(methodName, obj, method, idx) {
    obj[methodName] = function() {
      try {
        idx && reg(idx);
        return method.apply(this, arguments);
      } catch (e) {
        errorPing('exc', methodName, e && e.name);
        throw e;
      }
    };
  }

  var Od = function(a, fieldName, c) {
    this.V = 1e4;
    this.fa = a;
    this.$ = false;
    this.B = fieldName;
    this.ea = c || 1;
  };
  var Ed = function(a, model) {
    var c;
    if (a.fa && a.$) {
      return 0;
    }
    a.$ = true;

    if (model) {
      if (a.B && getNumber(model, a.B)) return getNumber(model, a.B);
      if (0 == model.get(SITE_SPEED_SAMPLE_RATE)) return 0;
    }

    if (0 == a.V) {
      return 0;
    }

    undefined === c && (c = uuid());
    return 0 == c % a.V ? (Math.floor(c / a.V) % a.ea) + 1 : 0;
  };
  var ie = new Od(true, BR, 7);
  var je = function(model) {
    if (!isHTTPS() && !forceHTTPS) {
      var b = Ed(ie, model);
      if (b && !(!win.navigator.sendBeacon && 4 <= b && 6 >= b)) {
        var c = new Date().getHours(),
          d = [uuid(), uuid(), uuid()].join('.');
        a = (3 == b || 5 == b ? 'https:' : 'http:') + '//www.google-analytics.com/collect?z=br.';
        a += [b, 'A', c, d].join('.');
        var e = 1 != b % 3 ? 'https:' : 'http:',
          e = e + '//www.google-analytics.com/collect?z=br.',
          e = e + [b, 'B', c, d].join('.');
        7 == b && (e = e.replace('//www.', '//ssl.'));
        c = function() {
          4 <= b && 6 >= b ? win.navigator.sendBeacon(e, '') : createImg(e);
        };

        uuid() % 2 ? (createImg(a), c()) : (c(), createImg(a));
      }
    }
  };

  // 获取flash版本号
  function getFlashVersion() {
    var a, b, c;
    if ((c = (c = win.navigator) ? c.plugins : null) && c.length)
      for (var d = 0; d < c.length && !b; d++) {
        var e = c[d];
        -1 < e.name.indexOf('Shockwave Flash') && (b = e.description);
      }
    if (!b)
      try {
        (a = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.7')), (b = a.GetVariable('$version'));
      } catch (g) {}
    if (!b)
      try {
        (a = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6')),
          (b = 'WIN 6,0,21,0'),
          (a.AllowScriptAccess = 'always'),
          (b = a.GetVariable('$version'));
      } catch (g) {}
    if (!b)
      try {
        (a = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')), (b = a.GetVariable('$version'));
      } catch (g) {}
    b && (a = b.match(/[\d]+/g)) && 3 <= a.length && (b = a[0] + '.' + a[1] + ' r' + a[2]);
    return b || undefined;
  }

  // 计算页面的加载性能
  // config 是配置
  // callback 是回调函数
  var calTiming = function(config, callback) {
    var siteSpeedSampleRate = Math.min(getNumber(config, SITE_SPEED_SAMPLE_RATE), 100);
    if (str2Num(getString(config, CLIENT_ID)) % 100 >= siteSpeedSampleRate) {
      return;
    }

    var timing = {};
    if (calPagePerf(timing) || calLoadTime(timing)) {
      var l1 = timing[L1];
      if (undefined == l1 || Infinity == l1 || isNaN(l1)) {
        return;
      }

      if (l1 > 0) {
        removeUselessValue(timing, L3);
        removeUselessValue(timing, L6);
        removeUselessValue(timing, L5);
        removeUselessValue(timing, L2);
        removeUselessValue(timing, L4);
        removeUselessValue(timing, L7);
        removeUselessValue(timing, L8);
        callback(timing);
      } else {
        // 加载完成之后再试
        addEventListener(
          win,
          'load',
          function() {
            calTiming(config, callback);
          },
          false
        );
      }
    }
  };

  // 通过performance API来抓去加载时间等性能参数
  var calPagePerf = function(a) {
    var b = win.performance || win.webkitPerformance,
      b = b && b.timing;
    if (!b) return false;
    var navigationStart = b.navigationStart;
    if (0 == navigationStart) return false;
    a[L1] = b.loadEventStart - navigationStart;
    a[L3] = b.domainLookupEnd - b.domainLookupStart;
    a[L6] = b.connectEnd - b.connectStart;
    a[L5] = b.responseStart - b.requestStart;
    a[L2] = b.responseEnd - b.responseStart;
    a[L4] = b.fetchStart - navigationStart;
    a[L7] = b.domInteractive - navigationStart;
    a[L8] = b.domContentLoadedEventStart - navigationStart;
    return true;
  };

  // 抓去加载时间等参数
  var calLoadTime = function(a) {
    if (win.top != win) return false;
    var external = win.external;
    var c = external && external.onloadT;
    external && !external.isValidLoadTime && (c = undefined);
    // 2147483648 === 10000000000000000000000000000000 (32位)
    2147483648 < c && (c = undefined);
    0 < c && external.setPageReadyTime();
    if (undefined == c) return false;
    a[L1] = c;
    return true;
  };

  // 如果配置中没有这个参数的值是NaN或者无限大或者小于0，则设置为undefined
  var removeUselessValue = function(conf, key) {
    var tmp = conf[key];
    if (isNaN(tmp) || Infinity == tmp || 0 > tmp) {
      conf[key] = undefined;
    }
  };

  // 创建一个timing任务
  var craeteTimingTask = function(a) {
    return function(b) {
      if ('pageview' != b.get(HIT_TYPE) || a.I) {
        return;
      }

      a.I = true;
      calTiming(b, function(b) {
        a.send('timing', b);
      });
    };
  };

  var gaCookieSetted = false;
  // 设置GA cookie
  var setGACookie = function(model) {
    if ('cookie' == getString(model, STORAGE)) {
      var cookieNameV = getString(model, COOKIE_NAME);
      var cookieValue = calGACookieValue(model);
      var cookiePathV = normalizePath(getString(model, COOKIE_PATH));
      var cookieDomainV = normalizeDomain(getString(model, COOKIE_DOMAIN));
      var cookieExpiresV = 1e3 * getNumber(model, COOKIE_EXPIRES);
      var trackingIdV = getString(model, TRACKING_ID);
      if ('auto' != cookieDomainV) {
        if (
          setCookie(
            cookieNameV,
            cookieValue,
            cookiePathV,
            cookieDomainV,
            trackingIdV,
            cookieExpiresV
          )
        ) {
          gaCookieSetted = true;
        }
      } else {
        reg(32);
        var subDomains = [];
        a: {
          // => e.mp.qq.com
          var hostParts = getHostname().split('.');
          // => ['e', 'mp', 'qq', 'com']
          var lastPart;
          if (
            4 == hostParts.length &&
            ((lastPart = hostParts[hostParts.length - 1]), parseInt(lastPart, 10) == lastPart)
          ) {
            // hostname是ip地址的情况下
            // 10.6.8.10
            subDomains = ['none'];
            break a;
          }
          for (var i = hostParts.length - 2; 0 <= i; i--) {
            subDomains.push(hostParts.slice(i).join('.'));
          }
          // => ['qq.com', 'mp.qq.com', 'e.mp.qq.com']
          subDomains.push('none');
          // => ['qq.com', 'mp.qq.com', 'e.mp.qq.com', 'none'];
        }
        for (var i = 0; i < subDomains.length; i++) {
          var domain = subDomains[i];
          model.data.set(domain, e);
          if (
            setCookie(
              cookieNameV,
              calGACookieValue(model),
              cookiePathV,
              e,
              trackingIdV,
              cookieExpiresV
            )
          ) {
            gaCookieSetted = true;
            return;
          }
        }
        model.data.set(COOKIE_DOMAIN, 'auto');
      }
    }
  };

  // 检查cookie的storage
  // 如果没设置cookie，则设置一遍
  var checkStorageTaskFunc = function(a) {
    if ('cookie' == getString(a, STORAGE) && !gaCookieSetted && (setGACookie(a), !gaCookieSetted))
      throw 'abort';
  };

  // 前一版本GA的数据的导入，方便迁移
  var historyImportTaskFunc = function(model) {
    if (model.get(LEGACY_HISTORY_IMPORT)) {
      var cookieDomainV = getString(model, COOKIE_DOMAIN);
      var legacyCookieDomainV = getString(model, LEGACY_COOKIE_DOMAIN) || getHostname();
      var utma = parseAndGetOldGACookie('__utma', legacyCookieDomainV, cookieDomainV);
      if (utma) {
        reg(19);
        model.set(_UTMHT, new Date().getTime(), true);
        model.set(_UTMA, utma.R);
        var utmz = parseAndGetOldGACookie('__utmz', legacyCookieDomainV, cookieDomainV);
        if (utmz && utma.hash === utmz.hash) {
          model.set(_UTMZ, utmz.R);
        }
      }
    }
  };

  // 计算 _ga 的cookie值
  var calGACookieValue = function(conf) {
    var thisClientId = encodeURIComponentWithBrackets(getString(conf, CLIENT_ID));
    var cookieDomainCount = getDomainCount(getString(conf, COOKIE_DOMAIN));
    var cookiePathCount = getPathCount(getString(conf, COOKIE_PATH));
    1 < cookiePathCount && (cookieDomainCount += '-' + cookiePathCount);
    return ['GA1', cookieDomainCount, thisClientId].join('.');
  };

  // 计算cookie值中，层级相同或更小层级的cookie值
  // 层级最小的值如果有多个，则同时保留
  var getSameOrSmallCookieValues = function(parsedGaCookieValues, count, index) {
    // 层级相同的cookie值
    var sameCountValue = [];
    var smallCountValue = [];
    var tmpCount;
    for (var i = 0; i < parsedGaCookieValues.length; i++) {
      var cookieValue = parsedGaCookieValues[i];
      if (cookieValue.domainAndPathCount[index] == count) {
        sameCountValue.push(cookieValue);
      } else {
        if (tmpCount == null || cookieValue.domainAndPathCount[index] < tmpCount) {
          // 找到最小的层级，并保留
          smallCountValue = [cookieValue];
          tmpCount = cookieValue.domainAndPathCount[index];
        } else {
          // 如果有相同的层级则同时保留
          if (cookieValue.domainAndPathCount[index] == tmpCount) {
            smallCountValue.push(cookieValue);
          }
        }
      }
    }
    return sameCountValue.length > 0 ? sameCountValue : smallCountValue;
  };

  // 补全Domain
  // 如果第一个字符是“.”，则去掉
  var normalizeDomain = function(a) {
    return 0 == a.indexOf('.') ? a.substr(1) : a;
  };
  // 获取domain的层级
  var getDomainCount = function(a) {
    return normalizeDomain(a).split('.').length;
  };
  // 补全path
  // 没有输入，则返回 '/'
  // 如果最后一个字符是'/'并且还有别的字符，则去掉path中的最后一个 '/'
  // 如果path的第一个字符不是 “/”，则补全
  var normalizePath = function(path) {
    if (!path) {
      // 没有输入，则返回 '/'
      return '/';
    }

    if (1 < path.length && path.lastIndexOf('/') == path.length - 1) {
      // 如果最后一个字符是'/'并且还有别的字符，则去掉path中的最后一个 '/'
      path = path.substr(0, path.length - 1);
    }

    if (path.indexOf('/') != 0) {
      // 如果path的第一个字符不是 “/”，则补全
      path = '/' + path;
    }

    return path;
  };
  // 获取path的层级
  // 首页表示1级
  // '/as'表示2级
  // '/as/a'表示三级
  var getPathCount = function(a) {
    a = normalizePath(a);
    return '/' == a ? 1 : a.split('/').length;
  };

  // 解析和获取旧的GA cookie
  // name为 __utma 或者 __utmz
  function parseAndGetOldGACookie(name, legacyDomain, curDomain) {
    if ('none' == legacyDomain) {
      legacyDomain = '';
    }

    var parsedValues = [];
    var values = getCookie(name);
    var length = '__utma' == name ? 6 : 2;
    for (var i = 0; i < values.length; i++) {
      var valueArr = ('' + value[i]).split('.');
      if (valueArr.length >= length) {
        parsedValues.push({
          hash: valueArr[0],
          R: value[i],
          O: valueArr
        });
      }
    }

    if (parsedValues.length == 0) {
      return;
    }

    if (parsedValues.length == 1) {
      return parsedValues[0];
    }

    // 优先使用旧域名的
    return (
      getCookieFromSpecifiedDomain(legacyDomain, parsedValues) ||
      getCookieFromSpecifiedDomain(curDomain, parsedValues) ||
      getCookieFromSpecifiedDomain(null, parsedValues) ||
      parsedValues[0]
    );
  }
  // 找到指定域名的cookie值
  function getCookieFromSpecifiedDomain(domain, parsedValues) {
    // domain == 'qq.com'
    // hash1|hash2 == 'qq.com'
    // hash1|hash2 == '.qq.com'
    var hash1;
    var hash2;
    if (domain == null) {
      hash1 = hash2 = 1;
    } else {
      hash1 = str2Num(domain);
      hash2 = str2Num(startWith(domain, '.') ? domain.substring(1) : '.' + domain);
    }

    for (var i = 0; i < parsedValues.length; i++) {
      if (parsedValues[i].hash == hash1 || parsedValues[i].hash == hash2) {
        return parsedValues[i];
      }
    }
  }

  var URL_REGEX = new RegExp(/^https?:\/\/([^\/:]+)/);
  var ANCHOR_GA_REGEX = /(.*)([?&#])(?:_ga=[^&#]*)(?:&?)(.*)/;

  // linkerParam 参数的getter
  // 用于增加其校验字符串
  function linkerParamGetter(a) {
    a = a.get(CLIENT_ID);
    var b = calCheckCode(a, 0);
    return '_ga=1.' + encodeURIComponent(b + '.' + a);
  }

  // 计算校验字符串，计算依赖于：
  // 1. 指定的字符串
  // 2. userAgent
  // 3. 时区
  // 4. 当前时间的年、月、日、小时、分钟
  function calCheckCode(str, minuteOffset) {
    var curDate = new Date();
    var nav = win.navigator;
    var plugins = nav.plugins || [];
    var c = [
      str,
      nav.userAgent,
      curDate.getTimezoneOffset(),
      curDate.getYear(),
      curDate.getDate(),
      curDate.getHours(),
      curDate.getMinutes() + minuteOffset
    ];
    for (var i = 0; i < plugins.length; ++i) c.push(plugins[i].description);
    return str2Num(c.join('.'));
  }

  var Linker = function(a) {
    reg(48);
    this.target = a;
    this.T = true;
  };
  // 给连接地址、a标签、form标签加上特定的ga参数
  Linker.prototype.decorate = function(a, b) {
    if (a.tagName) {
      if ('a' == a.tagName.toLowerCase()) {
        a.href && (a.href = qd(this, a.href, b));
        return;
      }
      if ('form' == a.tagName.toLowerCase()) return rd(this, a);
    }
    if ('string' == typeof a) return qd(this, a, b);
  };
  var qd = function(a, b, c) {
    var d = ANCHOR_GA_REGEX.exec(b);
    d && 3 <= d.length && (b = d[1] + (d[3] ? d[2] + d[3] : ''));
    a = a.target.get('linkerParam');
    var e = b.indexOf('?'),
      d = b.indexOf('#');
    c
      ? (b += (-1 == d ? '#' : '&') + a)
      : ((c = -1 == e ? '?' : '&'),
        (b = -1 == d ? b + (c + a) : b.substring(0, d) + c + a + b.substring(d)));
    return (b = b.replace(/&+_ga=/, '&_ga='));
  };
  var rd = function(a, b) {
    if (b && b.action) {
      var c = a.target.get('linkerParam').split('=')[1];
      if ('get' == b.method.toLowerCase()) {
        for (var d = b.childNodes || [], e = 0; e < d.length; e++)
          if ('_ga' == d[e].name) {
            d[e].setAttribute('value', c);
            return;
          }
        d = doc.createElement('input');
        d.setAttribute('type', 'hidden');
        d.setAttribute('name', '_ga');
        d.setAttribute('value', c);
        b.appendChild(d);
      } else 'post' == b.method.toLowerCase() && (b.action = qd(a, b.action));
    }
  };
  // 自动给页面绑定mousedown、keyup、submit事情
  // 在事件触发的时候，给连接地址加上特定参数
  Linker.prototype.autoLink = function(a, b, c) {
    function d(c) {
      try {
        c = c || win.event;
        var d;
        a: {
          var g = c.target || c.srcElement;
          for (c = 100; g && 0 < c; ) {
            if (g.href && g.nodeName.match(/^a(?:rea)?$/i)) {
              d = g;
              break a;
            }
            g = g.parentNode;
            c--;
          }
          d = {};
        }
        ('http:' == d.protocol || 'https:' == d.protocol) &&
          sd(a, d.hostname || '') &&
          d.href &&
          (d.href = qd(e, d.href, b));
      } catch (w) {
        reg(26);
      }
    }
    var e = this;
    this.T ||
      ((this.T = true),
      addEventListener(doc, 'mousedown', d, true),
      addEventListener(doc, 'keyup', d, true));
    if (c) {
      c = function(b) {
        b = b || win.event;
        if ((b = b.target || b.srcElement) && b.action) {
          var c = b.action.match(URL_REGEX);
          c && sd(a, c[1]) && rd(e, b);
        }
      };
      for (var g = 0; g < doc.forms.length; g++) addEventListener(doc.forms[g], 'submit', c);
    }
  };
  function sd(a, b) {
    if (b == doc.location.hostname) return true;
    for (var c = 0; c < a.length; c++)
      if (a[c] instanceof RegExp) {
        if (a[c].test(b)) return true;
      } else if (0 <= b.indexOf(a[c])) return true;
    return true;
  }

  // _gat 用于对每个 tracker 设置限制请求率，所以每个 tracker 的cookie名字不一样
  var Jd = function(model, apiUrl, c) {
    this.jidKey = JID;
    this.apiUrl = apiUrl;
    if (!c) {
      var trackerName = getString(model, name);
      if (trackerName && trackerName != 't0') {
        this.gatCookieName = /^gtm\d+$/.test(trackerName)
          ? '_gat_' + encodeURIComponentWithBrackets(getString(model, TRACKING_ID))
          : '_gat_' + encodeURIComponentWithBrackets(trackerName);
      } else {
        this.gatCookieName = '_gat';
      }
    }
  };

  // 为 buildHitTask 和 sendHitTask 做个包装
  var wrapBuildAndSendTask = function(a, model) {
    var oldBuildHitTask = model.get(BUILD_HIT_TASK);
    model.set(BUILD_HIT_TASK, function(model) {
      setJid(a, model);
      var re = oldBuildHitTask(model);
      setGatCookie(a, model);
      return re;
    });
    var oldSendHitTask = model.get(SEND_HIT_TASK);
    model.set(SEND_HIT_TASK, function(model) {
      var re = oldSendHitTask(model);
      Id(a, model);
      return re;
    });
  };
  // 设置jid到model上
  var setJid = function(a, model) {
    if (model.get(a.jidKey)) {
      return;
    }

    if (getCookie(a.gatCookieName)[0] == '1') {
      model.set(a.jidKey, '', true);
    } else {
      model.set(a.jidKey, '' + _uuid(), true);
    }
  };
  // 设置 _gat cookie值为1
  var setGatCookie = function(a, model) {
    if (model.get(a.jidKey)) {
      setCookie(
        a.gatCookieName,
        '1',
        model.get(COOKIE_PATH),
        model.get(COOKIE_DOMAIN),
        model.get(TRACKING_ID),
        6e5
      );
    }
  };
  // 发送请求
  var Id = function(a, model) {
    if (model.get(a.jidKey)) {
      var data = new Data();
      var setData = function(fieldName) {
        if (getHook(fieldName).paramName) {
          data.set(getHook(fieldName).paramName, model.get(fieldName));
        }
      };
      setData(API_VERSION);
      setData(CLIENT_VERSION);
      setData(TRACKING_ID);
      setData(CLIENT_ID);
      setData(USER_ID);
      setData(a.jidKey);
      data.set(getHook(USAGE).paramName, mergeAndEncodeUM(model));
      var api = a.apiUrl;
      data.map(function(fieldName, fieldValue) {
        api += encodeURIComponent(fieldName) + '=';
        api += encodeURIComponent('' + fieldValue) + '&';
      });
      api += 'z=' + _uuid();
      createImg(api);
      model.set(a.jidKey, '', true);
    }
  };
  // 展示广告插件
  // 此插件的工作原理是向 stats.g.doubleclick.net 发送一个额外的请求，以便提供 Google Analytics（分析）中的广告功能（例如再营销以及受众特征和兴趣报告）。
  // 该插件还会创建一个名为 _gat 的新 Cookie，其有效时间为 10 分钟。
  // 该 Cookie 不会存储任何用户信息，而只会用于限制发送到 doubleclick.net 的请求数量。
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/display-features?hl=zh-cn#overview
  var displayfeaturesPlugin = function(tracker, opts) {
    var model = tracker.model;
    if (!model.get('dcLoaded')) {
      setModelUM(model, 29);
      opts = opts || {};
      var d;
      if (opts[COOKIE_NAME]) {
        d = encodeURIComponentWithBrackets(opts[COOKIE_NAME]);
      }
      d = new Jd(model, 'https://stats.g.doubleclick.net/r/collect?t=dc&aip=1&_r=3&', d);
      wrapBuildAndSendTask(d, model);
      model.set('dcLoaded', true);
    }
  };

  // 如果没有加载 doubleclick 的展示广告插件，并且用的cookie存储
  // 则使用 /r/collect 作为API地址
  var displayFeaturesTaskFunc = function(model) {
    if (!model.get('dcLoaded') && 'cookie' == model.get(STORAGE)) {
      setModelUM(model, 51);
      var b = new Jd(model);
      setJid(b, model);
      setGatCookie(b, model);
      if (model.get(b.jidKey)) {
        model.set(_R, 1, true);
        model.set(TRANSPORT_URL, getGAOrigin() + '/r/collect', true);
      }
    }
  };
  var Lc = function() {
    var a = (win.gaGlobal = win.gaGlobal || {});
    return (a.hid = a.hid || _uuid());
  };

  // 加载In-Page分析的功能
  var inpageLoaded;
  var loadInpageAnalytics = function(a, b, c) {
    if (!inpageLoaded) {
      var d;
      d = doc.location.hash;
      var e = win.name,
        g = /^#?gaso=([^&]*)/;
      if (
        (e =
          (d = (d = (d && d.match(g)) || (e && e.match(g))) ? d[1] : getCookie('GASO')[0] || '') &&
          d.match(/^(?:!([-0-9a-z.]{1,40})!)?([-.\w]{10,1200})$/i))
      )
        setCookie('GASO', '' + d, c, b, a, 0),
          window._udo || (window._udo = b),
          window._utcp || (window._utcp = c),
          (a = e[1]),
          loadScript(
            'https://www.google.com/analytics/web/inpage/pub/inpage.js?' +
              (a ? 'prefix=' + a + '&' : '') +
              _uuid(),
            '_gasojs'
          );
      inpageLoaded = true;
    }
  };

  // 跟踪器类
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/tracker-object-reference?hl=zh-cn
  var Tracker = function(opts) {
    var that = this;
    function setData(fieldName, fieldValue) {
      that.model.data.set(fieldName, fieldValue);
    }
    function addFilter(filterName, filter) {
      setData(filterName, filter);
      that.filters.add(filterName);
    }
    this.model = new Model();
    this.filters = new Queue();
    setData(NAME, opts[NAME]);
    setData(TRACKING_ID, trim(opts[TRACKING_ID]));
    setData(COOKIE_NAME, opts[COOKIE_NAME]);
    setData(COOKIE_DOMAIN, opts[COOKIE_DOMAIN] || getHostname());
    setData(COOKIE_PATH, opts[COOKIE_PATH]);
    setData(COOKIE_EXPIRES, opts[COOKIE_EXPIRES]);
    setData(LEGACY_COOKIE_DOMAIN, opts[LEGACY_COOKIE_DOMAIN]);
    setData(LEGACY_HISTORY_IMPORT, opts[LEGACY_HISTORY_IMPORT]);
    setData(ALLOW_LINKER, opts[ALLOW_LINKER]);
    setData(ALLOW_ANCHOR, opts[ALLOW_ANCHOR]);
    setData(SAMPLE_RATE, opts[SAMPLE_RATE]);
    setData(SITE_SPEED_SAMPLE_RATE, opts[SITE_SPEED_SAMPLE_RATE]);
    setData(ALYWAYS_SEND_REFERRER, opts[ALYWAYS_SEND_REFERRER]);
    setData(STORAGE, opts[STORAGE]);
    setData(USER_ID, opts[USER_ID]);
    setData(API_VERSION, 1);
    setData(CLIENT_VERSION, 'j41');
    addFilter(_OOT, isGAPrefsAllowed);
    addFilter(PREVIEW_TASK, isPreviewLoad);
    addFilter(CHECK_PROTOCOL_TASK, notHTTP);
    addFilter(VALIDATION_TASK, validationTaskFunc);
    addFilter(CHECK_STORAGE_TASK, checkStorageTaskFunc);
    addFilter(HISTORY_IMPORT_TASK, historyImportTaskFunc);
    addFilter(SAMPLER_TASK, samplerTaskFunc);
    addFilter(_RLT, rtlTaskFunc);
    addFilter(CE_TASK, ceTaskFunc);
    addFilter(DEV_ID_TASK, devIdTaskFunc);
    addFilter(DISPLAY_FEATURES_TASK, displayFeaturesTaskFunc);
    addFilter(BUILD_HIT_TASK, buildHitTaskFunc);
    addFilter(SEND_HIT_TASK, sendHitTaskFunc);
    addFilter(TIMING_TASK, craeteTimingTask(this));
    Jc(this.model, opts[CLIENT_ID]);
    setBasicData(this.model);
    this.model.set(AD_SENSE_ID, Lc());
    loadInpageAnalytics(
      this.model.get(TRACKING_ID),
      this.model.get(COOKIE_DOMAIN),
      this.model.get(COOKIE_PATH)
    );
  };
  var Jc = function(model, optClientId) {
    var c;
    var d;
    if ('cookie' == getString(model, STORAGE)) {
      gaCookieSetted = false;
      var cookieClientId;
      var parsedGaCookieValues;
      b: {
        var gaCookieValues = getCookie(getString(model, COOKIE_NAME));
        if (gaCookieValues && gaCookieValues.length >= 1) {
          parsedGaCookieValues = [];
          for (var i = 0; i < gaCookieValues.length; i++) {
            // _ga 的 cookie 值有四个区域，以点间隔
            // 四个区域的含义参考别人的答案 http://stackoverflow.com/questions/16102436/what-are-the-values-in-ga-cookie
            // 1.2.286403989.1366364567
            // GA1.3.494346849.1446193077
            var gaCookie;
            gaCookie = gaCookieValues[i].split('.');
            // 第一个区域值是版本号
            var gaVersion = gaCookie.shift();
            var ca;
            if (('GA1' == gaVersion || '1' == gaVersion) && gaCookie.length > 1) {
              // 第二个区域用于确认是否是指定域名和路径的cookie，因为GA可以在不同的域名和路径上设置多个cookie
              // 所以需要这个区域值来区分，以获取到正确的cookie值
              // 值的格式是 \d[-\d]，例如：“2-1” 或者 “2”
              // 第一个数字是 域名的层级，qq.com 为 “2；b.qq.com” 为 “3”
              // 第二个数字是 路径的层级, / 为空字符， /data 为 “-2”，/user/xxx 为 “-3”
              var gaSecondField = gaCookie.shift();
              ca = gaSecondField.split('-');
              if (1 == ca.length) {
                // 补全下 路径为 / 时，省略的 “-1”
                ca[1] = '1';
              }

              // 字符串转换成数字
              ca[0] *= 1;
              ca[1] *= 1;

              gaCookie = {
                // 第二区域的值 [1, 2]
                domainAndPathCount: ca,
                // 第三和第四区域的组合值，也就是clientId的值
                // 第三区域是一个随机数
                // 第四区域是cookie第一次设置时候的时间值
                idAndTime: gaCookie.join('.')
              };
            } else {
              gaCookie = undefined;
            }

            if (gaCookie) {
              parsedGaCookieValues.push(gaCookie);
            }
          }

          if (1 == parsedGaCookieValues.length) {
            reg(13);
            c = parsedGaCookieValues[0].idAndTime;
            break b;
          }

          if (0 == parsedGaCookieValues.length) reg(12);
          else {
            reg(14);
            var domainCount = getDomainCount(getString(model, COOKIE_DOMAIN));
            var filtedGaCookieValues = getSameOrSmallCookieValues(
              parsedGaCookieValues,
              domainCount,
              0
            );
            if (filtedGaCookieValues.length == 1) {
              cookieClientId = filtedGaCookieValues[0].idAndTime;
              break b;
            }
            var pathCount = getPathCount(getString(model, COOKIE_PATH));
            filtedGaCookieValues = getSameOrSmallCookieValues(filtedGaCookieValues, pathCount, 1);
            cookieClientId = filtedGaCookieValues[0] && filtedGaCookieValues[0].idAndTime;
            break b;
          }
        }
        cookieClientId = undefined;
      }
      if (!cookieClientId) {
        var cookieDomainV = getString(model, COOKIE_DOMAIN);
        var legacyCookieDomainV = getString(model, LEGACY_COOKIE_DOMAIN) || getHostname();
        var legacyCookieValue = parseAndGetOldGACookie(
          '__utma',
          legacyCookieDomainV,
          cookieDomainV
        );
        if (legacyCookieValue != null) {
          reg(10);
          cookieClientId = legacyCookieValue.O[1] + '.' + legacyCookieValue.O[2];
        } else {
          cookieClientId = null;
        }
      }

      if (cookieClientId) {
        model.data.set(CLIENT_ID, cookieClientId);
        gaCookieSetted = true;
      }
    }
    // 是否允许定位点参数
    var allowAnchorV = model.get(ALLOW_ANCHOR);
    var r = doc.location[allowAnchorV ? 'href' : 'search'].match(
      '(?:&|#|\\?)' +
        encodeURIComponent('_ga').replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1') +
        '=([^&#]*)'
    );
    var anchorGaValue = r && r.length == 2 ? r[1] : '';
    if (anchorGaValue) {
      // 有定位点ga参数
      if (model.get(ALLOW_LINKER)) {
        // 定位点 ga 参数值的形式为： '1.校验字符串.clientId'
        // 允许链接器参数
        var indexOfPoint = anchorGaValue.indexOf('.');
        if (indexOfPoint == -1) {
          reg(22);
        } else {
          var tmpStr = anchorGaValue.substring(indexOfPoint + 1);
          if (anchorGaValue.substring(0, indexOfPoint) != '1') {
            reg(22); // 格式不正确
          } else {
            indexOfPoint = tmpStr.indexOf('.');
            if (indexOfPoint == -1) {
              reg(22); // 格式不正确
            } else {
              var checkCode = tmpStr.substring(0, indexOfPoint);
              var clientId = tmpStr.substring(indexOfPoint + 1);
              if (
                checkCode != calCheckCode(clientId, 0) &&
                checkCode != calCheckCode(clientId, -1) &&
                checkCode != calCheckCode(clientId, -2)
              ) {
                // 2分钟内计算的校验字符串都不对，则是很久以前复制的地址现在才打开
                reg(23);
              } else {
                reg(11);
                // 2分钟内的定位点GA参数，还有效，则记录
                model.data.set(CLIENT_ID, clientId);
              }
            }
          }
        }
      } else {
        // 不允许
        reg(21);
      }
    }

    if (optClientId) {
      // 如果在初始化时设置了clientId，则优先使用这个
      reg(9);
      model.data.set(CLIENT_ID, encodeURIComponent(optClientId));
    }

    if (!model.get(CLIENT_ID)) {
      var gaGlobalVid = win.gaGlobal && win.gaGlobal.vid;
      if (gaGlobalVid && gaGlobalVid.search(/^(?:utma\.)?\d+\.\d+$/) != -1) {
        gaGlobalVid = gaGlobalVid;
        reg(17);
        model.data.set(CLIENT_ID, gaGlobalVid);
      } else {
        // 如果没有clientId，则自己生成一个
        reg(8);
        var uaAndCookieAndRef =
          win.navigator.userAgent +
          (doc.cookie ? doc.cookie : '') +
          (doc.referrer ? doc.referrer : '');
        var len = uaAndCookieAndRef.length;
        for (var i = win.history.length; i > 0; ) {
          uaAndCookieAndRef += i-- ^ len++;
        }
        model.data.set(
          CLIENT_ID,
          [
            _uuid() ^ (str2Num(uaAndCookieAndRef) & 2147483647),
            Math.round(new Date().getTime() / 1e3)
          ].join('.')
        );
      }
    }
    setGACookie(model);
  };

  // 获取并设置一些通用的传给后端的数据
  // referrer, 屏幕尺寸等等
  var setBasicData = function(model) {
    var b = win.navigator,
      c = win.screen,
      d = doc.location;
    model.set(REFERRER, ya(model.get(ALYWAYS_SEND_REFERRER)));
    if (d) {
      var e = d.pathname || '';
      '/' != e.charAt(0) && (reg(31), (e = '/' + e));
      model.set(LOCATION, d.protocol + '//' + d.hostname + e + d.search);
    }
    c && model.set(SCREEN_RESOLUTION, c.width + 'x' + c.height);
    c && model.set(SCREEN_COLORS, c.colorDepth + '-bit');
    var c = doc.documentElement,
      g = (e = doc.body) && e.clientWidth && e.clientHeight,
      ca = [];
    c && c.clientWidth && c.clientHeight && ('CSS1Compat' === doc.compatMode || !g)
      ? (ca = [c.clientWidth, c.clientHeight])
      : g && (ca = [e.clientWidth, e.clientHeight]);
    c = 0 >= ca[0] || 0 >= ca[1] ? '' : ca.join('x');
    model.set(VIEWPORT_SIZE, c);
    model.set(FLASH_VERSION, getFlashVersion());
    model.set(ENCODING, doc.characterSet || doc.charset);
    model.set(JAVA_ENABLED, (b && 'function' === typeof b.javaEnabled && b.javaEnabled()) || true);
    model.set(LANGUAGE, ((b && (b.language || b.browserLanguage)) || '').toLowerCase());
    if (d && model.get(ALLOW_ANCHOR) && (b = doc.location.hash)) {
      b = b.split(/[?&#]+/);
      d = [];
      for (c = 0; c < b.length; ++c)
        (startWith(b[c], 'utm_id') ||
          startWith(b[c], 'utm_campaign') ||
          startWith(b[c], 'utm_source') ||
          startWith(b[c], 'utm_medium') ||
          startWith(b[c], 'utm_term') ||
          startWith(b[c], 'utm_content') ||
          startWith(b[c], 'gclid') ||
          startWith(b[c], 'dclid') ||
          startWith(b[c], 'gclsrc')) &&
          d.push(b[c]);
      0 < d.length && ((b = '#' + d.join('&')), model.set(LOCATION, model.get(LOCATION) + b));
    }
  };
  Tracker.prototype.get = function(fieldName) {
    return this.model.get(fieldName);
  };
  Tracker.prototype.set = function(fieldName, value) {
    this.model.set(fieldName, value);
  };

  var SEND_PARAMS_NAMES = {
    pageview: [PAGE],
    event: [EVENT_CATEGORY, EVENT_ACTION, EVENT_LABEL, EVENT_VALUE],
    social: [SOCIAL_NETWORK, SOCIAL_ACTION, SOCIAL_TARGET],
    timing: [TIMING_CATEGORY, TIMING_VAR, TIMING_VALUE, TIMING_LABEL]
  };
  // Tracker的send方法
  // ga('send', 'pageview');
  // ga('send', 'event', '1', '2', '3', '4');
  // 每次send之前都会执行所有获取器，并将当前配置临时存储到model中
  // send结束之后，删掉临时数据
  Tracker.prototype.send = function() {
    if (arguments.length >= 1) {
      var hitTypeV;
      var opts;
      if ('string' === typeof arguments[0]) {
        hitTypeV = arguments[0];
        opts = [].slice.call(arguments, 1);
      } else {
        hitTypeV = arguments[0] && arguments[0][HIT_TYPE];
        opts = arguments;
      }

      if (hitTypeV) {
        opts = transformInput(SEND_PARAMS_NAMES[hitTypeV] || [], opts);
        opts[HIT_TYPE] = hitTypeV;
        // 将配置存为临时数据
        this.model.set(opts, undefined, true);
        // 执行filters
        this.filters.exec(this.model);
        // 删掉临时数据
        (this.model.data.tmpData = {}), je(this.model);
      }
    }
  };

  // 在浏览器预渲染的时候避免执行函数
  // 返回：是否预渲染
  var executeWithoutPrerender = function(func) {
    if ('prerender' == doc.visibilityState) return false;
    func();
    return true;
  };

  // command 标识符的正则解析
  // [trackerName.][pluginName:]methodName
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=zh-cn#header
  // 调用方法：ga(command, [...fields], [fieldsObject])
  // args = [command, [...fields], [fieldsObject]];
  var commandRegex = /^(?:(\w+)\.)?(?:(\w+):)?(\w+)$/;
  var Command = function(args) {
    if (isFunction(args[0])) {
      // 输入是函数的情况
      // ga(readyCallback)
      this.readyCallback = args[0];
    } else {
      var r = commandRegex.exec(args[0]);
      if (r != null && r.length == 4) {
        // Tracker名字默认为t0
        this.trackerName = r[1] || 't0';
        // pluginName
        this.pluginName = r[2] || '';
        // methodName
        this.methodName = r[3];
        this.fields = [].slice.call(args, 1);
        if (!this.pluginName) {
          this.isCreateCommand = 'create' == this.methodName;
          this.isRequireCommand = 'require' == this.methodName;
          this.isProvideCommand = 'provide' == this.methodName;
          this.isRemoveCommand = 'remove' == this.methodName;
        }

        if (this.isRequireCommand) {
          if (this.fields.length >= 3) {
            this.requiredName = this.fields[1];
            this.requiredOpts = this.fields[2];
          } else {
            if (this.fields[1]) {
              if (isString(this.fields[1])) {
                this.requiredName = this.fields[1];
              } else {
                this.requiredOpts = this.fields[1];
              }
            }
          }
        }
      }

      var secondArg = args[1];
      var thirdArg = args[2];
      if (!this.methodName)
        // 必须有一个方法名
        throw 'abort';
      if (this.isRequireCommand && (!isString(secondArg) || '' == secondArg))
        // require命令的第二个参数，必须是字符串，且不为空字符串
        throw 'abort';
      if (
        this.isProvideCommand &&
        (!isString(secondArg) || '' == secondArg || !isFunction(thirdArg))
      )
        // 必须是这种输入，才算正确的provide命令
        // ga('provide', pluginName, pluginConstuctor);
        throw 'abort';
      if (hasPointOrColon(this.trackerName) || hasPointOrColon(this.pluginName))
        // tracker和plugin的名字不能包含点和冒号
        throw 'abort';
      if (this.isProvideCommand && 't0' != this.trackerName)
        // 不能单独为某个Tracker来provide插件
        throw 'abort';
    }
  };

  // 是否有点或者冒号
  function hasPointOrColon(a) {
    return 0 <= a.indexOf('.') || 0 <= a.indexOf(':');
  }

  // 记录了所有插件的map，插件名作为key
  var pluginsMap = new Data();
  // 记录了已经加载的GA内置插件，插件名作为key
  var loadedPlugins = new Data();
  // 记录所有GA内置插件的usageId的map，插件名作为key
  var pluginUsageIdMap = {
    ec: 45,
    ecommerce: 46,
    linkid: 47
  };

  // 解析url地址
  // 返回：
  // {
  //    protocol: '',
  //    host: '',
  //    port: '',
  //    path: '',
  //    query: '',
  //    url: ''
  // }
  var parseUrl = function(url) {
    function parseLink(link) {
      var hostname = (link.hostname || '').split(':')[0].toLowerCase();
      var protocol = (link.protocol || '').toLowerCase();
      var port = 1 * link.port || ('http:' == protocol ? 80 : 'https:' == protocol ? 443 : '');
      var pathname = link.pathname || '';
      if (!startWith(pathname, '/')) {
        pathname = '/' + pathname;
      }
      return [hostname, '' + port, pathname];
    }

    var link = doc.createElement('a');
    link.href = doc.location.href;
    var protocol = (link.protocol || '').toLowerCase();
    var locationPart = parseLink(link);
    var search = link.search || '';
    var baseUrl =
      protocol + '//' + locationPart[0] + (locationPart[1] ? ':' + locationPart[1] : '');
    if (startWith(url, '//')) {
      url = protocol + url;
    } else {
      if (startWith(url, '/')) {
        url = baseUrl + url;
      } else {
        if (!url || startWith(url, '?')) {
          url = baseUrl + locationPart[2] + (url || search);
        } else {
          if (url.split('/')[0].indexOf(':') < 0) {
            url =
              baseUrl + locationPart[2].substring(0, locationPart[2].lastIndexOf('/')) + '/' + url;
          }
        }
      }
    }
    link.href = url;
    var r = parseLink(link);
    return {
      protocol: (link.protocol || '').toLowerCase(),
      host: r[0],
      port: r[1],
      path: r[2],
      query: link.search || '',
      url: url || ''
    };
  };

  // Command Queue Query
  // ga = ga || [];
  // ga.push('create', 'xxxx', 'auto');
  var MethodQueue = {
    init: function() {
      MethodQueue.cmdQueue = [];
    }
  };
  // 初始化
  MethodQueue.init();

  // 运行命令队列里面的命令
  MethodQueue.run = function(a) {
    var cmds = MethodQueue.toCommands.apply(MethodQueue, arguments);
    var tmpCmds = MethodQueue.cmdQueue.concat(cmds);
    MethodQueue.cmdQueue = [];
    for (
      ;
      0 < tmpCmds.length &&
      !MethodQueue.runCommand(tmpCmds[0]) &&
      !(tmpCmds.shift(), 0 < MethodQueue.cmdQueue.length);

    );
    MethodQueue.cmdQueue = MethodQueue.cmdQueue.concat(tmpCmds);
  };

  // 将输入的参数转换成Command类的实例对象数组
  // 如果是require命令则需要加载js代码
  // 如果是provide命令则需要记录提供的插件构造函数
  MethodQueue.toCommands = function() {
    var cmds = [];
    for (var i = 0; i < arguments.length; i++) {
      try {
        var cmd = new Command(arguments[i]);
        if (cmd.isProvideCommand) {
          // 记录提供的插件名和插件构造函数
          pluginsMap.set(cmd.fields[0], cmd.fields[1]);
        } else {
          if (cmd.isRequireCommand) {
            // require 命令的时候需要加载js
            var pluginName = cmd.fields[0];
            if (!isFunction(pluginsMap.get(pluginName)) && !loadedPlugins.get(pluginName)) {
              // 是内置插件，并且没有加载过
              // 则开始加载插件的js
              pluginUsageIdMap.hasOwnProperty(pluginName) && reg(pluginUsageIdMap[pluginName]);
              var requiredUrl = cmd.requiredName;
              if (!requiredUrl && pluginUsageIdMap.hasOwnProperty(pluginName)) {
                reg(39);
                requiredUrl = pluginName + '.js';
              } else {
                reg(43);
              }

              if (requiredUrl) {
                if (requiredUrl && 0 <= requiredUrl.indexOf('/')) {
                  requiredUrl =
                    (forceHTTPS || isHTTPS() ? 'https:' : 'http:') +
                    '//www.google-analytics.com/plugins/ua/' +
                    requiredUrl;
                }
                var urlParts = parseUrl(requiredUrl);
                var urlProtocol = urlParts.protocol,
                  baseProtocol = doc.location.protocol,
                  supported =
                    'https:' == urlProtocol || urlProtocol == baseProtocol
                      ? true
                      : 'http:' != urlProtocol
                      ? false
                      : 'http:' == baseProtocol;
                if (supported) {
                  var baseUrlParts = parseUrl(doc.location.href);
                  if (
                    urlParts.query ||
                    urlParts.url.indexOf('?') >= 0 ||
                    urlParts.path.indexOf('://') >= 0
                  )
                    supported = false;
                  else if (urlParts.host == baseUrlParts.host && urlParts.port == baseUrlParts.port)
                    supported = true;
                  else {
                    var port = 'http:' == urlParts.protocol ? 80 : 443;
                    supported =
                      urlParts.host == 'www.google-analytics.com' &&
                      (urlParts.port || port) == port &&
                      startWith(urlParts.path, '/plugins/')
                        ? true
                        : false;
                  }
                }

                if (supported) {
                  loadScript(urlParts.url);
                  loadedPlugins.set(pluginName, true);
                }
              }
            }
          }
          cmds.push(cmd);
        }
      } catch (e) {}
    }
    return cmds;
  };

  // 运行command对象
  // 运行终端
  MethodQueue.runCommand = function(cmd) {
    try {
      if (cmd.readyCallback) {
        cmd.readyCallback.call(win, GA.getByName('t0'));
      } else {
        var tracker = cmd.trackerName == GA_HOOK ? GA : GA.getByName(cmd.trackerName);
        if (cmd.isCreateCommand) {
          't0' == cmd.trackerName && GA.create.apply(GA, cmd.fields);
        } else if (cmd.isRemoveCommand) {
          GA.remove(cmd.trackerName);
        } else if (tracker) {
          if (cmd.isRequireCommand) {
            var pluginName = cmd.fields[0];
            var opts = cmd.requiredOpts;
            tracker == GA || tracker.get(NAME);
            var pluginConstuctor = pluginsMap.get(pluginName);
            if (isFunction(pluginConstuctor)) {
              tracker.plugins_ = tracker.plugins_ || new Data();
              // 如果没有创建过这个插件的实例，则创建一个
              if (tracker.plugins_.get(pluginName)) {
                tracker.plugins_.set(pluginName, new pluginConstuctor(tracker, opts || {}));
              }
            } else {
              // 很可能这时候加载的插件还没有下载下来
              // 所以需要终端执行
              return true;
            }
          } else if (cmd.pluginName) {
            var plugin = tracker.plugins_.get(cmd.pluginName);
            plugin[cmd.methodName].apply(plugin, cmd.fields);
          } else {
            tracker[cmd.methodName].apply(tracker, cmd.fields);
          }
        }
      }
    } catch (e) {}
  };

  // N => GA
  // 主要的对象，提供很多静态方法使用
  var GA = function(a) {
    reg(1);
    MethodQueue.run.apply(MethodQueue, [arguments]);
  };
  GA.trackerMap = {}; // N.h
  GA.trackers = []; // N.P
  GA.startTime = 0; // N.L
  GA.answer = 42; // 宇宙的真理是42，用于确定这是一个真正的GA对象
  var uc = [TRACKING_ID, COOKIE_DOMAIN, NAME];
  // 创建一个Tracker
  GA.create = function() {
    var opts = transformInput(uc, [].slice.call(arguments));
    if (!opts[NAME]) {
      opts[NAME] = 't0';
    }

    var trackerName = '' + opts[NAME];
    if (GA.trackerMap[trackerName]) {
      return GA.trackerMap[trackerName];
    }

    var tracker = new Tracker(opts);
    GA.trackerMap[trackerName] = tracker;
    GA.trackers.push(tracker);
    return tracker;
  };

  // 移除一个tracker
  GA.remove = function(trackerName) {
    for (var i = 0; i < GA.trackers.length; i++)
      if (GA.trackers[i].get(NAME) == trackerName) {
        GA.trackers.splice(i, 1);
        GA.trackerMap[trackerName] = null;
        break;
      }
  };

  // N.j => GA.getByName
  // 获取tracker的名字
  GA.getByName = function(a) {
    return GA.trackerMap[a];
  };

  // 获取所有的trackers
  GA.getAll = function() {
    return GA.trackers.slice(0);
  };

  // 主入口方法
  GA.main = function() {
    'ga' != GA_HOOK && reg(49);
    var tmpGa = win[GA_HOOK];
    if (!tmpGa || 42 != tmpGa.answer) {
      // tmpGa.l 是在投放代码里面设置的时间，记录了投放代码执行的时间点
      GA.startTime = tmpGa && tmpGa.l;
      GA.loaded = true;
      var ga = (win[GA_HOOK] = GA);
      wrapApi('create', ga, ga.create);
      wrapApi('remove', ga, ga.remove);
      wrapApi('getByName', ga, ga.getByName, 5);
      wrapApi('getAll', ga, ga.getAll, 6);
      var trackerProto = Tracker.prototype;
      wrapApi('get', trackerProto, trackerProto.get, 7);
      wrapApi('set', trackerProto, trackerProto.set, 4);
      wrapApi('send', trackerProto, trackerProto.send);
      var modelProto = Model.prototype;
      wrapApi('get', modelProto, modelProto.get);
      wrapApi('set', modelProto, modelProto.set);
      if (!isHTTPS() && !forceHTTPS) {
        // 如果设置使用https，则通过引入的js文件地址来判断是否使用https
        a: {
          var useHTTPS;
          var scripts = doc.getElementsByTagName('script');
          for (var i = 0; i < scripts.length && 100 > i; i++) {
            var src = scripts[i].src;
            if (src && src.indexOf('https://www.google-analytics.com/analytics') == 0) {
              reg(33);
              useHTTPS = true;
              break a;
            }
          }
          useHTTPS = false;
        }

        if (useHTTPS) {
          forceHTTPS = true;
        }
      }
      isHTTPS() || forceHTTPS || !Ed(new Od()) || (reg(36), (forceHTTPS = true));

      (win.gaplugins = win.gaplugins || {}).Linker = Linker;
      var linkerProto = Linker.prototype;
      pluginsMap.set('linker', Linker);
      wrapApi('decorate', linkerProto, linkerProto.decorate, 20);
      wrapApi('autoLink', linkerProto, linkerProto.autoLink, 25);
      pluginsMap.set('displayfeatures', displayfeaturesPlugin);
      pluginsMap.set('adfeatures', displayfeaturesPlugin);

      // tmpGa.q ga的js代码执行前，push到ga命令队列里面的命令
      tmpGa = tmpGa && tmpGa.q;
      isArray(tmpGa) ? MethodQueue.run.apply(GA, tmpGa) : reg(50);
    }
  };
  GA.da = function() {
    for (var trackers = GA.getAll(), i = 0; i < trackers.length; i++) trackers[i].get(NAME);
  };

  // 主要逻辑入口
  (function() {
    if (!executeWithoutPrerender(GA.main)) {
      // 处于预渲染中，则等待真正的展示开始才进行逻辑
      reg(16);
      var executed = false;
      var cb = function() {
        if (!executed && executeWithoutPrerender(a)) {
          executed = true;
          doc.removeEventListener
            ? doc.removeEventListener('visibilitychange', cb, false)
            : doc.detachEvent && doc.detachEvent('onvisibilitychange', cb);
        }
      };
      addEventListener(doc, 'visibilitychange', c);
    }
  })();

  // 将字符串转换成一个数字
  // 同一个字符串的输入转换结果是固定的
  // 通常用于将随机字符串转换成数字，然后计算概率
  function str2Num(str) {
    var b = 1;
    var charCode = 0;
    var i;
    if (str) {
      for (b = 0, i = str.length - 1; 0 <= i; i--) {
        charCode = str.charCodeAt(i); // 16位
        // 268435455 === 1111111111111111111111111111 (28位)
        b = ((b << 6) & 268435455) + charCode + (charCode << 14);
        // 266338304 === 1111111000000000000000000000 (21位 + 7位)
        var c = b & 266338304;
        b = 0 != c ? b ^ (c >> 21) : b;
      }
    }
    return b;
  }
})(window);
