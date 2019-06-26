<template>
  <div>
    <input v-model="keyword" placeholder="Search by keyword">
    <select v-model="category">
      <option value="">-- All styles --</option>
      <option v-for="styles in setStylesFilter" :value="styles.id">{{ styles.name }}</option>
    </select>
    <table>
      <tr>
        <th>All</th>
        <th>by Keyword</th>
        <th>by Category</th>
        <th>by All Styles</th>
      </tr>
      <tr>
        <td>
          <div v-for="item in list">{{ item.name }}</div>
        </td>
        <td>
          <div v-for="item in filteredByKeyword">{{ item.name }}</div>
        </td>
        <td>
          <div v-for="item in filteredByCategory">{{ item.name }}</div>
        </td>
        <td>
          <!-- <div v-for="item in filteredByAll" class="resultAll">{{ item.name }}</div> -->
          <div v-for="item in filteredByAll" class="resultAll">
            {{ $prismic.richTextAsPlain(item.data.title) }}
            {{ item.data.style }}
          </div>
        </td>
      </tr>
    </table>
    <br>
    <hr>
    <br>
  <!-- Check blog posts exist -->
  <div v-if="posts.length !== 0" class="bonsai-list">
    <div class="filters">
      <div class="filter">
        <h3 class="filter__title">Indoor</h3>
        <label><input type="radio" v-model="selectedCategory" value="All" /> All</label>
        <label><input type="radio" v-model="selectedCategory" value="Yes" /> Yes</label>
        <label><input type="radio" v-model="selectedCategory" value="No" /> No</label>
      </div>
      <div class="filter">
        <!-- <label for="style-select" class="form-label">Style:</label>
        <select id="style-select">
          <option v-model="style" value="">--Chose--</option>
          <option v-model="style" value="Formal upright">Formal upright</option>
          <option v-model="style" value="Informal upright">Informal upright</option>
          <option v-model="style" value="Slant">Slant</option>
          <option v-model="style" value="Cascade">Cascade</option>
          <option v-model="style" value="Shari">Shari</option>
          <option v-model="style" value="Root-over-rock">Root-over-rock</option>
        </select> -->
      </div>
    </div>
    <ul class="bonsai-list">
      <li v-for="post in filteredPosts" :key="post.data.uid" class="bonsai-list__item">
        <div class="bonsai">
          <div class="bonsai__content">
            <h1 class="bonsai__title">
              {{ $prismic.richTextAsPlain(post.data.title) }}
            </h1>
            <div class="bonsai__metas">
                {{ post.data.style }} <span v-if="post.data.indoor === 'Yes'">— Indoor</span>
            </div>
          </div>
          <figure class="bonsai__figure">
            <prismic-image :field="post.data.image.Teaser"/>
          </figure>
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
      list: [
        { name: 'asd', category: 1 },
        { name: 'zxc', category: 1 },
        { name: 'qwe', category: 1 },
        { name: 'qqq', category: 2 },
        { name: 'www', category: 2 },
        { name: 'eee', category: 2 },
        { name: 'rrr', category: 2 },
        { name: 'ttt', category: 2 },
        { name: 'ert', category: 1 },
        { name: 'wer', category: 2 },
        { name: 'sdf', category: 1 },
        { name: 'dfg', category: 2 },
        { name: 'xcv', category: 1 }
      ],
      categories: [
        { id: 'formal-upright', name: 'Formal upright' },
        { id: 'informal-upright', name: 'Informal upright' },
        { id: 'slant', name: 'Slant' },
        { id: 'cascade', name: 'Cascade' },
        { id: 'shari', name: 'Shari' },
        { id: 'root-over-rock', name: 'Root-over-rock' },
      ],
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
    filteredByAll() {
      // return getByCategory(getByKeyword(this.list, this.keyword), this.category)
      // return getByStyle(this.posts, this.category)
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

<style scoped>
.filters {
  margin-bottom: 2em;
}
.filter {
  display: flex;
  margin-bottom: 1em;
}
.filter label {
  margin-right: 1em;
}
.filter__title {
  font-weight: bold;
  margin-right: 1em;
}
.form-label {
  font-weight: bold;
}
.bonsai {
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

.resultAll {
  background: yellow;
}
td, th {
  border: 1px solid black;
  padding: 1em;
  vertical-align: top;
}
</style>
