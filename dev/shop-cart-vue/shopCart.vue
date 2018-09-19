<template>
  <div class="home-page">
    
    <!-- 商品联动 -->
    <div class="link-page" :style="{ height: linkPageConf.height + 'px' }">
      <ul class="tabs" ref="menu">
        <li 
          ref="menuItem"
          v-for="(category, index) in categories"
          :class="[{active: activeIndex === index}, 'menu-item']"
          :key="'tabItem-' + index"
          @click="onTabClick(index, $event)">
          <span>{{category.name}}</span>
          <span class="red-dot" v-if="categoryCount[category.id] && categoryCount[category.id]!=0">
            {{categoryCount[category.id]}}
          </span> 
        </li>
      </ul>
      <div class="content" ref="content">
        <div class="content-item" v-for="(category, subIndex) in categories" :key="'contentItem-' + subIndex" ref="contentItem">
          <h2 class="title">{{category.name}}</h2>
          <div class="card" v-for="(item, _index) in category.thisList" :key="_index">
            <div class="card-thumb">
              <img src="../assets/image/demoimhg.jpg" alt="">
            </div>
            <ul class="card-detail">
              <li class="name">{{item.name}}</li>
              <li>月销:{{item.sales}}</li>
              <li class="opr">
                <p>{{item.price}}</p>
                <p v-if="!item.spec" class="count">
                  <i class="iconfont icon-jian" @click="onDel(category.id, item)"></i>
                  <span class="number fz13">{{ goodCount[category.id] && goodCount[category.id][item.id] || 0 }}</span>
                  <i class="iconfont icon-jia" @click="onAdd(category.id, item)"></i>
                </p>
                <p v-else class="spec" @click="onSpec(category.id, item, _index)">
                  选规格
                  <span class="red-dot" v-if="goodCount[category.id] && goodCount[category.id][item.id]">
                    {{ goodCount[category.id] && goodCount[category.id][item.id] }}
                  </span> 
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div> 
    </div>

    <!-- 购物车 -->
    <div class="shop-cart" @click="onViewOrder">
      <i class="iconfont icon-gouwucheman"></i>
      <span class="red-dot">{{count}}</span>
    </div>
    
    <!-- 订单详情 -->
    <div class="order">
      <div class="detail" v-if="isShowList">
        <h6 @click="clearShopCart">清空购物车</h6>
        <div class="detail-container" >
          <div v-for="(orderItems, index) in tabCount" :key="'orderItems-' + index" v-if="orderItems.length">
            <ul class="detail-item" v-for="(orderItem, subIndex) in orderItems" :key="'orderItem-' + subIndex">
              <li class="item-desc" >
                <p>{{orderItem.name}}</p>
                <p v-if="orderItem.hasSpec">
                  <span v-for="(spec, index) in orderItem.specs" :key="'detail-spec-item-' + index">{{spec.value}}</span>
                </p>
              </li>
              <li class="item-amount">{{orderItem.price}}</li>
              <li class="item-count">
                <i class="iconfont icon-jian" @click="onDelByOrder(index, subIndex)"></i>
                <span class="number fz13">{{orderItem.count}}</span>
                <i class="iconfont icon-jia" @click="onAddByOrder(index, subIndex)"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="about" @click="onViewOrder">
        <p>
          <i class="iconfont icon-gouwucheman"></i>
          <span class="red-dot">{{count}}</span>
        </p>
        <ul>
          <li>￥{{totalAmount}}</li>
          <li>另需配送费：5</li>
        </ul>
      </div>
      <div class="pay">去结算</div>	
    </div>

    <!-- 遮罩层 -->
    <div class="mask" v-if="isShowList" @click="onCloseOrders"></div>
  
    <!-- 规格模态框 -->
    <div class="spec-modal" v-if="showSpecModal" @click.self="onCloseSpec">
      <div class="spec-container">
        <div class="spec-item" v-for="(specItem, index) in spec.guigeList" :key="'specitem-' + index">
          <p>{{specItem.name}}</p>
          <ul>
            <li :class="{active: currSpec[specItem.id] && (currSpec[specItem.id].id === subSpecItem.id)}" v-for="(subSpecItem, subindex) in specItem.thisList" :key="'subSpecItem-' + subindex" @click="onSelcSpec(specItem, subSpecItem)">{{subSpecItem.value}}</li>
          </ul>
        </div>
        <div class="spec-footer">
          <div class="price">￥{{spec.price}}</div>
          <div class="count">
            <span v-if="!categoryCount[spec.pid]" @click="onAddSpec(spec)">
              <i class="iconfont icon-gouwucheman mr5"></i>加入购物车
            </span>
            <span v-else>
              <i class="iconfont icon-jian" @click="onDelSpec(spec)"></i>
              <span class="number fz13">{{ goodCount[spec.pid] && goodCount[spec.pid][spec.id] || 0 }}</span>
              <i class="iconfont icon-jia" @click="onAddSpec(spec)"></i> 
            </span>
          </div>
        </div>
      </div>
    </div>	
  </div>  
