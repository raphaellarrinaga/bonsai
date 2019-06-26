<template>
  <div>
    <!-- Check blog posts exist -->
    <div v-if="posts.length !== 0" class="bonsai-list">

      <div class="filters panel-left">
        <h1 class="filter__title">🌴🌳 Find some stuff 🌵🌴</h1>
        <div class="filter">
          <model-select :options="test"
          v-model="item"
          placeholder="Type a bonsaï name">
          </model-select>
        </div>
      </div>

      <div v-for="item in setStylesFilterResult" :key="item.data.uid" class="panel-right">
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

export default {
  name: 'bonsai-posts',
  data () {
    return {
        options: [
          { value: '1', text: 'aa' + ' - ' + '1' },
          { value: '2', text: 'ab' + ' - ' + '2' },
          { value: '3', text: 'bc' + ' - ' + '3' },
          { value: '4', text: 'cd' + ' - ' + '4' },
          { value: '5', text: 'de' + ' - ' + '5' }
        ],
        item: {
          value: '',
          text: ''
        },
      posts: [],
      test: [],
      selectedCategory: "All",
      keyword: '',
      category: '',
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
    // @todo don't call twice, populate this.test with this.posts instead.
    setSearchSelectOptions() {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'bonsai'),
        { orderings : '[my.bonsai.date desc]' }
      ).then((response) => {
        const stylesFilter = [];
        response.results.forEach(function(post) {
          var cell = {
            text: post.data.title[0].text,
            value: post.data.title[0].text.toLowerCase()
          };
          stylesFilter.push(cell);
        });
        this.test = stylesFilter;
      })
    },
    // vue-search-select.
    reset () {
      this.item = {}
    },
    selectFromParentComponent () {
      // select option from parent component
      this.item = this.options[0]
    },
  },
  components: {
    // vue-search-select.
    ModelSelect
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
    },
    setStylesFilter() {
      return getExistingStyles(this.posts);
    },
    setStylesFilterResult() {
      const currFilter = this.item.text;
      const truc = [];
      this.posts.forEach(function(post) {
        const title = post.data.title[0].text;
        if (currFilter == title) {
          truc.push(post);
          // console.log(truc);
          // return truc
        }
        // if (currFilter == title) return post;
      });
      // console.log(this.posts)
      // return this.posts
      return truc
    },
    filteredByAll() {
      return getByStyle(getPostByKeyword(this.posts, this.keyword), this.category)
    },
    filteredByKeyword() {
      return getByKeyword(this.list, this.keyword)
    },
    filteredByCategory() {
      return getByCategory(this.list, this.category)
    }
  },
  created () {
    this.getPosts()
    this.setSearchSelectOptions()
  }
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

function getIndoor(posts, category) {
  if (category === "All") {
    return posts;
  } else {
    return posts.filter(function(person) {
      return person.data.indoor === category;
    });
  }
}

function getPostByKeyword(list, keyword) {
  const search = keyword.trim()
  if (!search.length) return list
  return list.filter(item => item.data.title[0].text.toLowerCase().indexOf(search) > -1)
}


function getByKeyword(list, keyword) {
  const search = keyword.trim()
  if (!search.length) return list
  return list.filter(item => item.name.indexOf(search) > -1)
}

function getByCategory(list, category) {
  if (!category) return list
  return list.filter(item => item.category === category)
}

function getByStyle(posts, category) {
  if (!category) return posts
  return posts.filter(item => convertToId(item.data.style) === category)
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

.bonsai__summary {
  display: flex;
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
@media screen and (max-width: 419px) {
  .bonsai__figure {
    max-width: 120px;
  }
}
img {
  max-width: 100%;
  height: auto;
}
</style>
