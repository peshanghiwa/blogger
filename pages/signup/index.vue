<template>
  <div class="container">
    <signup @form-data="submit" :loadingBtn="loadingBtn"></signup>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  auth: "guest",
  data() {
    return {
      loadingBtn: false
    };
  },
  methods: {
    async submit(data) {
      try {
        this.loadingBtn = true;
        const response = await this.$axios.$post("/api/auth/signup", data.form);
        if (response.status == "success") {
          this.$auth.loginWith("local", {
            data: {
              email: data.userData.email,
              password: data.userData.password
            }
          });
          this.loginBtn = false;
          this.$store.dispatch("snackbar/showSnackbar", {
            show: true,
            text: "New Account Created Successfully, You are now logged in.",
            timeout: 9000,
            color: "success",
            multiline: false
          });
        }
      } catch (err) {
        this.loginBtn = false;
        this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: err.response.data.message,
          timeout: 10000,
          color: "error",
          multiline: false
        });
      }
    }
  }
};
</script>


<style scoped>
</style>
