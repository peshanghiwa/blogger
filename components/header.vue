<template>
  <nav>
    <v-app-bar color="#05386B" class="white--text" height="60" flat>
      <v-app-bar-nav-icon color="white" @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title class="text-uppercase text--black mr-8">
        <span>
          <strong>Blogger</strong>
        </span>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down" v-for="(navLink, index) in navLinks" :key="index">
        <v-btn
          color="#05386B"
          @click="route(navLink.link)"
          class="white--text text--accent-4"
          depressed
        >{{ navLink.name }}</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn
        @click="onLogout"
        :loading="logoutBtnLoading"
        :disabled="logoutBtnLoading"
        v-if="$auth.$state.loggedIn"
        depressed
        class="black--text"
        color="white"
        right
      >
        <span>Log out</span>
      </v-btn>
      <v-btn small v-if="!$auth.$state.loggedIn" class="white--text" nuxt to="/login" text right>
        <span>Log in</span>
        <v-icon right>arrow_upward</v-icon>
      </v-btn>
      <v-btn
        small
        v-if="!$auth.$state.loggedIn"
        class="white--text"
        nuxt
        to="/signup"
        outlined
        right
      >
        <span>Sign up</span>
        <v-icon right>contact_mail</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="#05386B" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-if="$auth.$state.loggedIn" class="pa-3" block>
          <img
            :src="require(`~/assets/images/users/${this.$auth.$state.user.photo}`)"
            alt="image"
            height="100"
            class="mb-2"
            style="display:block; margin:0 auto; border-radius:50%;"
          />
          <v-list-item>
            <v-list-item-title class="white--text headline text-center pa-2">
              <nuxt-link tag="span" :to="`/profile`">{{this.$auth.$state.user.fullName}}</nuxt-link>
            </v-list-item-title>
            <!-- <h3 class="white--text headline text-center">{{this.$auth.$state.user.fullName}}</h3> -->
          </v-list-item>
        </v-list-item-group>
        <v-divider color="white" class="my-3"></v-divider>
        <v-list-item-group active-class="white--text ">
          <v-list-item v-for="(navLink, index) in navLinks" :key="index">
            <v-list-item-icon>
              <v-icon color="white">{{ navLink.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title @click="route(navLink.link)" class="white--text">{{ navLink.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      logoutBtnLoading: false,
      drawer: false,
      navLinks: [
        { name: "Home", link: "/", icon: "home" },
        { name: "Blogs", link: "/posts", icon: "mail_outline" }
      ]
    };
  },
  methods: {
    async onLogout() {
      try {
        this.logoutBtnLoading = true;
        await this.$auth.logout();
        this.logoutBtnLoading = false;
        return this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: "Logged out Successfully!",
          timeout: 10000,
          color: "success",
          multiline: false
        });
      } catch (err) {
        console.log(err.response.data);
        this.logoutBtnLoading = false;
        return this.$store.dispatch("snackbar/showSnackbar", {
          show: true,
          text: "Logged out Failed!",
          timeout: 10000,
          color: "error",
          multiline: false
        });
      }
    },
    route(link) {
      this.$router.push(link);
    }
  },
  created() {}
};
</script>

<style>
.activeHover:hover {
  cursor: pointer;
  color: #5cdb95;
  transition: color 0.2s ease;
}
</style>
