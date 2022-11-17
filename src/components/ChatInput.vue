<script setup>
  import {ref} from "vue";
  import ApiService from '../ApiService.js'
  const question = ref(null);
  const emit = defineEmits(['questionSubmitted']);
  const textArea = ref(null);

  function emitQuestion(text){
    emit('questionSubmitted', text);
    textArea.value.value = '';
  }
</script>

<template>
  <div class="container">
    <textarea ref="textArea" v-model="question" placeholder="..." @keyup.enter="emitQuestion(question)"/>
    <div class="button-container">
      <button @click="emitQuestion(question)">
        <img src="../assets/send_icon.svg">
      </button>
    </div>
  </div>
</template>

<style scoped>
  .container{
    display: flex;
    margin-top: 5px;
  }
  form{
    width: 100%;
  }
  textarea{
    width: 100%;
    border: #535bf2 solid 2px;
    border-radius: 5px;
    background-color: #242424;
    outline: none;
    resize: none;
    scrollbar-width: thin;
  }
  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px;
  }
  button{
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
  }
</style>

