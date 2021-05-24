import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
const Home = () => import('views/home/Home');
const Category = () => import('views/category/Category');
const Detail = () => import('views/detail/Detail');
const Cart = () => import('views/cart/Cart');
const Profile = () => import('views/profile/Profile');
const Register = () => import('views/profile/Register');
const Login = () => import('views/profile/Login');
const AddressList = () => import('views/profile/AddressList')
const AddressEdit = () => import('views/profile/AddressEdit')
const OrderPreview = () => import('views/order/OrderPreview')
const OrderList = () => import('views/order/OrderList')
const OrderDetail = () =>import('views/order/OrderDetail')

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: "图书之城",
      isAuthRequired: false
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta: {
      title: "图书之城-商品分类",
      isAuthRequired: false

    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: {
      title: "图书之城-商品详情",
      isAuthRequired: false
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      title: "图书之城-购物车",
      isAuthRequired: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: "图书之城-个人中心",
      isAuthRequired: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: "图书之城-注册中心",
      isAuthRequired: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: "图书之城-用户登录",
      isAuthRequired: false
    }
  },
  {
    path: '/address/list',
    name: 'AddressList',
    component: AddressList,
    meta: {
      title: "图书之城-地址管理",
      isAuthRequired: true
    },
  },
  {
    path: '/address/edit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: {
      title: "图书之城-地址编辑",
      isAuthRequired: true
    },
  },
  {
    path: '/order/preview',
    name: 'OrderPreview',
    component: OrderPreview,
    meta: {
      title: "图书之城-订单预览",
      isAuthRequired: true
    },
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: OrderList,
    meta: {
      title: "图书之城-订单列表",
      isAuthRequired: true
    },
  },
  {
    path: '/order/detail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: "图书之城-订单详情",
      isAuthRequired: true
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {

  // 需要登录访问权限 对用户的登录状态进行判断 如果没有登录 跳转到登录页面
  if (to.meta.isAuthRequired && !store.state.user.isLogin) {
    // 跳转到登录页面
    next('/login');
  } else {
    // 根据元数据改变页面的标题
    document.title = to.meta.title;
    // 放行
    next();
  }

})

export default router
