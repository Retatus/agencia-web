import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setUser(data) {
      this.user = data.user;
      this.token = data.token;
    },

    logout() {
      this.user = null;
      this.token = null;
    }
  }
});
