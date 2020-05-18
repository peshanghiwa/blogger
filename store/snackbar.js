export const state = () => ({
  show: false,
  text: "",
  timeout: 0,
  multiline: false,
  color: "green"
});

export const mutations = {
  showSnackbar(state, data) {
    state.show = data.show;
    state.text = data.text;
    state.timeout = data.timeout;
    state.multiline = data.multiline;
    state.color = data.color;
  },
  hideSnackbar(state) {
    state.show = false;
  }
};

export const actions = {
  showSnackbar({ commit, state }, data) {
    commit("showSnackbar", data);
  }
};
