<template>
  <v-container>
    <posts :loadMorePostsBtn="loadMorePostsBtn" :loggedProfile="false" :posts="posts"></posts>
    <div style="display:flex; justify-content:center;">
      <v-btn
        @click="loadMore(10)"
        depressed
        large
        color="#05386B"
        style="margin:0 auto"
        class="white--text my-3"
        v-if="loadMorePostsBtn"
      >Load More</v-btn>
      <v-card-text v-else>{{noPostsText}}</v-card-text>
    </div>
  </v-container>
  <!-- @postUpdated="updatePost"
  @postDeleted="deletePost"-->
</template>

<script>
export default {
  data() {
    return {
      postsLimit: 11,
      postsSkip: 0,
      noPostsText: "There are no posts available :("
    };
  },
  async asyncData({ $axios, isDev, route, store, params, redirect, error }) {
    try {
      const postsResponse = await $axios.$get(
        "/api/post/getposts?sort=-createdAt&limit=11"
      );
      let isTrue = postsResponse.length == 0 ? false : true;
      return {
        posts: postsResponse.posts,
        loadMorePostsBtn: isTrue
      };
    } catch (err) {
      console.log(err);
      error({
        statusCode: err.response.status,
        message: err.response.data.message
      });
    }
  },
  methods: {
    async loadMore(skip) {
      this.noPostsText = "No More Posts to show!";
      this.postsSkip += skip;
      const postsRes = await this.$axios.$get(
        `/api/post/getposts?sort=-createdAt&limit=&limit=${this.postsLimit}&skip=${this.postsSkip}`
      );
      this.posts = this.posts.concat(postsRes.posts);
      this.loadMorePostsBtn = postsRes.requestLimit;
    }
  }
};
</script>