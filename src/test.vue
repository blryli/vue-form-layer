<template>
  <div>
    <p>{{data.content}}</p>
    <p>
      <img style="width: 80px;height:auto" :src="data.img"/>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
};
</script>

<style>
</style>