</template>

<script>
const categories = require('../utils/categories.js');
import './shopCart.less';
export default {
  name: 'shop-cart',
  data() {
    return {
      categories: categories,
      activeIndex: 0,
      linkPageConf: {
        height: 0
      },
      isShowList: false,
      showRedDot: false,
      contentScrollTops: [],
      tabCount: {},
      menuScrollTops: [],
      spec: [],
      showSpecModal: false,
      activeIndexSpec: [],
      currSpec: [],
      count: 0,
      categoryCount: {},
      goodCount: {},
      totalAmount: 0
    }
  },
  mounted() {
    this.categories.map((category, index) => {
      // category
      this.tabCount[category.id] = []
    });
    this.initLinkPage();
  },
  methods: {
    initLinkPage() {
      // initial height equal to screen
      let screenHeight = document.documentElement.clientHeight;
      this.linkPageConf.height = screenHeight;
      // initial content scrollTops 
      this.contentScrollTops = this.getScrollTops(this.$refs.contentItem);
      // initial tab scrollTops
      this.menuScrollTops = this.getScrollTops(this.$refs.menuItem);
      // add onScroll event
      this.$refs.content.addEventListener('scroll', (e) => {
        // get scrolltop to emit tabs scrollto
        let _scrollTop = e.target.scrollTop;
        this.contentScrollTops.map((scrollTop, index) => {
          // get scrolltop interval
          if (_scrollTop >= scrollTop && _scrollTop < this.contentScrollTops[index + 1]) {
            this.activeIndex = index;
            this.$refs.menu.scrollTo({
              top: this.menuScrollTops[index],
              behavior: "smooth"
            });
          }
        });
      });
    },
    // get all elems scrolltop whether tabItem or contentItem
    getScrollTops(elems) {
      let heights = [0];
      elems.map((elem, index) => {
        let height = parseFloat(window.getComputedStyle(elem).height) + heights[heights.length - 1];
        ; (index < elems.length - 1) && heights.push(height);
      });
      return heights;
    },
    // click 2 current tab
    onTabClick(index, e) {
      this.activeIndex = index;
      this.$refs.content.scrollTo({
        top: this.contentScrollTops[index],
        behavior: "smooth"
      });
    },
    // click on plus icon with content item
    onAdd2TabCount(item, hasSpec, count) {
      let _arr = [];
      let obj = Object.assign({}, item, {
        hasSpec: hasSpec,
        count: count
      });
      _arr.push(obj);
      return _arr;
    },
    onAdd(pid, item) {
      let _tabC = this.tabCount;
      let _curr = _tabC[pid];
      let _arr = [];
      if (_curr.length) {
        for (let i = 0; i < _curr.length; i++) {
          if (_curr[i].id === item.id) {
            _curr[i].count++;
            break;
          } else {
            ; (i >= _curr.length - 1) && (_arr = this.onAdd2TabCount(item, false, 1));
          }
        }
      } else {
        _arr = this.onAdd2TabCount(item, false, 1);
      }
      this.tabCount = Object.assign({}, this.tabCount, {
        [pid]: _curr.concat(_arr)
      });
    },
    // click on del icon with content item
    onDelOpr(obj) {
      if (obj.count && obj.count > 1) {
        obj.count--;
      } else {
        obj.splice(i, 1);
      }
    },
    onDel(pid, item) {
      let _index = null;
      // get current category
      let _category = this.tabCount[pid];
      // traverse current category
      for (let i = 0; i < _category.length; i++) {
        // get every good.id until match item.id 
        let _good = _category[i];
        if (_good.id === item.id) {
          // get last index whether has guigeList 
          // because that`s different object of specifition
          if (item.guigeList && item.guigeList.length > 0) {
            _index = i;
            // operation current category after traverse
            if (i >= _category.length - 1) {
              if (_category[_index].count && _category[_index].count > 1) {
                _category[_index].count--;
              } else {
                _category.splice(i, 1);
              }
              break;
            }
          } else {
            if (_good.count && _good.count > 1) {
              _good.count--;
            } else {
              _category.splice(i, 1);
            }
            break;
          }
        }
      }
      // item.hasSpec && item.splice(_index, 1);
      this.tabCount = Object.assign({}, this.tabCount);
    },
    // storage curr spec and good 
    onSpec(pid, item, _index) {
      this.spec = Object.assign({}, item, {
        pid: pid,
        index: _index
      });
      this.showSpecModal = true;
    },
    onViewOrder() {
      this.isShowList = !this.isShowList;
    },
    onCloseOrders() {
      this.isShowList = false;
    },
    onCloseSpec() {
      this.showSpecModal = false;
    },
    onAddSpec2Tac(arr, item, currSpec) {
      let _obj = Object.assign({}, item, {
        hasSpec: true,
        specs: currSpec.slice(),
        count: 1
      });
      return arr.push(_obj);
    },
    onAddSpec(item) {
      let pid = item.pid;
      let _tabC = this.tabCount;
      let _curr = _tabC[pid];
      let _arr = [];
      if (_curr.length) {
        for (let i = 0; i < _curr.length; i++) {
          // is belong to same category
          let _equal = true;
          if (_curr[i].hasSpec && _curr[i].id === item.id && _curr[i].specs.length === this.currSpec.length) {
            for (let j = 0; j < this.currSpec.length; j++) {
              let _this = this;
              let _bool = _curr[i].specs.some((specItem) => {
                return specItem.id === _this.currSpec[j].id && specItem.value === _this.currSpec[j].value;
              });
              _equal = _equal && _bool;
            }
            if (_equal) {
              _curr[i].count++;
              break;
            } else {
              if (i >= _curr.length - 1) {
                this.onAddSpec2Tac(_arr, item, this.currSpec);
              }
            }
          } else {
            if (i >= _curr.length - 1) {
              this.onAddSpec2Tac(_arr, item, this.currSpec);
            }
          }
        }
      } else {
        this.onAddSpec2Tac(_arr, item, this.currSpec);
      }
      _tabC[pid] = _curr.concat(_arr);
      this.tabCount = Object.assign({}, _tabC);
    },
    onDelSpec() {
      this.onDel(this.spec.pid, this.spec);
    },
    onAddByOrder(orderItemsI, orderItemI) {
      this.tabCount[orderItemsI][orderItemI].count++;
      this.tabCount = Object.assign({}, this.tabCount);
    },
    onDelByOrder(orderItemsI, orderItemI) {
      if (this.tabCount[orderItemsI][orderItemI].count > 1) {
        this.tabCount[orderItemsI][orderItemI].count--;
      } else {
        this.tabCount[orderItemsI].splice(orderItemI, 1);
      }
      this.tabCount = Object.assign({}, this.tabCount);
    },
    onSelcSpec(specItem, currItem) {
      if (this.currSpec.length) {
        for (let i = 0; i < this.currSpec.length; i++) {
          if (this.currSpec[i].pid === specItem.id) {
            this.currSpec[i] = Object.assign({}, this.currSpec[i], {
              id: currItem.id,
              value: currItem.value
            })
            break;
          } else {
            i >= this.currSpec.length - 1 && this.currSpec.push({
              pid: specItem.id,
              id: currItem.id,
              value: currItem.value
            });
          }
        }
      } else {
        this.currSpec.push({
          pid: specItem.id,
          id: currItem.id,
          value: currItem.value
        });
      }
      this.currSpec = this.currSpec.slice();
    },
    clearShopCart() {
      for (let key in this.tabCount) {
        this.tabCount[key] = [];
      }
      this.tabCount = Object.assign({}, this.tabCount);
    }
  },
  watch: {
    tabCount(newVal) {
      let obj = {}
      // 计算总数
      let count = 0;
      // 计算分类总数
      let categoryCount = {}
      // 计算商品数量
      let goodCount = {}
      let totalAmount = 0;
      for (let key in newVal) {
        categoryCount[key] = 0;
        goodCount[key] = {};
        if (newVal[key].length) {
          for (let j = 0; j < newVal[key].length; j++) {
            // 累加全部总数
            count += newVal[key][j].count;
            totalAmount += newVal[key][j].count * newVal[key][j].price;
            // 累加分类总数
            categoryCount[key] += newVal[key][j].count;
            // 计算商品总数
            let goodId = newVal[key][j].id;
            // goodCount[key][goodId] = 0;
            if (goodCount[key][goodId]) {
              goodCount[key][goodId] += newVal[key][j].count;
            } else {
              goodCount[key][goodId] = newVal[key][j].count
            }
          }
        }
      }
      // 赋值到相应的state
      this.count = count;
      this.categoryCount = categoryCount;
      this.goodCount = goodCount;
      this.totalAmount = totalAmount;
      // 刷新数据
      this.categories = this.categories.slice();
    },
    currSpec(newVal) {
      this.categories = categories;
    }
  }
}

</script>