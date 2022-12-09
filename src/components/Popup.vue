<template>
  <div class="popup-container" :class="{'warning': props.isWarning}">
    <div class="content">
      <slot/>
      <button @click="$emit('closePopup')">schließen</button>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({'isWarning': Boolean, 'text': String});
</script>

<style scoped>
  .popup-container{
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 5;
    height: 100%;
    width: 100%;
  }
  .content{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 25px;
    width: 60%;
    border-radius: 8px;
    background-color: var(--color-bg-lmode-dark);
    box-shadow: rgba(0, 0, 0, 0.25) 0 0 6px 2px;
  }
  @media (prefers-color-scheme: dark) {
    .content{
      background-color: var(--color-bg-dmode-light);
    }
  }
</style>