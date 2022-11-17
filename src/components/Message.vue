<script setup>
import {defineProps, onUpdated, ref} from 'vue';
import{ hyphenate } from 'hyphen/de';

const props = defineProps({
  'text': String,
  'isFromBot': Boolean
})

const emit = defineEmits(['loaded']);

const hyphenatedText = ref(null);

hyphenate(props.text).then((result) => {
  hyphenatedText.value = result;
})

onUpdated(() => {
  emit('loaded');
})
</script>

<template>
  <div class="container" :class="{'bot-message': props.isFromBot}">
    <p>{{ hyphenatedText }}</p>
  </div>
</template>

<style scoped>
  .container {
    background-color: #535bf2;
    width: 225px;
    margin: 10px;
    float: right;
    border-radius: 3px;
    padding: 5px 10px;
    overflow-x: auto;
  }
  .bot-message{
    float: left;
    background-color: #747bff;
  }
  p {
    text-align: left;
    margin: 0;
  }
</style>