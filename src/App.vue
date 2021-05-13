<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <!-- <router-link to="/test">Test</router-link> -->
  </div>
  <router-view/>
</template>

<style lang="scss">
#nav {
  display: flex;
  justify-content: center;
  padding: 24px;
  font-size: 18px;
}
</style>
