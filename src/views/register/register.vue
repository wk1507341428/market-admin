<template>
    <div class="login-container">
        <el-form ref="loginForm" class="login-form" auto-complete="on" label-position="left">

            <div class="title-container">
                <h3 class="title">注册</h3>
            </div>

            <el-form-item prop="tel">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input
                    ref="tel"
                    v-model="form.tel"
                    placeholder="用户手机号"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                    maxlength="11"
                />
            </el-form-item>

            <!-- 获取验证码 -->
            <el-form-item prop="verify-code">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input
                    ref="verify"
                    v-model="form.smsCode"
                    type="text"
                    placeholder="短信验证码"
                    tabindex="2"
                    maxlength="6"
                    auto-complete="on"
                />
                <el-button type="warning" @click="SendMobileSms" class="send-verify-btn" size="medium" round>{{ verifyText }}</el-button>
            </el-form-item>

            <!-- 图形验证码 -->
            <!-- <el-form-item prop="verify-image">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input
                    ref="verify"
                    type="text"
                    v-model="ImageCaptha"
                    placeholder="图形验证码"
                    tabindex="2"
                    auto-complete="on"
                />
                <img class="image" :src="`data:image/png;base64,${ImageCodeUrl}`" width="80" height="40" alt="">
            </el-form-item> -->

            <el-button :loading="false" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>

            <div class="tips">
                <router-link to="/login">已经有账号了，去登陆</router-link>
            </div>

        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ImageCodeUrl: '', // 图片验证码地址
            ImageCaptha: '', // 用户填的用户验证码
            verifyText: '获取验证码',
            form: {
                tel: '', // 手机号
                smsCode: '' // 验证码
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.GetImgVerifyCode()
        },
        async GetImgVerifyCode() {
            const result = await this.$api.GetImgVerifyCode()
            this.ImageCodeUrl = result.data.image

            console.log(window.atob(result.data.code))
        },
        // 发送验证码
        async SendMobileSms() {
            if (this.verifyText !== '获取验证码') return
            this.verifyText = '获取中...'
            const { tel } = this.form
            await this.$api.SendMobileSms(tel)
            let countDown = 60
            const auto = setInterval(() => {
                countDown--
                this.verifyText = `${countDown}秒`
                if (countDown <= 0) {
                    clearInterval(auto)
                    this.verifyText = '获取验证码'
                }
            }, 1000)
        },
        // 注册接口
        async handleRegister() {
            const { tel, smsCode } = this.form
            const { ImageCaptha, ImageCodeUrl } = this.$data
            const result = await this.$api.register({
                phone: tel,
                smsCode
            })
            const { phone, password } = result.data
            const confirm = await this.$alert(`注册成功,您的账号是：${phone}，您的密码是：${password}`, '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            })
            if (!confirm) return
            this.$router.push({ path: '/login' })
        }
    }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

.image{
    position: absolute;
    right: 10px;
    top: 0;
    top: 50%;
    transform: translateY(-50%);
}

.send-verify-btn{
    position: absolute;
    right: 10px;
    top: 0;
    top: 50%;
    transform: translateY(-50%);
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
