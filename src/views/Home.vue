<template>
   <mdui-top-app-bar padding-top style="background-color: rgba(var(--mdui-color-primary-container, 0.8))" id="topAppBar">
      <div style="flex-grow: 1"></div>
      <img src="/src/img/logo.png" alt="alternative" style="width: 2.5rem; height: 2.5rem;">
      <div style="flex-grow: 1"></div>
      <mdui-top-app-bar-title>MineLive</mdui-top-app-bar-title>
      <div style="flex-grow: 1"></div>
   </mdui-top-app-bar>
   <div style="display: flex;margin-top: 8px;margin-bottom: 8px;flex-wrap: wrap;">
      <div id="picDiv" style="display: flex; justify-content: center; flex-grow: 1">
          <img class="img-fluid" src="/src/img/stream.png" alt="alternative" width=400px>
      </div>
      <div class="mdui-prose" style="margin-bottom: 8px">
         <br><br>
         <h2 id="typewriter" style="font-weight: bold;width: 290px">我的世界，宣传新服</h2>
         <h3>24 x 7 全自动推流直播</h3>
         <p>新注册用户，免费赠送 24 小时</p>
         <br>
         <div style="display: flex; justify-content: space-between">
            <mdui-button variant="outlined" style="margin-right: 26px" href="https://qm.qq.com/q/hpYH0xIsuY" target="_blank">加入群聊</mdui-button>
            <mdui-button variant="filled" id="startBtn">开始使用</mdui-button>
         </div>
         <br>
         <div style="height: 10px">
            <a href="https://www.yuque.com/seeds-ejjgd/py7vim" target="_blank">使用教程</a>
         </div>
         <br>
      </div>
      <div style="flex-grow: 1"></div>
   </div>
   <mdui-divider></mdui-divider>
   <div class="mdui-prose" style="margin: 8px;">
      <h3 style="margin-top: 16px;">为什么选择 MineLive ？</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; margin: 16px" id="cardBtn">
         <mdui-card variant="outlined" clickable class="mdui-card">
            <mdui-icon class="mdui-icon" name="access_time_filled"></mdui-icon>
            <h4>分钟计费，随时暂停</h4>
         </mdui-card>
         <mdui-card variant="outlined" clickable class="mdui-card">
            <mdui-icon class="mdui-icon" name="video_library"></mdui-icon>
            <h4>稳定直播，高清画质</h4>
         </mdui-card>
         <mdui-card variant="outlined" clickable class="mdui-card">
            <mdui-icon class="mdui-icon" name="account_balance_wallet"></mdui-icon>
            <h4>价格实惠，配置方便</h4>
         </mdui-card>
      </div>
   </div>
   <mdui-divider></mdui-divider>
   <div class="mdui-prose">
      <br>
      <p>友情外链
         &nbsp;<a target="_blank" href="https://minecraft.net/">Minecraft</a>
         &nbsp;&nbsp;<a target="_blank" href="https://minepay.top/">MinePay</a>
         &nbsp;&nbsp;<a target="_blank" href="https://mcnav.fun/">McNav</a>
      </p>
      <div style="height: 8px">
         <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2024277949号</a>
      </div>
      <br>
      <p>MIT License Copyright &copy; 2024 <a target="_blank" href="https://github.com/MineLiveStream/MineLiveWeb">MineLive</a></p>
   </div>
   <mdui-snackbar class="snackbar" id="textSnackbar"></mdui-snackbar>
   <mdui-dialog
      close-on-overlay-click
      id = "loginDialog"
      headline="登录账号"
      description="祝你天天开心～(^з^)-♡"
      class="example-action">
      <form style="padding: 12px; display: grid; gap: 16px">
         <mdui-text-field variant="outlined" label="邮箱" id="loginEmail"></mdui-text-field>
         <mdui-text-field variant="outlined" label="密码" id="loginPwd" type="password" toggle-password></mdui-text-field>
         <mdui-button full-width id="loginBtn">登录</mdui-button>
         <div style="display: flex; justify-content: space-between">
            <a id="forgetText">忘记密码</a>
            <a id="regText">注册账号</a>
         </div>
      </form>
   </mdui-dialog>
   <mdui-dialog
      close-on-overlay-click
      id="regDialog"
      headline="注册账号"
      description="要记得喝水哦( •̀∀•́ )"
      class="example-action">
      <div style="padding: 12px; display: grid; gap: 16px">
         <mdui-text-field variant="outlined" label="昵称" id="regName"></mdui-text-field>
         <mdui-text-field variant="outlined" label="邮箱" id="regEmail"></mdui-text-field>
         <mdui-text-field variant="outlined" label="密码" id="regPwd" type="password" toggle-password></mdui-text-field>
         <div style="display: flex; justify-content: center;align-items: center; gap: 16px">
            <mdui-text-field variant="outlined" label="验证码" id="regCode" toggle-password></mdui-text-field>
            <mdui-button id="sendRegBtn" style="width:40%">发送验证码</mdui-button>
         </div>
         <mdui-button full-width id="regBtn">注册</mdui-button>
         <a id="loginText">已有账号</a>
      </div>
   </mdui-dialog>
   <mdui-dialog
      close-on-overlay-click
      id="forgetDialog"
      headline="重置密码"
      description="这次要记得呢，嗯(｡•ˇ‸ˇ•｡) ！"
      class="example-action">
      <div style="padding: 12px; display: grid; gap: 16px">
         <mdui-text-field variant="outlined" label="邮箱" id="forgetEmail"></mdui-text-field>
         <mdui-text-field variant="outlined" label="密码" id="forgetPwd" type="password" toggle-password></mdui-text-field>
         <div style="display: flex; justify-content: center;align-items: center; gap: 16px">
            <mdui-text-field variant="outlined" label="验证码" id="forgetCode" toggle-password></mdui-text-field>
            <mdui-button id="sendForgetBtn" style="width:40%">发送验证码</mdui-button>
         </div>
         <mdui-button full-width id="forgetBtn">确认</mdui-button>
         <a id="backLoginText">返回登录</a>
      </div>
   </mdui-dialog>
</template>
<script>
   import init from '../js/home';
   export default {
     mounted() {
       init();
     }
   }
</script>
<style>
   .mdui-prose {
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   height: 100%;
   }
   .mdui-card {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   width: 240px;
   height: 160px;
   }
   .mdui-icon {
   font-size: 32px;
   color: rgb(var(--mdui-color-primary));
   }
</style>