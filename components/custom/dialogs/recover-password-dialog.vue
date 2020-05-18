<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card class="px-8 py-6">
        <v-card-title class="success--text font-weight-bold">Your Code is verified!</v-card-title>
        <v-card-text>You can now Set your new password!</v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            prepend-icon="vpn_key"
            required
          ></v-text-field>
          <v-btn
            @click.prevent="submit"
            :loading="loading"
            :disabled="loading"
            class="white--text"
            depressed
            color="#05386B"
          >Update</v-btn>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  minCharacters,
  maxCharacters,
  isEmail,
  notEmpty
} from "../../../plugins/validation";
export default {
  data() {
    return {
      password: "",
      passwordRules: [v => notEmpty(v, 3), v => minCharacters(v, 6)],
      loading: false,
      showPassword: false
    };
  },
  props: ["dialog", "email"],
  methods: {
    async submit() {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true;
          await this.$axios.$post(
            `/api/user/recovery/recoverpassword/${this.email}`,
            {
              password: `${this.password}`
            }
          );
          this.loading = false;
          this.$emit("recovered");
        }
      } catch (err) {
        this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: err.response.data.message,
          timeout: 9000,
          color: "error",
          multiline: false
        });
        this.loading = false;
      }
    }
  }
};
</script>