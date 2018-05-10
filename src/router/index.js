import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [{
        path: '/',
        component: resolve => require(['../components/page/Index.vue'], resolve),
      },
        {
          path: '/index',
          component: resolve => require(['../components/page/Index.vue'], resolve),
        },
        {
          path: '/main',
          component: resolve => require(['../components/page/Main.vue'], resolve),
        },
        {
          path: '/user',
          component: resolve => require(['../components/page/account/User.vue'], resolve),
        },
        {
          path: '/gymlist',
          component: resolve => require(['../components/page/fitnessRoom/gymList.vue'], resolve),
        },
        {
          path: '/cblist',
          component: resolve => require(['../components/page/fitnessRoom/chainBrand.vue'], resolve),
        },
        {
          path: '/frcoach',
          component: resolve => require(['../components/page/fitnessRoom/Coach.vue'], resolve),
        },
        {
          path: '/feedback',
          component: resolve => require(['../components/page/account/FeedBack.vue'], resolve),
        },
        {
          path: '/uservest',
          component: resolve => require(['../components/page/account/UserVest.vue'], resolve),
        },
        {
          path: '/member',
          component: resolve => require(['../components/page/class/Member.vue'], resolve),
        },
        {
          path: '/provision',
          component: resolve => require(['../components/page/class/Provision.vue'], resolve),
        },
        {
          path: '/ptProvision',
          component: resolve => require(['../components/page/class/PtProvision.vue'], resolve),
        },
        {
          path: '/ptCoach',
          component: resolve => require(['../components/page/class/PtCoach.vue'], resolve),
        },
        {
          path: '/ptEditCoach',
          name: 'ptEditCoach',
          component: resolve => require(['../components/page/class/PtEditCoach.vue'], resolve),
        },
        {
          path: '/groupClassList',
          component: resolve => require(['../components/page/class/GroupClassList.vue'], resolve),
        },
        {
          path: '/members',
          name: 'members',
          component: resolve => require(['../components/page/member/Members.vue'], resolve),
        },
        {
          path: '/cards',
          name: 'cards',
          component: resolve => require(['../components/page/member/Cards.vue'], resolve),
        },
        {
          path: '/types',
          name: 'types',
          component: resolve => require(['../components/page/member/Types.vue'], resolve),
        },
        {
          path: '/power',
          name: 'power',
          component: resolve => require(['../components/page/staff/Power.vue'], resolve),
        },
        {
          path: '/addPower',
          name: 'addPower',
          component: resolve => require(['../components/page/staff/AddPower.vue'], resolve),
        },
        {
          path: '/staffMember',
          name: 'staffMember',
          component: resolve => require(['../components/page/staff/StaffMember.vue'], resolve),
        },
        {
          path: '/myService',
          name: 'myService',
          component: resolve => require(['../components/page/service/MyService.vue'], resolve),
        },
        {
          path: '/message',
          name: 'message',
          component: resolve => require(['../components/page/service/Message.vue'], resolve),
        },
        {
          path: '/wechat',
          name: 'wechat',
          component: resolve => require(['../components/page/service/Wechat.vue'], resolve),
        },
        {
          path: '/signIn',
          name: 'signIn',
          component: resolve => require(['../components/page/reportForms/SignIn.vue'], resolve),
        },
        {
          path: '/memberCard',
          name: 'memberCard',
          component: resolve => require(['../components/page/reportForms/MemberCard.vue'], resolve),
        },
        {
          path: '/memberCardSale',
          name: 'memberCardSale',
          component: resolve => require(['../components/page/reportForms/MemberCardSale.vue'], resolve),
        },
        {
          path: '/course',
          name: 'course',
          component: resolve => require(['../components/page/reportForms/Course.vue'], resolve),
        },
        {
          path: '/signInOut',
          name: 'signInOut',
          component: resolve => require(['../components/page/frontMsg/SignInOut.vue'], resolve),
        },
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },

    {
      path: '/step1',
      component: resolve => require(['../components/page/Step1.vue'], resolve)
    },
    {
      path: '/step2',
      component: resolve => require(['../components/page/Step2.vue'], resolve)
    },
    {
      path: '/step3',
      component: resolve => require(['../components/page/Step3.vue'], resolve)
    },
    {
      path: '/step4',
      component: resolve => require(['../components/page/Step4.vue'], resolve)
    },

    {
      path: '/print',
      component: resolve => require(['../components/page/print.vue'], resolve)
    },

  ]
})
// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
    if (sessionStorage.getItem('user')) {// 判断是否登录
      next({
        path: '/home',
      })
    } else {// 没登录则跳转到登录界面
      next({
        path: '/login',
//query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

export default router
