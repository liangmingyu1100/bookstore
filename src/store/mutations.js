import { Toast } from 'vant'
export default {
  setIsLoginState(state, payload) {
    state.user.isLogin = payload;
  },
  setCartCount(state, payload) {
    state.cartCount = payload.count;
    Toast.clear();
  }
}