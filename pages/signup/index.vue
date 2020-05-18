<template>
  <div class="container">
    <signup @form-data="submit"></signup>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  auth: "guest",
  methods: {
    async submit(data) {
      try {
        const response = await this.$axios.$post("/api/auth/signup", data.form);
        if (response.status == "success") {
          this.$auth.loginWith("local", {
            data: {
              email: data.userData.email,
              password: data.userData.password
            }
          });
          this.$router.push("/login");
        }
      } catch (err) {
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
* {
  font-family: "Poppins";
}
</style>
