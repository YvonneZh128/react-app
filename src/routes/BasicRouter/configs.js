import React from 'react';
import LoadingComponent from 'Components/ComponentLoading';
import Loadable from 'react-loadable';


// 页面01
const Page01 = Loadable({
  loader: () => import('layouts/BasicManage/Page01'),
  loading: LoadingComponent
});
// 页面02
const Page02 = Loadable({
  loader: () => import('layouts/BasicManage/Page02'),
  loading: LoadingComponent
});

export {
  Page01,Page02
};