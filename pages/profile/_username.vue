<template>
  <v-container>
    <profile :loggedProfile="false" :user="user"></profile>
    <posts :loggedProfile="false" :user="user" :posts="posts"></posts>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  async asyncData({ $axios, params, error }) {
    try {
      const userRes = await $axios.$get(
        `/api/user/getusers/${params.username}`
      );
      const postRes = await $axios.$get(
        `/api/post/getuserposts/${userRes.user._id}`
      );
      return {
        user: userRes.user,
        posts: postRes.posts
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message
      });
    }
  }
};
</script>


<style scoped>
* {
  font-family: "Poppins";
}
</style>