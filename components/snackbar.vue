<template>
  <v-snackbar
    :timeout="timeout"
    :color="color"
    :multi-line="multiline"
    :top="true"
    v-model="snackbar"
  >
    {{text}}
    <v-btn dark text @click="hideSnackbar">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar.show;
      },
      set: function(newValue) {
        this.$store.commit("snackbar/hideSnackbar");
        return newValue;
      }
    },
    text: {
      get() {
        return this.$store.state.snackbar.text;
      },
      set: function(newValue) {
        return newValue;
      }
    },
    timeout: {
      get() {
        return this.$store.state.snackbar.timeout;
      },
      set: function(newValue) {
        return newValue;
      }
    },
    multiline: {
      get() {
        return this.$store.state.snackbar.multiline;
      },
      set: function(newValue) {
        return newValue;
      }
    },
    color: {
      get() {
        return this.$store.state.snackbar.color;
      },
      set: function(newValue) {
        return newValue;
      }
    }
  },
  methods: {
    hideSnackbar() {
      this.$store.commit("snackbar/hideSnackbar");
    }
  }
};
</script>