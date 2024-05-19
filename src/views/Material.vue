<template>
  <div>
    <mdui-top-app-bar scroll-behavior="elevate" style="background-color: rgba(var(--mdui-color-primary-container, 0.8))">
      <div style="margin-left: 80px"></div>
      <img src="https://s21.ax1x.com/2024/04/07/pFq2AoR.png" alt="alternative" style="width: 2.5rem; height: 2.5rem;">
      <mdui-top-app-bar-title>素材列表</mdui-top-app-bar-title>
      <mdui-tooltip content="上传素材">
        <mdui-button-icon variant="filled" icon="arrow_upward" id="uploadBtn" title="上传素材"></mdui-button-icon>
      </mdui-tooltip>
      <input type="file" id="fileInput" style="display: none;">
      <div style="margin-left: 1px"></div>
      <mdui-tooltip content="刷新列表">
        <mdui-button-icon variant="filled" icon="refresh" id="refreshBtn"></mdui-button-icon>
      </mdui-tooltip>
    </mdui-top-app-bar>

    <mdui-navigation-rail divider padding-left id="rail" value="material">
      <mdui-navigation-rail-item icon="videocam" id="streamBtn" value="stream">推流</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="topic" id="materialBtn" value="material">素材</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="help_center" href="https://www.yuque.com/seeds-ejjgd/py7vim" target="_blank" id="groupBtn" value="help">教程</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="group" href="https://qm.qq.com/q/hpYH0xIsuY" target="_blank" id="groupBtn" value="group">加群</mdui-navigation-rail-item>
      <mdui-navigation-rail-item variant="tonal" icon="local_fire_department" href="https://www.anxidc.com" target="_blank" value="ad">失忆云</mdui-navigation-rail-item>
      <mdui-navigation-rail-item slot="bottom" icon="logout" id="logoutBtn" value="logout">登出</mdui-navigation-rail-item>
    </mdui-navigation-rail>

    <mdui-container class="mdui-m-t-2">
      <mdui-table-fluid>
        <table class="mdui-table mdui-table-striped">
          <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>上传时间</th>
            <th>大小</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody id="material-list-tbody">
          </tbody>
        </table>
      </mdui-table-fluid>
    </mdui-container>
  </div>

  <div style="display: flex; align-items: center;">
    <div style="flex-grow: 1"></div>
    <mdui-segmented-button-group full-width>
      <mdui-segmented-button icon="arrow_backward" id="lastPageBtn"></mdui-segmented-button>
      <mdui-segmented-button id="pageText">第1页，共1页</mdui-segmented-button>
      <mdui-segmented-button end-icon="arrow_forward" id="nextPageBtn"></mdui-segmented-button>
    </mdui-segmented-button-group>
    <div style="flex-grow: 1"></div>
  </div>

  <mdui-dialog
      id = "deleteDialog"
      close-on-overlay-click
      headline="确认删除素材?"
      class="example-action">
    <mdui-button slot="action" variant="text" id="dialogCancelBtn">取消</mdui-button>
    <mdui-button slot="action" variant="tonal" id="dialogConfirmBtn">删除</mdui-button>
  </mdui-dialog>

  <mdui-dialog
      id = "uploadDialog"
      close-on-overlay-click
      stacked-actions
      headline="素材规范"
      class="example-action">
    <p>文件大小 < 100M<br>支持格式 .mp4 .png .jpg<br>推荐720p及以上视频分辨率</p>
    <mdui-button slot="action" variant="tonal" id="uploadDialogConfirmBtn">选择文件</mdui-button>
    <mdui-button slot="action" variant="text" id="uploadDialogHelpBtn" target="_blank" href="https://www.yuque.com/seeds-ejjgd/py7vim/qvvp0a5q4xfqhdld">教程</mdui-button>
    <mdui-button slot="action" variant="text" id="uploadDialogCancelBtn">取消</mdui-button>
  </mdui-dialog>
</template>

<script>
import init from '../js/material';
export default {
  mounted() {
    init();
  }
}
</script>

<style>
</style>