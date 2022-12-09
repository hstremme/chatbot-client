<script setup>
  import {defineProps} from "vue";

  const props = defineProps({
    'isRef': Boolean
  })
</script>

<template>
  <div class="message animation-container" :class="{'ref': props.isRef}">
    <div class="animation" >
      <div class="dot left"></div>
      <div class="dot middle"></div>
      <div class="dot right"></div>
    </div>
  </div>
</template>

<style scoped>
.animation-container{
  height: 30px;
  width: 50px;
  display: flex;
  justify-content: center;
}
.animation {
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 5px;
}
.dot {
  background-color: black;
  height: 8px;
  width: 8px;
  border-radius: 50%;
}
.ref{
  background-color: var(--color-bg-lmode-blueish);
}
@media (prefers-color-scheme: dark) {
  .dot{
    background-color: white;
  }
}
.dot.left {
  animation-name: dot;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
.dot.middle {
  animation-name: dot;
  animation-duration: 1s;
  animation-delay: -0.3s;
  animation-iteration-count: infinite;
}
.dot.right {
  animation-name: dot;
  animation-duration: 1s;
  animation-delay: -0.6s;
  animation-iteration-count: infinite;
}
@keyframes dot {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
</style>