<template>
  <div class="login-container">
    <div class="login-box">
      <div class="box-left">
        <img src="@/assets/login/left_bg.png">
      </div>
      <div class="box-right">
        <!-- <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">外包管理系统</h3>
          </div>

          <el-form-item prop="login_name">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="login_name"
              v-model="loginForm.login_name"
              placeholder="请输入用户名"
              name="login_name"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 30px"
            @click.native.prevent="handleLogin"
            >登录</el-button
          >
        </el-form> -->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title">
            <div class="title-logo">
              <img src="@/assets/login/logo.png">
            </div>
            <div class="title-name">
              <div class="large">外包管理系统</div>
              <div class="small">Outsourcing management system</div>
            </div>
          </div>
          <div class="inputs">
            <div class="input-item">
              <div class="item-label">Email address</div>
              <div class="item-input">
                <el-form-item prop="login_name">
                  <el-input
                    ref="login_name"
                    v-model="loginForm.login_name"
                    placeholder="请输入账号"
                    name="login_name"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                  >
                    <img
                      slot="prefix"
                      src="@/assets/login/login_name_icon.png"
                    >
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="input-item">
              <div class="item-label">Login password</div>
              <div class="item-input">
                <el-form-item prop="password">
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="请输入密码"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                  >
                    <img
                      slot="prefix"
                      src="@/assets/login/login_pass_icon.png"
                    >
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="btn">
            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; margin-bottom: 30px"
              @click.native.prevent="handleLogin"
            >登录</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <el-dialog
      title="短信验证"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="450px"
    >
      <el-form
        ref="verifyForm"
        class="dialog-form"
        :rules="verifyRules"
        :model="verifyForm"
        label-position="left"
        label-width="100px"
        style="margin: 0 20px"
        size="mini"
      >
        <el-form-item label="手机号:" prop="mobile">
          {{ verifyForm.mobile | numberHidden }}
        </el-form-item>

        <el-form-item label="验证码:" prop="code">
          <div class="code-box">
            <el-input v-model="verifyForm.code" class="dialog-form-item" />
            <el-button
              v-if="sending === false && seconding === false"
              type="primary"
              size="mini"
              @click.stop="sendSms"
            >
              发送
            </el-button>
            <el-button
              v-else
              disabled
              type="primary"
              size="mini"
            >{{ seconds }}S</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="verifying"
          @click="confirmVerify"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { login, checkCode } from '@/api/user'
import { setToken } from '@/utils/auth'
import { sendCode } from '@/api/system/sms'
import { replaceToHidden } from '@/utils/index'

export default {
  name: 'Login',
  filters: {
    numberHidden(value) {
      if (!value) {
        return ''
      }
      return replaceToHidden(value, 3, 4)
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      callback()
      // if (value.length < 6) {
      //   callback(new Error('密码不能少于6位'))
      // } else {
      //   callback()
      // }
    }
    return {
      loginForm: {
        login_name: '',
        password: ''
      },
      loginRules: {
        // login_name: [
        //   { required: true, trigger: 'blur', validator: validateUsername }
        // ],
        // password: [
        //   { required: true, trigger: 'blur', validator: validatePassword }
        // ],
        login_name: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      dialogFormVisible: false,
      sending: false,
      seconding: false,
      seconds: 60,
      timeClock: null,
      verifying: false,
      verifyForm: {
        mobile: '',
        code: ''
      },
      verifyRules: {
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.timeClock && clearInterval(this.timeClock)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          login({
            login_name: this.loginForm.login_name.trim(),
            password: this.loginForm.password
          })
            .then((response) => {
              this.loading = false
              const { data } = response
              if (data.is_supplier && data.is_supplier === 1) {
                this.verifyForm = Object.assign({}, this.verifyForm, {
                  mobile: data.mobile
                })
                this.dialogFormVisible = true
              } else {
                this.$store.commit(
                  'user/SET_TOKEN',
                  `bearer ${data.access_token}`
                )
                setToken(`bearer ${data.access_token}`)
                this.$router.push({ path: '/' })
              }
            })
            .catch((_error) => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    startClock() {
      this.timeClock && clearInterval(this.timeClock)
      this.seconding = true
      this.timeClock = setInterval(() => {
        if (this.seconds <= 0) {
          clearInterval(this.timeClock)
          this.seconds = 60
          this.seconding = false
        } else {
          this.seconds = this.seconds - 1
        }
      }, 1000)
    },
    sendSms() {
      if (!this.verifyForm.mobile) {
        this.$message.error('请先输入手机号')
        return false
      }
      this.sending = true
      sendCode({ mobile: this.verifyForm.mobile })
        .then((response) => {
          this.sending = false
          this.startClock()
        })
        .catch((_error) => {
          this.sending = false
        })
    },
    confirmVerify() {
      this.$refs.verifyForm.validate((valid) => {
        if (valid) {
          this.verifying = true
          checkCode(this.verifyForm)
            .then((response) => {
              const { data } = response
              this.$store.commit(
                'user/SET_TOKEN',
                `bearer ${data.access_token}`
              )
              setToken(`bearer ${data.access_token}`)
              this.verifying = false
              this.$router.push({ path: '/' })
            })
            .catch((_error) => {
              this.verifying = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<!-- <style lang="scss">

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    // color: $cursor;
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
      height: 47px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #ffffff inset !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style> -->

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: relative;
  height: 100%;
  background: #ebedf5;
  .login-box {
    background: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 1120px;
    height: 700px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 3px 3px 10px 0 rgb(0 0 0 / 20%);
    .box-left {
      height: 100%;
      flex: 1;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .box-right {
      flex: 1;
      height: 100%;
      .login-form {
        height: 100%;
        // margin-top: 115px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .title {
          width: 330px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .title-logo {
            width: 50px;
            height: 50px;
            img {
              height: 100%;
              width: 100%;
            }
          }
          .title-name {
            margin-left: 15px;
            .large {
              height: 18px;
              line-height: 18px;
              font-size: 18px;
            }
            .small {
              margin-top: 6px;
              height: 8px;
              line-height: 8px;
              font-size: 8px;
              color: #bdc2ce;
            }
          }
        }
        .inputs {
          margin-top: 50px;
          .input-item {
            margin-bottom: 25px;
            .item-label {
              padding-left: 14px;
              height: 8px;
              line-height: 8px;
              font-size: 8px;
              color: #90959d;
            }
            .item-input {
              margin-top: 8px;
              .el-input {
                img {
                  width: 16px;
                  height: 16px;
                }
                ::v-deep input {
                  width: 350px;
                  height: 37px;
                  background: #fafafb;
                  border: 0px solid #fafafb;
                  border-radius: 18px;
                  padding-left: 39px;
                  -webkit-appearance: none;
                  &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px #fafafb inset !important;
                  }
                }
                ::v-deep .el-input__prefix {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  left: 14px;
                }
              }
              ::v-deep .el-form-item__error {
                padding-left: 20px;
              }
            }
          }
        }

        .btn {
          width: 350px;
          margin-top: 10px;
          ::v-deep .el-button {
            height: 37px;
            background: #5b9cf8;
            border: 0px solid #5b9cf8;
            border-radius: 18px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .code-box {
    display: flex;
    .el-button {
      margin-left: 10px;
    }
  }
  .dialog-footer {
    margin-right: 20px;
  }
}
</style>
