
import Vuex from 'vuex';



export default new Vuex.Store({
    state: {
        authToken: ''
    },
    mutations: {
        setAuthToken(state, token) {
            state.authToken = token;
        },
        clearAuthToken(state) {
            state.authToken = '';
        }
    },
    actions: {
        updateAuthToken({ commit }, token) {
            commit('setAuthToken', token);
        }
    }
});
