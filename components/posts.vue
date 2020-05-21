<template>
  <v-col cols="12" offset="0" xs="12" sm="8" offset-sm="2" md="8" offset-md="2">
    <h1 class="display-1 font-weight-light text-center mt-12">Posts</h1>
    <v-divider class="my-5"></v-divider>
    <p v-if="posts.length == 0">This user doesn't have any posts yet!</p>
    <v-flex v-for="(post) in posts" :key="post._id" class="mx-1 my-2">
      <v-card color="grey lighten-4" max-width="600" max-height="500" class="mx-auto pb-2 mb-10">
        <v-list-item>
          <v-list-item-avatar color="grey">
            <v-img v-if="user" :src="user.photo.url"></v-img>
            <v-img v-else :src="post.author.photo.url"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">{{post.title}}</v-list-item-title>
            <v-list-item-subtitle class="pb-1">
              <nuxt-link
                v-if="user"
                class="cCursor hover"
                tag="span"
                :to="`/profile/${user.username}`"
              >
                {{
                user.fullName
                }}
              </nuxt-link>
              <nuxt-link
                v-else
                class="cCursor hover"
                tag="span"
                :to="`/profile/${post.author.username}`"
              >
                {{
                post.author.fullName
                }}
              </nuxt-link>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-img height="194" :src="post.photo.url"></v-img>
        <v-card-text>{{ post.content.slice(0, 90) }}...</v-card-text>
        <v-card-actions>
          <v-btn
            nuxt
            :to="`/posts/${post.postSlug}`"
            depressed
            color="#05386B"
            class="white--text"
          >Read Post</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            large
            icon
            :disabled="lockLike"
            @click.native="toggleLike(post._id, $auth.$state.loggedIn && post.likes.includes($auth.$state.user._id), post, $event)"
          >
            <v-icon
              large
              :class="`clicked-${$auth.$state.loggedIn && post.likes.includes($auth.$state.user._id)}`"
            >mdi-heart</v-icon>
          </v-btn>

          <v-btn
            @click.stop="$set(updateDialog, post._id, true)"
            icon
            color="#f1c40f"
            v-if="loggedProfile"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <edit-post
            :updateDialog="updateDialog"
            :post="post"
            dialogTitle="Update Post"
            cancelButton="Cancel"
            submitButton="Update"
            @postUpdated="updatePost"
          ></edit-post>

          <v-btn
            @click.stop="$set(deleteDialog, post._id, true)"
            icon
            color="#c0392b"
            v-if="loggedProfile"
          >
            <v-icon>delete</v-icon>
          </v-btn>
          <yes-no-dialog
            :deleteDialog="deleteDialog"
            :post="post"
            dialogTitle="Delete Post"
            dialogBody="Are you sure you want to delete this post?"
            cancelButton="Cancel"
            submitButton="Delete"
            @postDeleted="deletePost"
          ></yes-no-dialog>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-col>
</template>

<script>
export default {
  data() {
    return {
      editPost: ["Update Post", "Delete Post"],
      updateDialog: {},
      deleteDialog: {},
      lockLike: false
    };
  },
  props: ["user", "posts", "loggedProfile", "loadMorePostsBtn"],
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
          event.path[0].classList.remove("clicked-false");
          event.path[0].classList.add("clicked-true");
        } else {
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
    },
    updatePost(updatedPost) {
      this.$emit("postUpdated", updatedPost);
    },
    deletePost(id) {
      this.$emit("postDeleted", id);
    }
  }
};
</script>
