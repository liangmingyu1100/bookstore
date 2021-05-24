import { getCartList } from 'network/cart.js'
export default {
  setIsLogin({ commit }, payload) {
    commit('setIsLoginState', payload);
  },
  updateCart({ commit }) {
    getCartList().then((res) => {
      commit('setCartCount', { count: res.data.length | 0 });
    });
  }
}