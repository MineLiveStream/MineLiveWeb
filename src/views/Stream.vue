<template>
   <mdui-top-app-bar scroll-behavior="elevate" id="topAppBar">
      <mdui-top-app-bar-title style="font-size: 16px;margin-left: 90px">MineLive > 推流列表</mdui-top-app-bar-title>
   </mdui-top-app-bar>
   <mdui-navigation-rail divider padding-left id="rail" value="stream">
      <img src="/src/img/logo.png" alt="alternative" style="width: 2.8rem; height: 2.8rem;margin-bottom: 16px;">
      <mdui-navigation-rail-item icon="videocam" id="streamBtn" value="stream">推流</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="topic" id="materialBtn" value="material">素材</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="help_center" href="https://www.yuque.com/seeds-ejjgd/py7vim" target="_blank" id="groupBtn" value="help">教程</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="group" href="https://qm.qq.com/q/hpYH0xIsuY" target="_blank" id="groupBtn" value="group">加群</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="local_fire_department" href="https://www.beishaoidc.cn/aff/TKYYFUGE" target="_blank" id="adv" value="adv">北少云</mdui-navigation-rail-item>
      <mdui-navigation-rail-item slot="bottom" icon="logout" id="logoutBtn" value="logout">登出</mdui-navigation-rail-item>
   </mdui-navigation-rail>
   <mdui-card style="display: flex; flex-wrap: wrap; align-items: center; padding: 12px; margin-right: 16px; margin-left: 16px; background-color: rgba(var(--mdui-color-on-secondary-light, 0.8))">
      <p style="margin-left: 12px;margin-right: 16px;font-size: 18px;" id="countText">已创建 0 个推流</p>
      <div style="flex-grow: 1"></div>
      <mdui-button variant="outlined" style="margin-right: 8px;" id="refreshStreamBtn">刷新列表</mdui-button>
      <mdui-button variant="filled" id="createStreamBtn">创建推流</mdui-button>
   </mdui-card>
   <mdui-container id="streamCardList" style="display: flex; flex-wrap: wrap; gap: 8px; margin-right: 16px; margin-left: 16px; margin-bottom: 8px; margin-top: 8px"></mdui-container>

    <mdui-card style="display: flex; justify-content: center; align-items: center; padding: 12px; margin-right: 16px; margin-left: 16px; background-color: rgba(var(--mdui-color-on-secondary-light, 0.8))">
       <mdui-segmented-button-group>
          <mdui-segmented-button icon="arrow_backward" id="lastPageBtn"></mdui-segmented-button>
          <mdui-segmented-button id="pageText">第1页，共1页</mdui-segmented-button>
          <mdui-segmented-button end-icon="arrow_forward" id="nextPageBtn"></mdui-segmented-button>
        </mdui-segmented-button-group>
    </mdui-card>

   <mdui-dialog
      id = "deleteDialog"
      close-on-overlay-click
      headline="确认删除推流?"
      class="example-action">
      <mdui-button slot="action" variant="text" id="dialogCancelBtn">取消</mdui-button>
      <mdui-button slot="action" variant="tonal" id="dialogConfirmBtn">删除</mdui-button>
   </mdui-dialog>
   <mdui-dialog
      id = "paymentDialog"
      stacked-actions
      close-on-overlay-click
      headline="开通推流"
      class="example-action">
      <div style="display: flex; align-items: center">
         <p>订单价格</p>
         <div style="flex-grow: 1"></div>
         <h3 id="priceText">0 元</h3>
         <div style="flex-grow: 1"></div>
         <mdui-button variant="text" id="useCdkBtn">使用兑换码</mdui-button>
      </div>
      <div style="display: flex; align-items: center;">
         <p style="margin-right: 1px">购买月数</p>
         <mdui-slider style="width: 200px" id="monthSlider"></mdui-slider>
      </div>
      <div style="display: flex; align-items: center">
         <p style="margin-right: 1px">素材类型</p>
         <div style="flex-grow: 1"></div>
         <mdui-button variant="text" id="paymentUpdateBtn">升级类型</mdui-button>
      </div>
      <mdui-radio-group value="hdVideo" id="radio">
         <mdui-radio value="hdVideo">高清视频</mdui-radio>
         <mdui-radio value="video">视频</mdui-radio>
         <mdui-radio value="pic">图片</mdui-radio>
      </mdui-radio-group>
      <mdui-button slot="action" variant="text" id="dialogAlipayBtn">支付宝</mdui-button>
      <mdui-button slot="action" variant="text" id="dialogWechatBtn">微信</mdui-button>
      <mdui-button slot="action" variant="text" id="cancelPaymentBtn">取消</mdui-button>
   </mdui-dialog>
   <mdui-dialog
      id = "changeDialog"
      close-on-overlay-click
      headline="新增推流"
      class="example-action">
      <div style="padding: 12px; display: grid; gap: 16px;">
          <mdui-text-field variant="outlined" label="备注名称" id="streamName"></mdui-text-field>
          <mdui-text-field variant="outlined"  label="推流地址" id="streamUrl"></mdui-text-field>
          <mdui-text-field variant="outlined" label="推流密钥" id="streamKey"></mdui-text-field>
          <mdui-select variant="outlined" id="selectMenu" label="素材"></mdui-select>
      </div>
      <mdui-button slot="action" variant="text" id="changeCancelBtn">取消</mdui-button>
      <mdui-button slot="action" variant="tonal" id="changeConfirmBtn">确定</mdui-button>
   </mdui-dialog>
   <mdui-dialog
      id = "updateDialog"
      stacked-actions
      close-on-overlay-click
      headline="升级推流"
      class="example-action">
      <p>距离到期</p>
      <h3 id="lastDayText">0 元</h3>
      <p>预估价格</p>
      <h3 id="updatePriceText">0 元</h3>
      <mdui-button slot="action" variant="text" id="updateAlipayBtn">支付宝</mdui-button>
      <mdui-button slot="action" variant="text" id="updateWechatBtn">微信</mdui-button>
      <mdui-button slot="action" variant="text" id="cancelUpdateBtn">取消</mdui-button>
   </mdui-dialog>
   <mdui-dialog
      id = "cdkDialog"
      close-on-overlay-click
      headline="使用兑换码"
      description="加群留意活动即可获得！"
      class="example-action">
      <mdui-text-field variant="outlined" label="兑换码" id="cdkInput" style="transform: scale(0.9);"></mdui-text-field>
      <mdui-button slot="action" variant="text" id="cdkCancelBtn">取消</mdui-button>
      <mdui-button slot="action" variant="tonal" id="cdkConfirmBtn">确认</mdui-button>
   </mdui-dialog>
   <mdui-dialog
      id = "qrcodeDialog"
      headline="扫码支付"
      class="example-action">
      <div id="qrcode"></div>
      <mdui-button slot="action" variant="text" id="cancelOrderBtn">取消</mdui-button>
   </mdui-dialog>
    <mdui-dialog fullscreen id="logDialog" headline="运行日志">
     <div style="display: flex; flex-direction: column; height: 100%;">
       <div id="logDiv" style="flex: 1; overflow: auto; padding: 12px; display: grid;"></div>
       <mdui-button id="logDialogCloseBtn">关闭</mdui-button>
     </div>
   </mdui-dialog>
</template>
<script>
   import init from '../js/stream';
   export default {
     mounted() {
       init();
     }
   }
</script>
<style></style>