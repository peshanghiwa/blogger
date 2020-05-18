<template>
  <v-dialog :retain-focus="false" v-model="updateDialog[post._id]" max-width="400">
    <v-card class="pa-6">
      <v-card-title class="headline">{{dialogTitle}}</v-card-title>
      <v-divider></v-divider>
      <v-form ref="form">
        <v-text-field
          @input="checkChange=false"
          :rules="formRules"
          v-model="updatedData.title"
          label="Title"
          required
        ></v-text-field>
        <v-textarea
          @input="checkChange=false"
          :rules="formRules"
          v-model="updatedData.content"
          label="Content"
          required
        ></v-textarea>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" text @click.stop="$set(updateDialog, post._id, false)">{{cancelButton}}</v-btn>
        <v-btn
          color="error"
          :disabled="checkChange"
          depressed
          @click="updatePost(post)"
        >{{submitButton}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { minCharacters, notEmpty } from "../../../plugins/validation";
export default {
  data() {
    return {
      updatedData: {
        title: this.post.title,
        content: this.post.content
      },
      formRules: [v => notEmpty(v, 3), v => minCharacters(v, 3)],
      checkChange: true
    };
  },
  props: [
    "updateDialog",
    "post",
    "dialogTitle",
    "dialogBody",
    "cancelButton",
    "submitButton"
  ],
  methods: {
    updatePost(post) {
      try {
        if (this.$refs.form.validate()) {
          this.$axios.$patch(
            `/api/post/updatepost/${post._id}`,
            this.updatedData
          );
          const newUpdatedPost = {
            id: post._id,
            title: this.updatedData.title,
            content: this.updatedData.content
          };
          this.$emit("postUpdated", newUpdatedPost);
          this.$set(this.updateDialog, post._id, false);
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