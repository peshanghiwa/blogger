<template>
  <div class="container" style="display: flex; align-items:center">
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
        <h2 class="mb-6" autocomplete="off">Log in</h2>
        <v-form ref="form">
          <v-text-field
            label="E-Mail"
            v-model="email"
            :rules="emailRules"
            prepend-icon="email"
            required
          ></v-text-field>
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
          <span class="float-right subtitle-2">
            <nuxt-link
              tag="span"
              style="color:#05386B !important"
              class="cCursor hover font-weight-bold"
              to="/recoverpassword"
            >Forgotten Your password?</nuxt-link>
          </span>
          <v-btn
            @click.prevent="submit"
            class="white--text"
            :disabled="loginBtnLoading"
            :loading="loginBtnLoading"
            depressed
            color="#05386B"
          >Log in</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  minCharacters,
  maxCharacters,
  isEmail,
  notEmpty
} from "../plugins/validation";
export default {
  data() {
    return {
      email: "",
      emailRules: [v => notEmpty(v, 3), v => isEmail(v, 3)],
      password: "",
      passwordRules: [v => notEmpty(v, 3), v => minCharacters(v, 6)],
      showPassword: false
    };
  },
  props: ["loginBtnLoading"],
  methods: {
    async submit() {
      if (this.$refs.form.validate())
        this.$emit("submit", { email: this.email, password: this.password });
    }
  }
};
</script>