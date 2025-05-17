<template>
   <mdui-top-app-bar scroll-behavior="elevate">
      <mdui-top-app-bar-title style="font-size: 16px;margin-left: 90px">MineLive > 素材列表</mdui-top-app-bar-title>
   </mdui-top-app-bar>
   <mdui-navigation-rail divider padding-left id="rail" value="material">
      <img src="/src/img/logo.png" alt="alternative" style="width: 2.8rem; height: 2.8rem;margin-bottom: 16px;">
      <mdui-navigation-rail-item icon="videocam" id="streamBtn" value="stream">推流</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="topic" id="materialBtn" value="material">素材</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="help_center" href="https://www.yuque.com/seeds-ejjgd/py7vim" target="_blank" id="groupBtn" value="help">教程</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="group" href="https://qm.qq.com/q/hpYH0xIsuY" target="_blank" id="groupBtn" value="group">加群</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="local_fire_department" href="https://www.beishaoidc.cn/aff/TKYYFUGE" target="_blank" id="adv" value="adv">北少云</mdui-navigation-rail-item>
      <mdui-navigation-rail-item slot="bottom" icon="logout" id="logoutBtn" value="logout">登出</mdui-navigation-rail-item>
   </mdui-navigation-rail>

   <mdui-card style="display: flex; align-items: center; padding: 12px; margin-right: 16px; margin-left: 16px; background-color: rgba(var(--mdui-color-on-secondary-light, 0.8))">
      <p style="margin-left: 12px;margin-right: 16px;font-size: 18px;" id="countText"></p>
      <div style="flex-grow: 1"></div>
      <mdui-button variant="outlined" style="margin-right: 8px;" id="refreshMaterialBtn">刷新列表</mdui-button>
      <input type="file" id="fileInput" style="display: none;">
      <mdui-button variant="filled" id="uploadBtn">上传素材</mdui-button>
   </mdui-card>
   <mdui-container id="materialCardList" style="display: flex; flex-wrap: wrap; gap: 8px; margin-right: 16px; margin-left: 16px; margin-bottom: 8px; margin-top: 8px"></mdui-container>

   <mdui-segmented-button-group full-width style="margin-right: 16px; margin-left: 16px;">
      <mdui-segmented-button icon="arrow_backward" id="lastPageBtn"></mdui-segmented-button>
      <mdui-segmented-button id="pageText">第1页，共1页</mdui-segmented-button>
      <mdui-segmented-button end-icon="arrow_forward" id="nextPageBtn"></mdui-segmented-button>
   </mdui-segmented-button-group>
   <mdui-dialog
      id = "uploadProgressDialog"
      headline="正在上传，请稍后..."
      class="example-action">
      <mdui-linear-progress value="0" max="100" id="uploadProgress"></mdui-linear-progress>
   </mdui-dialog>
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
      <p>文件大小 < 120M<br>支持格式 .mp4 .png .jpg<br>1080p及以上视频分辨率</p>
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
<style></style>