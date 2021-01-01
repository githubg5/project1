<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import "./assets/css/normalize.css";

html, body, #app {
  height: 100%;
}
#app {
  min-width: 1366px;
}
</style>
