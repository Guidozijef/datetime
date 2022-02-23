<template>
  <div class="hello">
    <div style="width: 240px">
      <datetime v-model="date" :type="'datetime'"></datetime>
    </div>
  </div>
</template>

<script>
import datetime from './Datetime.vue'
export default {
  name: 'HelloWorld',
  components: { datetime },
  props: {
    msg: String
  },
  data () {
    return {
      date: ''
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
