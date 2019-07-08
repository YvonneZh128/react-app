## create-react-app + antd 的搭配，换肤设置

本文采用的结构是 `create-react-app + antd` 的主题修改方式。

antd的官网上有介绍如何修改主题，定制主题的配置，但是是在没有做`npm run eject`的基础上。需要请移步：[https://ant.design/docs/react/use-with-create-react-app-cn](https://ant.design/docs/react/use-with-create-react-app-cn) 


然而现在使用基本脚手架开发的我们，据说`create-react-app`这个脚手架是目前最轻量级好用的脚手架了，它本身的配置已经足够满足了我们所有的开发使用。

但是开发同学们依旧会通过`npm run eject`来暴露webpack的配置，给自定义配置留有余地。

有些配置在`eject`前后有那么一点不一样～～～

献上github地址：[点击]()

**可以愉快的添加配置了**   
脚手架的基础配置完成之后，即继 less、babel 配置之后：    

- `/config/webpack.config.js`下设置好less的配置，这里，！一定要配置less:
```
// 大概40行的位置，定义less变量
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

//大概440几行的位置，添加less配置
{
  test: lessRegex,
  exclude: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap
    },
    'less-loader'
  ),
  sideEffects: true
},
{
  test: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent
    },
    'less-loader'
  )
}

```

- 添加好less配置之后，可以添加主题修改配置了：
```

// 大概115行的位置
if (preProcessor) {
  let loader = {
    loader: require.resolve(preProcessor),
    options: {
      sourceMap: isEnvProduction && shouldUseSourceMap,
    },
  }
  if (preProcessor === "less-loader") {
    loader.options.modifyVars = {
      'primary-color' : '#1DA57A',
      // 'btn-primary-bg': '#FF2A8E',
      // 'btn-default-bg': '#6236FF',
      // 'menu-dark-bg':'linear-gradient(#64687D,#3D415A)',
      // 'menu-dark-submenu-bg':'#fff',
    }
    loader.options.javascriptEnabled = true
  }
  loaders.push(loader);
}
```
