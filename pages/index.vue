<template>
  <div class="container">
    <h1 class="display-1 font-weight-light text-center">Latest Posts</h1>
    <v-divider class="my-5"></v-divider>
    <v-layout wrap justify-space-around class="mb-12">
      <v-flex v-for="(post, index) in posts" :key="index" xs12 sm5 md3 class="mx-1 my-2">
        <v-card color="grey lighten-4" max-width="344" max-height="400" class="mx-auto pb-2">
          <v-list-item>
            <v-list-item-avatar color="grey">
              <v-img :src="post.author.photo.url"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-1">
                {{
                post.title
                }}
              </v-list-item-title>
              <v-list-item-subtitle class="pb-1">
                <nuxt-link
                  class="cCursor hover"
                  tag="span"
                  :to="`/profile/${post.author.username}`"
                >{{post.author.fullName}}</nuxt-link>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-img :src="post.photo.url" height="194"></v-img>
          <v-card-text>{{ post.content.slice(0, 40) }}...</v-card-text>
          <v-card-actions>
            <v-btn
              nuxt
              :to="`/posts/${post.postSlug}`"
              depressed
              color="#05386B"
              class="white--text"
            >Read</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click.native="toggleLike(post._id, $auth.$state.loggedIn && post.likes.includes($auth.$state.user._id), post, $event)"
            >
              <v-icon
                :class="`clicked-${$auth.$state.loggedIn && post.likes.includes($auth.$state.user._id)}`"
              >mdi-heart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <h1 class="display-1 font-weight-light text-center">New Users</h1>
    <v-divider class="my-5"></v-divider>
    <v-card v-for="(user, index) in users" :key="index" flat class="px-5 py-3 my-2">
      <v-layout row wrap>
        <v-flex xs12 sm4 md4>
          <v-list-item-avatar style="float:left;" color="grey">
            <v-img :src="user.photo.url"></v-img>
          </v-list-item-avatar>
          <div class="caption grey--text">Full Name</div>
          <div>{{ user.fullName }}</div>
        </v-flex>
        <v-flex xs4 sm3 md4>
          <div class="caption grey--text">Username</div>
          <div>{{ user.username }}</div>
        </v-flex>
        <v-flex xs4 sm2 md2>
          <div class="caption grey--text">Gender</div>
          <div>{{ user.gender }}</div>
        </v-flex>
        <v-flex xs4 sm3 md2>
          <div class="caption grey--text">Birthdate</div>
          <div>{{ user.birthdate.split("T")[0] }}</div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-card>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, error }) {
    try {
      const postsResponse = $axios.$get(
        "/api/post/getposts?sort=-createdAt&limit=3"
      );
      const usersResponse = $axios.$get(
        "/api/user/getusers?sort=-createdAt&limit=5"
      );
      const response = await Promise.all([postsResponse, usersResponse]);
      return {
        posts: response[0].posts,
        users: response[1].Users
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message
      });
    }
  },
  methods: {
    async toggleLike(postId, likeState, post, event) {
      if (!this.$auth.$state.loggedIn)
        return this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: "You can't perform this action since you aren't logged in!",
          timeout: 10000,
          color: "dark",
          multiline: false
        });
      try {
        if (!likeState) {
          await this.$axios.$post(`/api/like/addlike/${postId}`, {});
          post.likes.push(this.$auth.$state.user._id);
          console.log("like added");
          event.path[0].classList.remove("clicked-false");
          event.path[0].classList.add("clicked-true");
        } else {
          console.log("like removed");
          await this.$axios.$delete(`/api/like/removelike/${postId}`);
          post.likes.splice(post.likes.indexOf(this.$auth.$state.user._id), 1);
          event.path[0].classList.remove("clicked-true");
          event.path[0].classList.add("clicked-false");
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

<style scoped>
.clicked-true {
  color: #05386b !important;
}
.clicked-false {
  color: #707070 !important;
}
</style>

