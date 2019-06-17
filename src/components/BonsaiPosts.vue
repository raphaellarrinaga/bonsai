<template>
  <div class="wrapper">
    <!-- Check blog posts exist -->
    <div v-if="posts.length !== 0" class="blog-main" id="bonsais">
      <div class="filters">
        <div class="filter">
          <h3 class="filter__title">Indoor</h3>
          <label><input type="radio" v-model="selectedCategory" value="All" /> All</label>
          <label><input type="radio" v-model="selectedCategory" value="Yes" /> Yes</label>
          <label><input type="radio" v-model="selectedCategory" value="No" /> No</label>
        </div>
      </div>
      <ul class="bonsai-list">
        <li v-for="post in filteredPosts" :key="post.data.uid" class="bonsai-list__item">
          <div class="bonsai">
            <h1 class="bonsai__title">
              {{ $prismic.richTextAsPlain(post.data.title) }}
            </h1>
            <div class="bonsai__metas">
               {{ post.data.style }} <span v-if="post.data.indoor === 'Yes'">— Indoor</span>
            </div>
          </div>
        </li>
      </ul>
      <!-- Template for blog posts -->
      <!-- <div v-for="post in posts" :key="post.id" v-bind:post="post" class="blog-post">
        <h1 class="title">
          {{ $prismic.richTextAsPlain(post.data.title) }}
        </h1>
        <div>
          {{ post.data.indoor }} — {{ post.data.style }}
        </div>
      </div> -->
    </div>
    <!-- If no blog posts return message -->
    <div v-else class="blog-main">
      <p>No Posts published at this time.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bonsai-posts',
  data () {
    return {
      posts: [],
      dateOptions: { year: 'numeric', month: 'short', day: '2-digit' },
      selectedCategory: "All",
    }
  },
  methods: {
    getPosts () {
      //Query to get blog posts
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'bonsai'),
        { orderings : '[my.bonsai.date desc]' }
      ).then((response) => {
        this.posts = response.results;
      })
    },
  },
  computed: {
    filteredPosts: function() {
      // @see https://codepen.io/blakewatson/pen/xEXApK.
      var vm = this;
      var category = vm.selectedCategory;

      if (category === "All") {
        return vm.posts;
      } else {
        return vm.posts.filter(function(person) {
          return person.data.indoor === category;
        });
      }
    }
  },
  created () {
    this.getPosts()
  }
}
</script>

<style scoped>
.filter {
  display: flex;
  margin-bottom: 2em;
}
.filter label {
  margin-right: 1em;
}
.filter__title {
  font-weight: bold;
  margin-right: 1em;
}
.bonsai-list {
  list-style: none;
}
.bonsai-list__item + .bonsai-list__item {
  margin-top: 1.5em;
}
.bonsai__title {
  font-weight: bold;
  font-size: 1.3em;
  margin-bottom: .5em;
}
</style>
