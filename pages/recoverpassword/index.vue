<template>
  <v-container class="my-12">
    <v-row>
      <v-col
        style="background-color:#f5f5f5; border-radius:10px"
        class="pa-6"
        xs="12"
        sm="10"
        offset-sm="1"
        md="6"
        offset-md="3"
      >
        <h1 style="text-align:center" class="mb-3">Reset Your Password</h1>
        <h5
          class="mb-2"
        >- Recover your forgotten password using the email address you had used for logging in!</h5>
        <h5>- We'll send you an email linking it with a 5 digit code so that you can send it back to us in order to verify it's you!</h5>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        style="background-color:#f5f5f5; border-radius:10px"
        class="pa-6"
        xs="12"
        sm="10"
        offset-sm="1"
        md="6"
        offset-md="3"
      >
        <v-form ref="form">
          <v-text-field
            label="E-Mail"
            v-model="email"
            :rules="emailRules"
            prepend-icon="email"
            class="mb-3"
            required
          ></v-text-field>
          <v-btn
            @click.prevent="submit"
            :loading="loading"
            :disabled="loading"
            class="white--text"
            depressed
            color="#05386B"
          >Submit</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <check-code :email="email" :dialog="dialog" @verified="codeVerified"></check-code>
    <recover-password :email="email" :dialog="dialog2" @recovered="recovered"></recover-password>
  </v-container>
</template>

<script>
import {
  minCharacters,
  maxCharacters,
  isEmail,
  notEmpty
} from "../../plugins/validation";
export default {
  middleware: "auth",
  auth: "guest",
  data() {
    return {
      email: "",
      emailRules: [v => notEmpty(v, 3), v => isEmail(v, 3)],
      loading: false,
      dialog: false,
      dialog2: false
    };
  },
  asyncData({ params, query, error }) {},
  methods: {
    async submit() {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true;
          await this.$axios.$post("/api/user/recovery/sendemail", {
            email: this.email
          });
          this.loading = false;
          this.dialog = true;
        }
      } catch (err) {
        console.log(err.response.data);
        this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: err.response.data.message,
          timeout: 9000,
          color: "error",
          multiline: false
        });
        this.loading = false;
      }
    },
    codeVerified() {
      this.dialog = false;
      this.dialog2 = true;
    },
    recovered() {
      this.$store.dispatch("snackbar/showSnackbar", {
        show: true,
        text: "Your password has been updated Successfully",
        timeout: 9000,
        color: "success",
        multiline: false
      });
      this.$router.push("/login");
    }
  }
};
</script>


<style scoped>
</style>