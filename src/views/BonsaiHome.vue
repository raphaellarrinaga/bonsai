<template>
  <div class="page">
    <header class="page-header">
      <h1 class="page-title"><a href="/">Bonsaï</a></h1>
    </header>
    <div class="page-main">
      <bonsai-posts/>
    </div>
  </div>
</template>

<script>
import BonsaiPosts from '../components/BonsaiPosts.vue'

export default {
  name: 'bonsai-home',
  components: {
    BonsaiPosts
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono:400,700&display=swap');
.page {
  font-family: 'Roboto Mono', monospace;
  padding: 3em 1em 5em;
}
@media screen and (min-width: 420px) {
  .page {
    padding: 3em 4em 5em;
  }
}
.page-main {
  margin: 4em auto 2em;
  max-width: 820px;
}
</style>
