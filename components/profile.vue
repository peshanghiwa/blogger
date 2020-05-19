<template>
  <v-row>
    <v-col cols="12" offset="0" xs="12" sm="8" offset-sm="2" md="8" offset-md="2">
      <v-card class="mx-auto" max-width="600">
        <v-img
          class="white--text align-end"
          height="200px"
          :src="require(`~/assets/images/users/${user.photo}`)"
        ></v-img>
        <v-card-text class="caption lighten-5 py-0 mt-5">Full Name</v-card-text>
        <v-card-title class="mb-5 py-0 float-left">{{user.fullName}}</v-card-title>
        <v-card-actions class="float-right">
          <v-btn v-if="loggedProfile" @click.stop="dialog = true" icon large color="#05386B">
            <v-icon>add_circle</v-icon>
          </v-btn>
          <v-dialog v-model="dialog" max-width="700">
            <v-card class="pa-6">
              <v-card-title class="headline">New Post</v-card-title>
              <v-divider></v-divider>
              <v-form ref="form">
                <v-text-field :rules="formRules" v-model="newPostData.title" label="Title" required></v-text-field>
                <v-textarea
                  :rules="formRules"
                  v-model="newPostData.content"
                  label="Content"
                  required
                ></v-textarea>
                <v-file-input
                  @change="onFileChange"
                  accept="image/*"
                  show-size
                  label="Upload Image"
                  required
                ></v-file-input>
              </v-form>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" text @click="dialog = false">Cancel</v-btn>
                <v-btn
                  color="info"
                  :loading="loading"
                  :disabled="loading"
                  depressed
                  @click="addPost"
                >Submit Post</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
        <v-expansion-panels v-model="expand" depressed>
          <v-expansion-panel focusable>
            <v-expansion-panel-header>More Info...</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card-text class="caption lighten-5 py-0">Username</v-card-text>
              <v-card-title class="mb-5 py-0">{{user.username}}</v-card-title>
              <v-card-text class="caption lighten-5 py-0">Gender</v-card-text>
              <v-card-title class="mb-5 py-0">{{user.gender}}</v-card-title>
              <v-card-text class="caption lighten-5 py-0">Birthdate</v-card-text>
              <v-card-title class="mb-5 py-0">{{user.birthdate.split("T")[0]}}</v-card-title>
              <v-card-text class="caption lighten-5 py-0">Joined Blogger On</v-card-text>
              <v-card-title class="mb-5 py-0">{{user.createdAt.split("T")[0]}}</v-card-title>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { minCharacters, notEmpty } from "../plugins/validation";
export default {
  data() {
    return {
      expand: false,
      dialog: false,
      newPostData: {
        title: "",
        content: "",
        photo: ""
      },
      formRules: [v => notEmpty(v, 3), v => minCharacters(v, 3)],
      loading: false
    };
  },
  props: ["user", "loggedProfile"],
  methods: {
    async addPost(event) {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          const form = new FormData();
          form.append("title", this.newPostData.title);
          form.append("content", this.newPostData.content);
          form.append("photo", this.newPostData.photo);
          const response = await this.$axios.$post("/api/post/addpost", form);
          this.$store.dispatch("snackbar/showSnackbar", {
            show: true,
            text: "New Post Created Successfully!",
            timeout: 4000,
            color: "success",
            multiline: false
          });
          this.loading = false;
          this.dialog = false;
        } catch (err) {
          console.log(err.response.data);
          this.$store.dispatch("snackbar/showSnackbar", {
            show: true,
            text: err.response.data.message,
            timeout: 10000,
            color: "error",
            multiline: false
          });
        }
      }
    },
    onFileChange(event) {
      this.newPostData.photo = event;
    }
  }
};
</script>

<style scoped>
.clicked-true {
  color: #05386b !important;
}
.clicked-false {
  color: #707070 !important;
}
</style>