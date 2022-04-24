/**
 * @name Class
 * @author Shuwang
 * @description learn class on ES6
 * */

class Circle {
  constructor(radius) {
    this.radius = radius;
    Circle.circlesMade++;
  }
  static draw(circle, canvas) {
    // Canvas 绘制代码
  }
  static get circlesMade() {
    return !this._count ? 0 : this._count;
  }
  static set circlesMade(val) {
    this._count = val;
  }
  area() {
    return Math.pow(this.radius, 2) * Math.PI;
  }
  get radius() {
    return this._radius;
  }
  set radius(radius) {
    if (!Number.isInteger(radius)) throw new Error("圆的半径必须为整数。");
    this._radius = radius;
  }
}

var circle1 = new Circle();
