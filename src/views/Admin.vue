<template>
  <mdui-top-app-bar scroll-behavior="elevate" style="background-color: rgba(var(--mdui-color-primary-container, 0.8));">
    <div style="margin-left: 80px"></div>
    <img src="/src/img/logo.png" alt="alternative" style="width: 2.5rem; height: 2.5rem;">
    <mdui-top-app-bar-title id="titleText">管理推流</mdui-top-app-bar-title>
    <mdui-tooltip content="接管列表">
      <mdui-button-icon variant="filled" icon="computer" id="clientBtn"></mdui-button-icon>
    </mdui-tooltip>
    <div style="margin-left: 1px"></div>
    <mdui-tooltip content="刷新列表">
      <mdui-button-icon variant="filled" icon="refresh" id="refreshBtn"></mdui-button-icon>
    </mdui-tooltip>
  </mdui-top-app-bar>

  <mdui-navigation-rail divider padding-left id="rail" value="admin">
    <mdui-navigation-rail-item icon="videocam" id="streamBtn" value="stream">推流</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="topic" id="materialBtn" value="material">素材</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="help_center" href="https://www.yuque.com/seeds-ejjgd/py7vim" target="_blank" id="groupBtn" value="help">教程</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="group" href="https://qm.qq.com/q/hpYH0xIsuY" target="_blank" id="groupBtn" value="group">加群</mdui-navigation-rail-item>
    <mdui-navigation-rail-item slot="bottom" icon="logout" id="logoutBtn" value="logout">登出</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="manage_accounts" value="admin" id="adminBtn">管理</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <form>
    <mdui-text-field clearable label="搜索" type="search" icon="search" id="search" full-width></mdui-text-field>
  </form>

  <mdui-container class="mdui-m-t-2">
    <mdui-table-fluid>
      <table class="mdui-table mdui-table-striped">
        <thead>
        <tr>
          <th>名称</th>
          <th>推流地址</th>
          <th>推流密钥</th>
          <th>素材名称</th>
          <th>用户邮箱</th>
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
      id = "clientDialog"
      close-on-overlay-click
      headline="接管列表"
      class="example-action">
    <div id="clientDiv"></div>
    <mdui-button slot="action" variant="tonal" id="clientDialogCloseBtn">关闭</mdui-button>
  </mdui-dialog>

  <mdui-dialog
      id = "changeDialog"
      close-on-overlay-click
      headline="更新推流"
      class="example-action">
    <mdui-text-field style="margin-bottom: 16px" label="名称" id="streamName"></mdui-text-field>
    <mdui-text-field style="margin-bottom: 16px" label="推流地址" id="streamUrl"></mdui-text-field>
    <mdui-text-field style="margin-bottom: 16px" label="推流密钥" id="streamKey"></mdui-text-field>
    <mdui-text-field style="margin-bottom: 16px" type="date" label="到期时间" id="expiredTime"></mdui-text-field>
    <mdui-select label="素材类型" id="selectMenu">
      <mdui-menu-item value="HD_VIDEO">高清视频</mdui-menu-item>
      <mdui-menu-item value="VIDEO">视频</mdui-menu-item>
      <mdui-menu-item value="PIC">图片</mdui-menu-item>
    </mdui-select>
    <mdui-button slot="action" variant="text" id="changeCancelBtn">取消</mdui-button>
    <mdui-button slot="action" variant="tonal" id="changeConfirmBtn">确定</mdui-button>
  </mdui-dialog>

  <mdui-dialog fullscreen class="example-fullscreen" id="logDialog">
    运行日志<div id="logDiv"></div><br>
    <mdui-button id="logDialogCloseBtn">关闭</mdui-button>
  </mdui-dialog>
</template>

<script>
import init from '../js/admin';
export default {
  mounted() {
    init();
  }
}
</script>

<style>
</style>