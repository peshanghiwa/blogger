<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col xs="12" sm="10" offset-sm="1" md="6" offset-md="3">
          <h1 class="statuscode">{{error.statusCode}}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="error.statusCode === 404" xs="12" sm="10" offset-sm="1" md="6" offset-md="3">
          <h1>{{ error.message }}.</h1>
        </v-col>
        <v-col v-else xs="12" sm="10" offset-sm="1" md="6" offset-md="3">
          <h1>{{ error.message }}.</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" sm="10" offset-sm="1" md="6" offset-md="3">
          <v-btn nuxt to="/" color="#05386B" class="white--text">Home page</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred"
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  }
};
</script>

<style scoped>
* {
  text-align: center;
}
h1 {
  font-size: 20px;
  padding: 0 !important;
}
.statuscode {
  font-size: 100px;
  padding: 0 !important;
}
</style>
