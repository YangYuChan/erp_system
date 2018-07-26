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
      meta: {
        requiresAuth: true
      },
      children: [
        // {
        // path: '/',
        // component: resolve => require(['../components/page/Index.vue'], resolve),
        // },
        {
          path: '/index',
          component: resolve => require(['../components/page/Index.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/main',
          component: resolve => require(['../components/page/Main.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },

        {
          path: '/user',
          component: resolve => require(['../components/page/account/User.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/gymlist',
          component: resolve => require(['../components/page/fitnessRoom/gymList.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/appBuyClass',
          component: resolve => require(['../components/page/fitnessRoom/AppBuyClass.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/cblist',
          component: resolve => require(['../components/page/fitnessRoom/chainBrand.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/frcoach',
          component: resolve => require(['../components/page/fitnessRoom/Coach.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/feedback',
          component: resolve => require(['../components/page/account/FeedBack.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/uservest',
          component: resolve => require(['../components/page/account/UserVest.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/member',
          component: resolve => require(['../components/page/class/Member.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/provision',
          component: resolve => require(['../components/page/class/Provision.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/ptProvision',
          component: resolve => require(['../components/page/class/PtProvision.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/ptCoach',
          component: resolve => require(['../components/page/class/PtCoach.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/ptEditCoach',
          name: 'ptEditCoach',
          component: resolve => require(['../components/page/class/PtEditCoach.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/groupClassList',
          component: resolve => require(['../components/page/class/GroupClassList.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/members',
          name: 'members',
          component: resolve => require(['../components/page/member/Members.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/cards',
          name: 'cards',
          component: resolve => require(['../components/page/member/Cards.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/types',
          name: 'types',
          component: resolve => require(['../components/page/member/Types.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/power',
          name: 'power',
          component: resolve => require(['../components/page/staff/Power.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/addPower',
          name: 'addPower',
          component: resolve => require(['../components/page/staff/AddPower.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/staffMember',
          name: 'staffMember',
          component: resolve => require(['../components/page/staff/StaffMember.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/myService',
          name: 'myService',
          component: resolve => require(['../components/page/service/MyService.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/message',
          name: 'message',
          component: resolve => require(['../components/page/service/Message.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/wechat',
          name: 'wechat',
          component: resolve => require(['../components/page/service/Wechat.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/activity',
          name: 'activity',
          component: resolve => require(['../components/page/service/Activity.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/signIn',
          name: 'signIn',
          component: resolve => require(['../components/page/reportForms/SignIn.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/memberCard',
          name: 'memberCard',
          component: resolve => require(['../components/page/reportForms/MemberCard.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/memberCardSale',
          name: 'memberCardSale',
          component: resolve => require(['../components/page/reportForms/MemberCardSale.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/course',
          name: 'course',
          component: resolve => require(['../components/page/reportForms/Course.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/signInOut',
          name: 'signInOut',
          component: resolve => require(['../components/page/frontMsg/SignInOut.vue'], resolve),
          meta: {
            requiresAuth: true
          }
        },
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve),
    },
    {
      path: '/password',
      component: resolve => require(['../components/page/Password.vue'], resolve)
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
  // if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
  if (sessionStorage.getItem('token')) {// 判断是否登录
    next()
  } else {// 没登录则跳转到登录界面
    if (to.path == '/login') {//如果是登录页面路径，就直接next()
      next();
    } else {//不然就跳转到登录；
      next();
    }
  }
});
export default router
