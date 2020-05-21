<template>
  <v-container>
    <v-form ref="form" autocomplete="off">
      <v-row>
        <v-col
          cols="12"
          offset-xs="0"
          sm="10"
          offset-sm="1"
          md="6"
          offset-md="3"
          block
          color="#05386B"
        >
          <v-text-field
            :counter="30"
            :rules="fullNameRules"
            v-model="fullName"
            label="Full Name"
            prepend-icon="assignment"
            required
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          offset-xs="0"
          sm="10"
          offset-sm="1"
          md="6"
          offset-md="3"
          block
          color="#05386B"
        >
          <v-text-field
            :counter="30"
            v-model="username"
            :rules="usernameRules"
            label="Username"
            prepend-icon="account_circle"
            required
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          offset-xs="0"
          sm="10"
          offset-sm="1"
          md="6"
          offset-md="3"
          block
          color="#05386B"
        >
          <v-text-field
            label="E-Mail"
            v-model="email"
            :rules="emailRules"
            prepend-icon="email"
            required
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          offset-xs="0"
          sm="10"
          offset-sm="1"
          md="6"
          offset-md="3"
          block
          color="#05386B"
        >
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
        </v-col>

        <v-col cols="12" offset-xs="0" sm="5" offset-sm="1" md="3" offset-md="3">
          <v-select
            v-model="gender"
            :rules="genderRules"
            prepend-icon="face"
            :items="['Male', 'Female', 'Others']"
            label="Select Gender"
            data-vv-name="select"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" offset-xs="0" sm="5" md="3">
          <v-menu :close-on-content-click="false" max-width="390">
            <template v-slot:activator="{ on }">
              <v-text-field
                slot="activator"
                :value="birthdate"
                :rules="birthdateRules"
                prepend-icon="date_range"
                label="Birthdate"
                v-on="on"
                required
              ></v-text-field>
            </template>
            <v-date-picker v-model="birthdate"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" offset-xs="0" sm="10" offset-sm="1" md="6" offset-md="3">
          <v-file-input
            @change="onFileChange"
            :rules="photoRules"
            accept="image/*"
            show-size
            label="Upload Image"
            required
          ></v-file-input>
        </v-col>
        <v-col offset-sm="1" offset-md="3">
          <v-btn
            :loading="loadingBtn"
            :disabled="loadingBtn"
            @click="submit"
            depressed
            color="#05386B"
            class="mx-0 mt-3 white--text"
          >Submit</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import {
  minCharacters,
  maxCharacters,
  noSpace,
  isEmail,
  notEmpty
} from "../plugins/validation";
export default {
  props: ["loadingBtn"],
  data() {
    return {
      fullName: "",
      fullNameRules: [
        v => notEmpty(v, 3),
        v => minCharacters(v, 3),
        v => maxCharacters(v, 30)
      ],
      username: "",
      usernameRules: [
        v => notEmpty(v, 3),
        v => noSpace(v),
        v => minCharacters(v, 3),
        v => maxCharacters(v, 30)
      ],
      email: "",
      emailRules: [v => notEmpty(v, 3), v => isEmail(v, 3)],
      password: "",
      passwordRules: [v => notEmpty(v, 3), v => minCharacters(v, 6)],
      gender: "",
      genderRules: [v => notEmpty(v)],
      birthdate: "",
      birthdateRules: [v => notEmpty(v)],
      photo: "",
      photoRules: [v => notEmpty(v)],
      showPassword: false
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        if (this.photo == undefined || this.photo == "") {
          return this.$store.dispatch("snackbar/showSnackbar", {
            show: true,
            text: "You Must Upload an Image!",
            timeout: 10000,
            color: "error",
            multiline: false
          });
        }
        const form = new FormData();
        form.append("fullName", this.fullName);
        form.append("username", this.username);
        form.append("email", this.email);
        form.append("password", this.password);
        form.append("gender", this.gender);
        form.append("birthdate", this.birthdate);
        form.append("photo", this.photo);
        this.$emit("form-data", {
          form,
          userData: { email: this.email, password: this.password }
        });
      }
    },
    onFileChange(event) {
      this.photo = event;
    }
  }
};
</script>

<style scoped></style>
