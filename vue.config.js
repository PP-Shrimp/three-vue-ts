// const ThreeExamples = require('import-three-examples')
module.exports = {
    devServer: {
        port: 3333,
        open: true,
        overlay: {
            warning: false,
            errors: true
        },
        progress: false,
        // proxy: {}
    },
    //配置插件
    pluginOptions: {
    },
    // 高级配置
    // chainWebpack: config => {
    //     config.module
    //         .rule('obj')
    //         .test(/\.(fbx|obj)$/)
    //         .use('file-loader')
    //         .loader('file-loader')

    //         ThreeExamples.forEach((v) => {
    //             if (~v.use.indexOf('imports')) {
    //                 config.module
    //                     .rule(`${v.test}_i`)
    //                     .test(require.resolve(v.test))
    //                     .use(v.use)
    //                     .loader(v.use)
    //             } else {
    //                 config.module
    //                     .rule(`${v.test}_e`)
    //                     .test(require.resolve(v.test))
    //                     .use(v.use)
    //                     .loader(v.use)
    //             }
    //         })
    // }
};
