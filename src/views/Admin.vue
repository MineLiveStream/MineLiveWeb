<template>
   <mdui-top-app-bar scroll-behavior="elevate" id="topAppBar">
      <mdui-top-app-bar-title style="font-size: 16px;margin-left: 90px">MineLive > 管理推流</mdui-top-app-bar-title>
   </mdui-top-app-bar>
   <mdui-navigation-rail divider padding-left id="rail" value="admin">
      <img src="/src/img/logo.png" alt="alternative" style="width: 2.8rem; height: 2.8rem;margin-bottom: 16px;">
      <mdui-navigation-rail-item icon="videocam" id="streamBtn" value="stream">推流</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="topic" id="materialBtn" value="material">素材</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="help_center" href="https://www.yuque.com/seeds-ejjgd/py7vim" target="_blank" id="groupBtn" value="help">教程</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="group" href="https://qm.qq.com/q/hpYH0xIsuY" target="_blank" id="groupBtn" value="group">加群</mdui-navigation-rail-item>
      <mdui-navigation-rail-item slot="bottom" icon="logout" id="logoutBtn" value="logout">登出</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="manage_accounts" value="admin" id="adminBtn">管理</mdui-navigation-rail-item>
   </mdui-navigation-rail>
   <mdui-card style="display: flex; flex-wrap: wrap; align-items: center; padding: 12px; margin-right: 16px; margin-left: 16px; background-color: rgba(var(--mdui-color-on-secondary-light, 0.8))">
      <p style="margin-left: 12px;margin-right: 16px;font-size: 18px;" id="countText"></p>
      <form style="flex-grow: 1; max-width: 300px; margin-right: auto; transform: scale(0.8);">
         <mdui-text-field
            clearable
            label="邮箱"
            type="search"
            icon="search"
            id="search"
            variant="outlined"
            style="width: 100%;">
         </mdui-text-field>
      </form>
      <mdui-button variant="outlined" style="margin-right: 8px;" id="refreshAdminBtn">刷新列表</mdui-button>
      <mdui-button variant="filled" id="clientBtn">接管列表</mdui-button>
   </mdui-card>
   <mdui-container id="adminCardList" style="display: flex; flex-wrap: wrap; gap: 8px; margin-right: 16px; margin-left: 16px; margin-bottom: 8px; margin-top: 8px"></mdui-container>

   <mdui-segmented-button-group full-width style="margin-right: 16px; margin-left: 16px;">
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
      <mdui-text-field variant="outlined" style="margin-bottom: 16px" label="名称" id="streamName"></mdui-text-field>
      <mdui-text-field variant="outlined" style="margin-bottom: 16px" label="推流地址" id="streamUrl"></mdui-text-field>
      <mdui-text-field variant="outlined" style="margin-bottom: 16px" label="推流密钥" id="streamKey"></mdui-text-field>
      <mdui-text-field variant="outlined" style="margin-bottom: 16px" type="number" label="到期时间(小时)" id="expiredTime"></mdui-text-field>
      <mdui-select variant="outlined" label="素材类型" id="selectMenu">
         <mdui-menu-item value="HD_VIDEO">高清视频</mdui-menu-item>
         <mdui-menu-item value="VIDEO">视频</mdui-menu-item>
         <mdui-menu-item value="PIC">图片</mdui-menu-item>
      </mdui-select>
      <mdui-button slot="action" variant="text" id="changeCancelBtn">取消</mdui-button>
      <mdui-button slot="action" variant="tonal" id="changeConfirmBtn">确定</mdui-button>
   </mdui-dialog>
   <mdui-dialog fullscreen class="example-fullscreen" id="logDialog">
      运行日志
      <div id="logDiv"></div>
      <br>
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
<style></style>