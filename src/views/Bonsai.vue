<template>
  <div class="wrapper">
    <prismic-edit-button :documentId="documentId"/>
    <h1 class="title">
      {{ $prismic.richTextAsPlain(fields.title) }}
    </h1>
      <hr>
      {{ fields.indoor }}
      <hr>
    <div>
      <!-- {{ $prismic.richTextAsPlain(fields.style) }} -->
      <!-- {{ $prismic.richTextAsPlain(fields.indoor) }} -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bonsai',
  data () {
    return {
      documentId: '',
      fields: {
        title: null,
        style: null,
        indoor: null
      }
    }
  },
  methods: {
    getContent (uid) {
      this.$prismic.client.getByUID('bonsai', uid)
        .then((document) => {
          if (document) {
            this.documentId = document.id
            this.fields.title = document.data.title
            this.fields.style = document.data.style
            this.fields.indoor = document.data.indoor
          } else {
            this.$router.push({ name: 'not-found' })
          }
        })
    }
  },
  created () {
    this.getContent(this.$route.params.uid)
  },
  beforeRouteUpdate (to, from, next) {
    this.getContent(to.params.uid)
    next()
  }
}
</script>

<style>
.wrapper {
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  padding: 40px 10px;
  font-family: Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.title {
  font-size: 32px;
}

.description {
  margin-top: 40px;
}

.description h2 {
  font-size: 24px;
}

.description h2:not(:first-child) {
  margin-top: 20px;
}

.description p {
  line-height: 1.5;
}

.description p:not(:first-child) {
  margin-top: 10px;
}

.description a {
  color: #404e9f;
}

.description a:hover {
  text-decoration: underline;
}

.cta-wrapper {
  margin-top: 40px;
}

.cta {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  background-color: #404e9f;
  color: white;
}

.icon-wrapper {
  margin-top: 40px;
}

.icon {
  max-width: 100%;
}
</style>
