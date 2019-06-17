<template>
  <div class="wrapper">
    <h1>Bonsai list</h1>
    {{ items }}
    <ol>
      <li v-for="item in items">
        {{ item }}
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      items: null,
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'bonsai'),
        { orderings : '[my.bonsai.date desc]' }
      )
        .then((response) => {
          if (response) {
            this.items = response.results
          } else {
            this.$router.push({ name: 'not-found' })
          }
        })
    }
  },
  // created () {
  //   this.getContent(this.$route.params.uid)
  // },
  // beforeRouteUpdate (to, from, next) {
  //   this.getContent(to.params.uid)
  //   next()
  // }
}
</script>

<style>
</style>
