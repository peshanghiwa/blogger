<template>
  <div class="container">
    <login @submit="submit($event)" :loginBtnLoading="loginBtnLoading"></login>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  auth: "guest",
  data() {
    return {
      loginBtnLoading: false
    };
  },
  methods: {
    async submit(userData) {
      this.loginBtnLoading = true;
      try {
        const response = await this.$auth.loginWith("local", {
          data: {
            email: userData.email,
            password: userData.password
          }
        });
        this.loginBtnLoading = false;
      } catch (err) {
        console.log(err.response.data);
        this.loginBtnLoading = false;
        this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: err.response.data.message,
          timeout: 9000,
          color: "error",
          multiline: false
        });
      }
    }
  }
};
</script>


<style scoped>
* {
  font-family: "Poppins";
}
</style>