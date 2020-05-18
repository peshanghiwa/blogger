<template>
  <v-dialog :retain-focus="false" v-model="deleteDialog[post._id]" max-width="290">
    <v-card>
      <v-card-title class="headline">{{dialogTitle}}</v-card-title>
      <v-card-text>{{dialogBody}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" text @click.stop="$set(deleteDialog, post._id, false)">{{cancelButton}}</v-btn>
        <v-btn color="error" depressed @click="deletePost(post)">{{submitButton}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: [
    "deleteDialog",
    "post",
    "dialogTitle",
    "dialogBody",
    "cancelButton",
    "submitButton"
  ],
  methods: {
    deletePost(post) {
      try {
        this.$axios.$delete(`/api/post/deletepost/${post._id}`);
        this.$emit("postDeleted", post._id);
        this.$set(this.deleteDialog, post._id, false);
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