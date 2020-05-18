<template>
  <v-container>
    <v-card class="mx-auto grey lighten-5 pb-2" max-width="700">
      <v-img :src="require(`../../assets/images/posts/${post.photo}`)" cover max-height="400px"></v-img>
      <v-card-title>{{post.title}}</v-card-title>
      <v-card-subtitle>
        <nuxt-link
          class="cCursor hover font-weight-bold"
          tag="span"
          :to="`/profile/${post.author.username}`"
        >
          {{
          post.author.fullName
          }}
        </nuxt-link>
        - {{post.createdAt.split("-").join("/").split("T")[0]}}
      </v-card-subtitle>
      <v-card-text class="subtitle-1 black--text">{{post.content}}</v-card-text>
      <v-card-actions>
        <v-btn @click="toggleLike(post._id, $event)" style="font-size:20px" text color="#272727">
          <span
            :class="`material-icons mr-1 clicked-${$auth.$state.loggedIn && post.likes.includes($auth.$state.user._id)}`"
          >favorite</span>
          <span>Love</span>
        </v-btn>
        <v-btn @click="show = !show" style="font-size:20px" color="#05386b" text>
          <span class="material-icons mr-1">insert_comment</span>
          <span>Comments</span>
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-divider class="mb-1"></v-divider>
      <v-form ref="form" class="px-5">
        <v-text-field
          label="Add Comment"
          v-model="comment"
          :rules="commentRules"
          prepend-icon="insert_comment"
          required
        ></v-text-field>
        <v-btn
          @click.prevent="addComment"
          depressed
          small
          color="#05386B"
          class="white--text my-3"
        >Add Comment</v-btn>
      </v-form>
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-card
            depressed
            flat
            class="mx-2 grey lighten-5"
            v-for="(comment,index) in comments"
            :key="index"
          >
            <v-list-item>
              <v-list-item-avatar style="top:0; position:absolute;" color="grey">
                <v-img :src="require(`../../assets/images/users/${comment.userId.photo}`)"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="title ml-12 mb-0">{{comment.userId.fullName}}</v-list-item-title>
                <v-list-item-title
                  class="caption ml-12 mb-0"
                >{{comment.dateCommented.split("-").join("/").split("T").join(" - ").split(".")[0]}}</v-list-item-title>
                <v-card-text>{{comment.comment}}</v-card-text>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-btn
            @click="loadMore(3)"
            depressed
            small
            color="#05386B"
            class="white--text my-3 ml-6"
            v-if="loadMoreCommentsBtn"
          >Load More</v-btn>
          <v-card-text v-if="!loadMoreCommentsBtn">{{noCommentText}}</v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
import { notEmpty } from "../../plugins/validation";
export default {
  data() {
    return {
      show: false,
      comment: "",
      commentRules: [v => notEmpty(v)],
      commentsLimit: 3,
      commentsSkip: 0,
      noCommentText: "This post doesn't have any comments yet!"
    };
  },
  async asyncData({ $axios, params, error }) {
    try {
      const postRes = await $axios.$get(`/api/post/getpost/${params.slug}`);
      const commentsRes = await $axios.$get(
        `/api/comment/getcommentsspecific?post=${params.slug}&limit=3`
      );
      let isTrue = commentsRes.comments.length == 0 ? false : true;
      return {
        post: postRes.post,
        comments: commentsRes.comments,
        loadMoreCommentsBtn: isTrue
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message
      });
    }
  },
  methods: {
    async addComment() {
      if (!this.$auth.$state.loggedIn)
        return this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: "You can't perform this action since you aren't logged in!",
          timeout: 10000,
          color: "dark",
          multiline: false
        });
      try {
        if (this.$refs.form.validate()) {
          const newComment = await this.$axios.$post(
            `/api/comment/addcomment/${this.$route.params.slug}`,
            { comment: this.comment }
          );
          newComment.newComment.userId = {
            photo: this.$auth.$state.user.photo,
            fullName: this.$auth.$state.user.fullName,
            username: this.$auth.$state.user.username
          };
          this.comments.unshift(newComment.newComment);
          this.$refs.form.reset();
          this.$store.dispatch("snackbar/showSnackbar", {
            show: true,
            text: "Comment Added Successfully!",
            timeout: 3000,
            color: "#05386B",
            multiline: false
          });
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
    async loadMore(skip) {
      this.noCommentText = "No More Comments to show!";
      this.commentsSkip += skip;
      const commentsRes = await this.$axios.$get(
        `/api/comment/getcommentsspecific?post=${this.$route.params.slug}&limit=${this.commentsLimit}&skip=${this.commentsSkip}`
      );
      this.comments = this.comments.concat(commentsRes.comments);
      this.loadMoreCommentsBtn = commentsRes.requestLimit;
    },
    async toggleLike(postId, event) {
      if (!this.$auth.$state.loggedIn)
        return this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: "You can't perform this action since you aren't logged in!",
          timeout: 10000,
          color: "dark",
          multiline: false
        });
      try {
        if (event.path[1].childNodes[0].classList[2] != "clicked-true") {
          await this.$axios.$post(`/api/like/addlike/${postId}`, {});
          event.path[1].childNodes[0].classList.remove("clicked-false");
          event.path[1].childNodes[0].classList.add("clicked-true");
        } else {
          await this.$axios.$delete(`/api/like/removelike/${postId}`);
          event.path[1].childNodes[0].classList.remove("clicked-true");
          event.path[1].childNodes[0].classList.add("clicked-false");
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