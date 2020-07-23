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
    component:()=>import('../views/recommend/recommend'),
    children:[
      {
        path:':id',
        component:()=>import('../views/disc/disc')
      }
    ]
  },{
    path:'/singer',
    component:()=>import('../views/singer/singer'),
    children:[
      {
        path:':id',
        component:()=>import('../views/singer-detail/singerDetail')
      }
    ]
  },{
    path:'/rank',
    component:()=>import('../views/rank/rank'),
    children:[
      {
        path:':id',
        component:()=>import('../views/rank-detail/rankDetail')
      }
    ]
  },{
    path:'/search',
    component:()=>import('../views/search/search'),
    children:[
      {
        path:':query',
        component:()=>import('../views/search-detail/searchDetail')
      }
    ]

  }
];

const router = new VueRouter({
  routes
});

export default router;
