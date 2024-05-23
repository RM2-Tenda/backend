
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
            state.authToken = '';  // Clear the authentication token
        }
    },
    actions: {
        updateAuthToken({ commit }, token) {
            commit('setAuthToken', token);
        }
    }
});
