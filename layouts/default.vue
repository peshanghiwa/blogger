<template>
  <v-app>
    <nav-header></nav-header>
    <snack-bar></snack-bar>
    <!-- Game My Nuxt Container 60px margin on top because of the height of the navbar -->
    <nuxt />
    <nav-footer v-if="$route.path != `/login`"></nav-footer>
  </v-app>
</template>

<script>
export default {};
</script>

<style>
.nuxtTag {
  margin-top: 60px;
}
</style>
