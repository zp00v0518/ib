<template>
  <div id="nav">
    <router-link class="nav-item" to="/">Home</router-link>
    <router-link  class="nav-item" to="/history_table">History</router-link>
  </div>
  <router-view/>
</template>

<style lang="scss">
#nav {
  display: flex;
  justify-content: center;
  padding: 12px;
  font-size: 18px;
}
 .nav-item{
   margin: 0 10px;
 }
</style>
