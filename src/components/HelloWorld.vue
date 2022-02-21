<template>
  <div class="hello">
    <datetime v-model="date" :type="'datetime'" :use12Hour="true"></datetime>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
