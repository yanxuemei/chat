<template>
  <div>
    <head-top>
    </head-top>
    <section class="coversation" ref="singleHeight" @click="bottomHide">
      <section class="coversationlist">
        <ul>
          <!-- 对方 -->
          <li v-for="item in conversine">
            <div class="other" :class="{mysay : item.sendobject !== 1 }">
              <img :src="item.headurl" alt="">
              <div class="whatsay">
                <div class="whatsay_svg">
                  <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                         :xlink:href="item.sendobject !== 1 ? '#trigon-right' : '#trigon-left'"></use>
                  </svg>
                </div>
                <!--文字-->
                <div class="whatsay_text" v-emotion="item.Messageblob" v-if="item.type===1">
                </div>
                <!--表情-->
                <div class="whatsay_text" v-else-if="item.type===2">
                  <img :src="item.Messageblob" class="image" alt="聊天图片">
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </section>
    <footer :class=" {footshow : clickmore}">
      <section class="foot_top">
        <div>
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#voice"></use>
          </svg>
        </div>
        <div>
          <input type="text" v-model="inputmessage" maxlength="100" @input="whatInput" @click="inputBottomHide"
                 :class="{lightborder : light}" @keyup.enter="enterThing">
        </div>
        <div>
          <svg @click="bottomFaceShow">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#face"></use>
          </svg>
        </div>
        <div>
          <div class="send" @click="clickSend">
            <span>发送</span>
          </div>
        </div>
      </section>
      <section class="foot_bottom">
        <template>
          <el-tabs type="border-card">
            <el-tab-pane label="斗图">
              <div class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(value,key) in chatData">
                  <ul class="clear">
                    <li v-for="(value,index) in value" @click="clickFaceId(key,index)">
                      <div class="swiper_img">
                        <img :src="value.faceid">
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="swiper-pagination"></div>
            </div>
            </el-tab-pane>
            <el-tab-pane label="AI"><ul class="ai">
              <li v-for="(item,index) in aiData" @click="clickAi(index)">
                {{item.text}}
              </li>
            </ul>
            </el-tab-pane>
            <el-tab-pane label="颜文字"></el-tab-pane>
            <el-tab-pane label="表情"></el-tab-pane>
          </el-tabs>
        </template>
      </section>
    </footer>
  </div>
</template>

