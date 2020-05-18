<template>
  <v-container>
    <profile :loggedProfile="true" :user="$auth.$state.user"></profile>
    <posts
      :loggedProfile="true"
      :user="$auth.$state.user"
      :posts="posts"
      @postUpdated="updatePost"
      @postDeleted="deletePost"
    ></posts>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  async asyncData({ $axios, $auth, params, error, req, redirect }) {
    if (!$auth.$state.loggedIn) redirect(`/login`);
    try {
      const postRes = await $axios.$get(
        `/api/post/getuserposts/${$auth.$state.user._id}`
      );
      return {
        posts: postRes.posts
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message
      });
    }
  },
  methods: {
    deletePost(postId) {
      this.posts = this.posts.filter(post => post._id != postId);
      this.$store.dispatch("snackbar/showSnackbar", {
        show: true,
        text: "Post Deleted Successfully!",
        timeout: 4000,
        color: "error",
        multiline: false
      });
    },
    updatePost(updatedPost) {
      this.posts.forEach((post, i) => {
        if (post._id == updatedPost.id) {
          this.posts[i].title = updatedPost.title;
          this.posts[i].content = updatedPost.content;
        }
      });

      this.$store.dispatch("snackbar/showSnackbar", {
        show: true,
        text: "Post Updated Successfully!",
        timeout: 4000,
        color: "info",
        multiline: false
      });
    }
  }
};
</script>

<style>
</style>