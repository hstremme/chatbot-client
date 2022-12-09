<script setup>
  import {ref} from "vue";
  const question = ref(null);
  const emit = defineEmits(['questionSubmitted']);
  const textArea = ref(null);
  const isLightMode = ref(true);

  // Sets variable for light/dark mode
  window.matchMedia('(prefers-color-scheme: dark)').matches ? isLightMode.value = false : isLightMode.value = true;
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    e.matches ? isLightMode.value = false : isLightMode.value = true;
  });

  /**
   * Emits question submitted event and clears textarea input
   * @param text
   */
  function emitQuestion(text){
    emit('questionSubmitted', text);
    textArea.value.value = '';
  }
</script>

<template>
  <div class="input-container">
    <textarea ref="textArea" v-model="question" placeholder="Hier die Frage eingeben" @keyup.enter="emitQuestion(question)"/>
    <button class="icon-btn" @click="emitQuestion(question)">
      <img v-if="isLightMode" src="../assets/send_arrow.svg">
      <img v-else src="../assets/send_arrow_dmode.svg">
    </button>
  </div>
</template>

<style scoped>
  .input-container{
    background-color: var(--color-bg-lmode-main);
    box-shadow: rgba(0, 0, 0, 0.25) 0 -2px 6px -2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding: 10px 20px;
  }
  textarea {
    flex-grow: 1;
  }
  @media (prefers-color-scheme: dark) {
    .input-container{
      background-color: var(--color-bg-dmode-dark-alt);
    }
  }
</style>

