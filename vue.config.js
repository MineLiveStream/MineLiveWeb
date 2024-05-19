const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    publicPath: './',
    outputDir: "dist",
    assetsDir: "static",
    transpileDependencies: true,
    lintOnSave: false,
    chainWebpack: config => {
    config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => ({
          ...options,
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('mdui-')
          }
        }))
  }
});
