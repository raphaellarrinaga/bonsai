<template>
  <div class="wrapper">
    <h1 class="page-title">Bonsaï</h1>
    <bonsai-posts/>
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
.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solir #ccc;
}
</style>
