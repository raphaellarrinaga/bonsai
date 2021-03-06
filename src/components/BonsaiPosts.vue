<template>
  <div>
    <!-- Check blog posts exist -->
    <div v-if="posts.length !== 0" class="bonsai-list">

      <div class="filters panel-left">
        <h1 class="filter__title">🌴🌳 Find some stuff 🌵🌴</h1>
        <div class="filter">
          <model-select :options="titlesFilter"
          v-model="currentTitlesFilter"
          placeholder="Type a bonsaï name">
          </model-select>
        </div>
      </div>

      <div v-for="item in setStylesFilterResult" :key="item.data.uid" class="panel-right">
        <bonsai-teaser/>

        <div class="bonsai">
          <div class="bonsai__summary">
            <div class="bonsai__content">
              <h1 class="bonsai__title">
                {{ $prismic.richTextAsPlain(item.data.title) }}
              </h1>
              <div class="bonsai__metas">
                  {{ item.data.style }} <span v-if="item.data.indoor === 'Yes'">— Indoor</span>
              </div>
            </div>
            <figure class="bonsai__figure">
              <prismic-image :field="item.data.image.Teaser"/>
            </figure>
          </div>
        </div>
        <div v-if="item.data.description.length !== 0" class="bonsai__description">
          <prismic-rich-text :field="item.data.description"/>
        </div>
      </div>

    </div>
    <!-- If no blog posts return message -->
    <div v-else class="blog-main">
      <p>No Posts published at this time.</p>
    </div>

  </div>
</template>

<script>
import { ModelSelect } from 'vue-search-select'
import BonsaiTeaser from './BonsaiTeaser.vue'

export default {
  name: 'bonsai-posts',
  data () {
    return {
      posts: [],
      titlesFilter: [],
      currentTitlesFilter: {
        value: 'meleze',
        text: 'Meleze'
      },
    }
  },
  methods: {
    getPosts () {
      //Query to get blog posts
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'bonsai'),
        { orderings : '[my.bonsai.title]' }
      ).then((response) => {
        this.posts = response.results;
      })
    },
    // @todo don't call twice, populate this.titlesFilter with this.posts instead.
    setSearchSelectOptions() {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'bonsai'),
        { orderings : '[my.bonsai.title]' }
      ).then((response) => {
        const stylesFilter = [];
        response.results.forEach(function(post) {
          var cell = {
            text: post.data.title[0].text,
            value: post.data.title[0].text.toLowerCase()
          };
          stylesFilter.push(cell);
        });
        this.titlesFilter = stylesFilter;
      })
    },
    // vue-search-select.
    reset () {
      this.currentTitlesFilter = {}
    },
  },
  components: {
    BonsaiTeaser,
    // vue-search-select.
    ModelSelect
  },
  computed: {
    setStylesFilter() {
      return getExistingStyles(this.posts);
    },
    setStylesFilterResult() {
      return getPostByName(this.currentTitlesFilter, this.posts)
    },
  },
  created () {
    this.getPosts()
    this.setSearchSelectOptions()
  }
}

function getPostByName(item, posts) {
  const currFilter = item.text;
  // Need an array of item to loop on it in
  // template, see how to avoid.
  const renderArray = [];
  posts.forEach(function(post) {
    const title = post.data.title[0].text;
    if (currFilter == title) {
      renderArray.push(post);
    }
  });
  return renderArray
}

function getExistingStyles(posts) {
  const stylesFilter = [];
  posts.forEach(function(post) {
    var cell = {
      name: post.data.style,
      id: convertToId(post.data.style)
    };
    stylesFilter.push(cell);
  });
  return stylesFilter;
}

function convertToId(str) {
  str = str.replace(/\s+/g, '-').toLowerCase();
  return str;
}
</script>

<style>
@media screen and (min-width: 920px) {
  body {
    background: #63d6c5;
    height: 100vh;
    overflow: hidden;
  }
}
.bonsai__description h1,
.bonsai__description h2,
.bonsai__description h3 {
  font-weight: bold;
  margin: 1.5em 0;
}
.bonsai__description p {
  margin: 1rem 0;
}
</style>

<style scoped>
.filters {
  margin-bottom: 2em;
}

.filter {
  display: flex;
  margin-bottom: 1em;
}

.filter__title {
  font-size: 2rem;
  font-weight: normal;
  margin: auto 0 2rem;
  text-align: center;
}
@media screen and (min-width: 920px) {
  .filter__title {
    color: white;
    flex: 1 0 100%;
  }
}

@media screen and (min-width: 920px) {
  .panel-left {
    height: 100vh;
    position: absolute;
    padding: 7rem 5rem;
    right: 60%;
    top: 0;
    left: 0;
    display: flex;
    width: 40%;
    align-items: center;
    flex-flow: row wrap;
  }
  .filter {
    flex: 1 0 100%;
    margin: 2rem 0 auto;
  }
  .panel-right {
    background: white;
    top: 0;
    right: 0;
    left: 40%;
    height: 100vh;
    overflow: scroll;
    position: absolute;
    padding: 7rem 5rem;
  }
}

@media screen and (max-width: 419px) {
  .bonsai__summary {
    display: flex;
  }
}
.bonsai__content {
  flex: 1;
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
.bonsai__figure {
  margin-bottom: 1rem;
  margin-top: 1rem;
}
@media screen and (max-width: 419px) {
  .bonsai__figure {
    max-width: 120px;
    margin-bottom: 0;
    margin-top: 0;
  }
}
img {
  max-width: 100%;
  height: auto;
}
</style>
