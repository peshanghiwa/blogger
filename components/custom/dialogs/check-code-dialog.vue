<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card class="px-8 py-6">
        <v-card-title class="info--text font-weight-bold">Email Sent...</v-card-title>
        <v-card-text>We had send you a 5/6 digits long code to your email address, please copy the code and pase into the field below in 30 minutes!</v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Digit Code"
            v-model="code"
            :rules="codeRules"
            prepend-icon="filter_5"
            class="mb-3"
            required
          ></v-text-field>
          <v-btn color="#05386B" text @click="dialog = false">Cancel</v-btn>
          <v-btn
            @click.prevent="submit"
            :loading="loading"
            :disabled="loading"
            class="white--text"
            depressed
            color="#05386B"
          >Verify Digit</v-btn>
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
      code: "",
      codeRules: [v => notEmpty(v), v => minCharacters(v, 5)],
      loading: false
    };
  },
  props: ["dialog", "email"],
  methods: {
    async submit() {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true;
          await this.$axios.$post(
            `/api/user/recovery/checkdigit/${this.email}`,
            {
              digit: `${this.code}`
            }
          );
          this.loading = false;
          this.$emit("verified");
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