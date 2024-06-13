<template>
  <mdui-top-app-bar scroll-behavior="elevate" style="background-color: rgba(var(--mdui-color-primary-container, 0.8))">
    <div style="margin-left: 80px"></div>
    <img src="https://s21.ax1x.com/2024/04/07/pFq2AoR.png" alt="alternative" style="width: 2.5rem; height: 2.5rem;">
    <mdui-top-app-bar-title>推流列表</mdui-top-app-bar-title>
    <mdui-tooltip content="创建推流">
      <mdui-button-icon variant="filled" icon="add" id="createStreamBtn"></mdui-button-icon>
    </mdui-tooltip>
    <div style="margin-left: 1px"></div>
    <mdui-tooltip content="刷新列表">
      <mdui-button-icon variant="filled" icon="refresh" id="refreshBtn"></mdui-button-icon>
    </mdui-tooltip>
  </mdui-top-app-bar>

  <mdui-navigation-rail divider padding-left id="rail" value="stream">
    <mdui-navigation-rail-item icon="videocam" id="streamBtn" value="stream">推流</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="topic" id="materialBtn" value="material">素材</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="help_center" href="https://www.yuque.com/seeds-ejjgd/py7vim" target="_blank" id="groupBtn" value="help">教程</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="group" href="https://qm.qq.com/q/hpYH0xIsuY" target="_blank" id="groupBtn" value="group">加群</mdui-navigation-rail-item>
    <mdui-navigation-rail-item variant="tonal" icon="local_fire_department" href="https://www.anxidc.com/aff/CLSRWXAI" target="_blank" value="ad">失忆云</mdui-navigation-rail-item>
    <mdui-navigation-rail-item slot="bottom" icon="logout" id="logoutBtn" value="logout">登出</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <mdui-container class="mdui-m-t-2">
    <mdui-table-fluid>
      <table class="mdui-table mdui-table-striped">
        <thead>
        <tr>
          <th>名称</th>
          <th>推流地址</th>
          <th>推流密钥</th>
          <th>素材名称</th>
          <th>剩余时长</th>
          <th>当前状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody id="material-list-tbody">
        </tbody>
      </table>
    </mdui-table-fluid>
  </mdui-container>

  <mdui-segmented-button-group full-width>
    <mdui-segmented-button icon="arrow_backward" id="lastPageBtn"></mdui-segmented-button>
    <mdui-segmented-button id="pageText">第1页，共1页</mdui-segmented-button>
    <mdui-segmented-button end-icon="arrow_forward" id="nextPageBtn"></mdui-segmented-button>
  </mdui-segmented-button-group>

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
    <mdui-text-field style="margin-bottom: 16px" label="名称" id="streamName"></mdui-text-field>
    <mdui-text-field style="margin-bottom: 16px" label="推流地址" id="streamUrl"></mdui-text-field>
    <mdui-text-field style="margin-bottom: 16px" label="推流密钥" id="streamKey"></mdui-text-field>
    <mdui-select id="selectMenu" label="素材">
    </mdui-select>
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
    <mdui-text-field label="兑换码" id="cdkInput" style="margin-bottom: 24px"></mdui-text-field>
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

  <mdui-dialog fullscreen class="example-fullscreen" id="logDialog">
    运行日志<div id="logDiv"></div><br>
    <mdui-button id="logDialogCloseBtn">关闭</mdui-button>
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

<style>
</style>