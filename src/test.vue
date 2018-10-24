<template>
  <div>
    <p>{{data.content}}</p>
    <img style="width:100px;height:auto" :src="data.img "/>
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: {
    data: [String, Object]
  }
};
</script>

<style>
</style>

