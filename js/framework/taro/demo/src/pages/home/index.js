import React, { Component } from "react"
import { connect } from "react-redux"
import { View, Text, Swiper, Image, SwiperItem, Button, ScrollView } from "@tarojs/components"
import { add, minus, asyncAdd } from "../../actions/counter"
import { Navbar } from "@/components"
import { images, icons } from "@/utils/images"
import "./index.less"

let { banner1, banner2, banner3 } = images
let { firstHand_2, free_2, justify_2, quality_2, arrowRightGray } = icons
@connect(
  ({ counter }) => ({
    counter,
  }),
  (dispatch) => ({
    add() {
      dispatch(add())
    },
    dec() {
      dispatch(minus())
    },
    asyncAdd() {
      dispatch(asyncAdd())
    }
  })
)
class Home extends Component {
  config = {
    usingComponents: {
      navbar: "../../components/Navbar/index",
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      // configStyle: this.setStyle(globalSystemInfo)
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const swiperItems = [{
      src: banner1,
      alt: 'banner 1'
    }, {
      src: banner2,
      alt: 'banner 2'
    }, {
      src: banner3,
      alt: 'banner 3'
    }]
    const slogans = [{
      src: firstHand_2,
      alt: 'firstHand_2',
      text: '一手货源'
    }, {
      src: free_2,
      alt: 'free_2',
      text: '0服务费'
    }, {
      src: justify_2,
      alt: 'justify_2',
      text: '公平公正'
    }, {
      src: quality_2,
      alt: 'quality_2',
      text: '品质保障'
    }]
    return (
      <View className="home">
        {/* 导航栏 */}
        <Navbar title="小当竞拍" />

        {/* 轮播 - start */}
        <Swiper
          className='swiper-wrap'>
          {
            swiperItems.map(function (swiperItem) {
              return (
                <SwiperItem className="swiper-item" key={swiperItem.alt}>
                  <Image className="swiper-item__image" src={swiperItem.src} alt={swiperItem.alt} />
                </SwiperItem>
              )
            })
          }
        </Swiper>
        {/* 轮播 - end */}

        {/* slogan - start */}
        <View className="slogan-wrap">
          {
            slogans.map(function (slogan) {
              return (
                <View className="slogan-item center" key={slogan.alt}>
                  <Image className="slogan-item__image" src={slogan.src} alt={slogan.alt} />
                  <Text className="slogan-item__text">{slogan.text}</Text>
                </View>
              )
            })
          }
        </View>
        {/* slogan - end */}

        {/* 登录按钮 */}
        <Button className="login__btn center">登陆后才能查看哦</Button>

        {/* 单台明拍 - start */}
        <View className="sessions-wrap">
          {/* 头部 */}
          <View className="header">
            <View className="title-wrap">
              <Text className="title-wrap__text">单台明拍</Text>
              <View className="title-wrap__viewMore center">
                <Text className="text">查看更多</Text>
                <Image className="icon-viewMore" src={arrowRightGray} alt="查看更多场次" />
              </View>
            </View>
            <Text className="slogan">公平公正 价高者得</Text>
          </View>
          {/* 主体内容 */}
          <View className="body">
            <ScrollView
              className='scrollview-wrap'
              scrollX
              scrollWithAnimation
            >
              <View className="session-wrap pre">
                1
              </View>
              <View className="session-wrap active">
                2
              </View>
              <View className="session-wrap active">
                3
              </View>
            </ScrollView>
          </View>
        </View>
        {/* 单台明拍 - end */}

        {/* <View className="login__btn">

          <View className="slogan-item center">
          </View>

        </View> */}
      </View>
    )
  }
}

export default Home
