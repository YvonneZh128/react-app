// import React from 'react';
import LoadingComponent from '../components/ComponentLoading';
import Loadable from 'react-loadable';

const HomeRouter = Loadable({
  loader: () => import('./HomeRouter'),
  loading: LoadingComponent
});
const LoginPage = Loadable({
  loader: () => import('layouts/LoginPage'),
  loading: LoadingComponent
});

export {
  HomeRouter,
  LoginPage
};