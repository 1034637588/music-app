import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  {
    path:'/',
    redirect:'/recommend'
  },
  {
    path:'/recommend',
    component:()=>import('../components/recommend/recommend')
  },{
    path:'/singer',
    component:()=>import('../components/singer/singer')
  },{
    path:'/rank',
    component:()=>import('../components/rank/rank')
  },{
    path:'/search',
    component:()=>import('../components/search/search')
  }
];

const router = new VueRouter({
  routes
});

export default router;