<script>

  import headTop from './components/header/head.vue';
  import './config/swiper.min.js'
  import './style/swiper.min.css'
  import {dialog, chatData, aiData,robot} from './service/getData'
  import * as chatFace from "./api/chatFace";

  export default {
    data() {
      return {
        inputmessage: '',//输入的文本内容
        light: false,	//输入框不为空时，input下边框变色
        clickmore: false,	//点击底部显示、隐藏
        clickai: false,	//点击AI底部显示、隐藏
        clickface: false,//点击表情底部显示、隐藏
        conversine: [],		//对话列表
        aiData: [],		//对话列表
        robotData: [],		//机器人回复列表
        chatData: {}, //表情信息
      }
    },
    created() {

    },
    mounted() {
      //拉取表情
      chatData().then((res) => {
        this.chatData = res;
      }).then(() => {
        //初始化swiper
          new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            loop: false,
          });
      });

      //网络请求方式
      /**
       * 以拉取表情为例通过RESTful接口规范获取后端真实数据
       * method:get
       * url:api/index.js里面的默认host
       * 请求参数：自定义  通过r()进行传入
       * 返回数据：参考service/data数据接口
       */
      // chatFace.get.r().then(res => {
      //   if (res.data.code === 200) {
      //     this.chatData = res;
      //   }
      // }).then(() => {
      //   //初始化swiper
      //   new Swiper('.swiper-container', {
      //     pagination: '.swiper-pagination',
      //     loop: false,
      //   });
      // }).catch((error) =>{
      // });

      //拉取对话详情
      dialog().then((res) => {
        this.conversine = res;
      })
      //拉取AI提示信息
      aiData().then((res) => {
        this.aiData = res;
      })

      //拉取机器人对话信息
      robot().then((res) => {
        this.robotData = res;
      })

    },
    components: {
      headTop,
    },
    methods: {
      //判断输入框状态
      whatInput() {
        if (this.inputmessage.replace(/\s+/g, "") === '') {
          this.light = false;
        } else {
          this.light = true;
        }
      },
      //回车发送消息
      enterThing() {
        if (this.inputmessage.replace(/\s+/g, "")!== '') {
          this.clickSend();
        }
      },
      //选择发送AI提示消息
      clickAi(index) {
        //给输入框赋值
        this.inputmessage = this.aiData[index].text;
        this.whatInput();
        this.bottomHide();
      },
      //选择发送表情消息
      clickFaceId(key,index){
        this.conversine.push({
          "headurl": require("./assets/images/header02.jpg"),
          "type": 2,
          "sendobject": 0,
          "Messageblob": this.chatData[key][index].faceid,
        });
        //隐藏下面窗口
        //this.bottomHide();
        //调用自动回复
        this.robotSend();

      },
      //显示表情弹窗
      bottomFaceShow() {
        this.clickai = false;
        this.clickmore = true;
        this.clickface = true;
      },
      //显示AI提示弹框
      bottomAiShow() {
        this.clickface = false;
        this.clickmore = true;
        this.clickai = true;
      },
      //隐藏弹出框
      bottomHide() {
        this.clickmore = false;
        this.clickai = false;
        this.clickface = false;
      },
      //发送按钮隐藏
      inputBottomHide() {
        this.clickmore = false;
      },
      //消息发送
      clickSend() {
        if (this.inputmessage.replace(/\s+/g, "")=== '') {
          return
        }
        this.conversine.push({
          "headurl": require("./assets/images/header02.jpg"),
          "type": 1,
          "sendobject": 0,
          "Messageblob": this.inputmessage,
        });
        // 输入框清空
        this.inputmessage = '';
        //隐藏发送按钮
        this.light = false;
        this.$nextTick(()=>{
          window.scrollTo(0,this.$refs.singleHeight.offsetHeight-window.innerHeight)
        })
        //调用模拟自动回复
        this.robotSend();
      },
      //机器人消息回复
      robotSend() {
        this.conversine.push(this.robotData[Math.floor(Math.random()*10)]);
        // 输入框清空
        this.inputmessage = '';
        //隐藏发送按钮
        this.light = false;
        this.$nextTick(()=>{
          window.scrollTo(0,this.$refs.singleHeight.offsetHeight-window.innerHeight)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "./style/public";

  .router-show-enter-active, .router-show-leave-active {
    transition: all .4s;
  }

  .router-show-enter, .router-show-leave-active {
    transform: translateX(100%)
  }

  .coversPart {
    @include topcenter;
    right: 0.5973333333rem;
    @include widthHeight(0.8533333333rem, 0.8533333333rem);
    .person_link {
      display: block;
      @include widthHeight(0.8533333333rem, 0.8533333333rem);
      svg {
        @include widthHeight(100%, 100%);
      }
    }
  }

  .coversation {
    padding-top: 2.06933rem;
    .coversationlist {
      position: relative;
      padding: 0 .32rem;
      margin: 0 auto;
      .underscore {
        padding-top: 0.2rem;
        text-align: center;
        @include sizeColor(0.5546666667rem, #999);
      }
      ul {
        padding-top: .4rem;
        padding-bottom: 4.2rem;
        overflow-scrolling: touch;
        -webkit-overflow-scrolling: touch;
        top: 0;
        li {
          .other {
            width: 100%;
            @include justify(flex-start);
            margin-bottom: 0.512rem;
            align-items: flex-start;
            img {
              display: block;
              @include widthHeight(2.5493333333rem, 2.5493333333rem);
            }
            .whatsay {
              position: relative;
              .whatsay_svg {
                @include widthHeight(0.4266666667rem, 0.64rem);
                position: absolute;
                top: .5546667rem;
                left: .36rem;
                z-index: 2;
                svg {
                  display: block;
                  @include widthHeight(0.4266666667rem, 0.64rem);
                }
              }

              .whatsay_text {
                margin-left: 0.6399997rem;
                max-width: 10.3253333333rem;
                max-height: 10.3253333333rem;
                background: #fff;
                padding: 0.42rem 0.384rem;
                border: 1px solid #d9d9d9;
                border-radius: 8px;
                @include sizeColor(0.64rem, #333);
                //line-height: 0.8533333333rem;
                word-break: break-all;
                img {
                  width: 100px;
                  height: 100px;
                }
              }
            }

          }
          .mysay {
            display: flex;
            flex-direction: row-reverse;
            .whatsay {
              .whatsay_svg {
                right: .36rem;
                left: auto;
              }
              .whatsay_text {
                margin-right: 0.6399997rem;
                margin-left: 0;
                background: #9fe658;
                img {
                  max-width: 200px;
                }
              }
            }
          }
        }
      }

    }
  }

  footer {
    position: fixed;
    z-index: 10;
    border-top: 1px solid #e0e0e0;
    background: #f5f5f5;
    bottom: -13.212rem;
    width: 100%;
    .foot_top {
      padding: 0 0.512rem;
      height: 2.0053333333rem;
      background: #f3f3f3;
      @include justify(flex-start);
      align-items: center;
      div:nth-of-type(1), div:nth-of-type(3), div:nth-of-type(4) {
        @include widthHeight(1.3653333333rem, 1.3653333333rem);
        margin-right: 0.3413333333rem;
        svg {
          @include widthHeight(100%, 100%);
        }
      }
      div:nth-of-type(2) {
        margin-right: 0.3413333333rem;
        width: 9.8rem;
        height: 1.152rem;
        border-bottom: 1px solid #e0e0e0;
        flex: 1;
        input {
          display: block;
          width: 100%;
          padding: 0 0.4133333333rem;
          line-height: 1.152rem;
          height: 1.152rem;
          border: 0;
          background: none;
          @include sizeColor(0.64rem, #000);
          border-bottom: 1px solid #e0e0e0;
        }
        .lightborder {
          border-color: #19ad17;
        }
      }
      div:nth-of-type(4) {
        margin-right: 0;
        .send {
          width: 1.8133333333rem;
          background: #16af17;
          height: 1.3653333333rem;
          padding: .682666rem 0;
          border-radius: 5px;
          @include justify(center);
          align-items: center;
          span {
            display: block;
            @include sizeColor(0.5973333333rem, #fff);
          }
        }
        .send:active {
          background: #33c034;
        }
      }
    }
    .foot_bottom {
      height: 13.212rem;
      border-top: 1px solid #e0e0e0;
      .swiper-container {
        width: 100%;
        height: 11.712rem;
        overflow: hidden;
        .swiper-slide {
          width: 100%;
          ul {
            padding: 1.408rem 0.1946666667rem 0;
            box-sizing: border-box;
            li {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 25%;
              float: left;
              margin-bottom: 1.1946666667rem;
              .swiper_img {
                @include widthHeight(3.0466666667rem, 3.0466666667rem);
                @include justify(center);
                align-items: center;
                img {
                  @include widthHeight(3.528rem, 3.3386666667rem);
                  display: block;
                }
              }
              .swiper_text {
                width: 100%;
                margin-top: 0.256rem;
                text-align: center;
                @include sizeColor(0.4693333333rem, #7a8187);
              }
            }
          }
        }
      }

      .ai {
        height: 100%;
        overflow-y: visible;
        overflow-x: hidden;
        padding: 12px;
        li {
          color: #424447;
          margin-left: 3px;
          border-bottom: 1px solid #ECEEF1;
          height: 30px;
          line-height: 30px;
          font-size: 14px
        }
      }
    }
  }

  .footshow {
    bottom: 0;
    transition: all .2s;
  }

  .enlarge {
    position: fixed;
    @include widthHeight(100%, 100%);
    background: #000000;
    top: 0;
    z-index: 100;

    img {
      display: block;
      width: 100%;
      height: 15.0186666667rem;
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -7.5093333333rem;
    }
  }

  .enlarge_part {
    display: none;
  }

  body .movein-animate {
    transition: all 1s;
    animation: fadeIn .6s;
  }

  body .moveout-animate-leave {
    transition: all 1s;
    animation: zoomOut .6s;
  }

  @-webkit-keyframes fadeIn {
    from {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes zoomOut {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3);
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes zoomOut {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3);
    }

    100% {
      opacity: 0;
    }
  }
</style>
