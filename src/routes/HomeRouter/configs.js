import React from 'react';
import LoadingComponent from 'Components/ComponentLoading';
import Loadable from 'react-loadable';


// 首页
const HomePage = Loadable({
  loader: () => import('layouts/HomeLayout/HomePage'),
  loading: LoadingComponent
});
// 基础管理
const BasicManage = Loadable({
  loader: () => import('../BasicRouter'),
  loading: LoadingComponent
});

export {
  HomePage,
  BasicManage, 
};