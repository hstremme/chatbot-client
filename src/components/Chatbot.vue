<script setup>
import {onUpdated, ref, nextTick} from "vue";
  import ChatInput from './ChatInput.vue'
  import ApiService from "../ApiService.js";
  import Message from './Message.vue';

  const loadingAnimation = ref(false);
  const messageStack = ref([]);
  const scroller = ref(null);

  onUpdated(() => {
    scrollToBottom();
  })

  async function sendQuestion(text){
    if (text){
      messageStack.value.push({'text': text, 'fromBot': false})
      await sleep(500);
      loadingAnimation.value = true;
      /*ApiService.postTest()
          .then((answer) => {
            messageStack.value.push({'text': answer, 'fromBot': true});
            loadingAnimation.value = false;
          })
          .catch((e) => {
            console.log(e);
            loadingAnimation.value = false
          });*/
      ApiService.postQuestion(text, "openAI")
          .then((answer) => {
            messageStack.value.push({'text': answer, 'fromBot': true})
            loadingAnimation.value = false;
          })
          .catch((e) => {
            console.log(e)
            loadingAnimation.value = false;
          });
    }
  }

  function scrollToBottom(){
    const scrollHeight = scroller.value.scrollHeight;
    scroller.value.scrollTo(0, scrollHeight);
  }

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
</script>

<template>
  <div class="chatbot-container">
    <div class="message-container" ref="scroller">
      <div class="scroll-container">
        <Message v-for="message in messageStack" :text="message.text" :is-from-bot="message.fromBot" @loaded="scrollToBottom()"/>
      </div>
      <div class="animation-container" v-if="loadingAnimation">
        <div class="animation" >
          <div class="dot left"></div>
          <div class="dot middle"></div>
          <div class="dot right"></div>
        </div>
      </div>
    </div>
    <ChatInput @question-submitted="(text) => sendQuestion(text)"/>
  </div>
</template>

<style scoped>
  .chatbot-container{
    background: grey;
    background: linear-gradient(66deg, #535bf2 0%, #c6c8f8 100%);
    padding: 10px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
  }
  .message-container{
    border: #535bf2 solid 2px;
    height: 500px;
    width: 300px;
    border-radius: 5px;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: #535bf2 #242424;
    background-color: #242424;
  }
  .scroll-container{
    overflow-y: auto;
  }
  .animation-container{
    height: 35px;
    width: 70px;
    margin: 0 0 10px 10px;
    background-color: #747bff;
    border-radius: 3px;
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
    background-color: white;
    height: 8px;
    width: 8px;
    border-radius: 50%;
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
    10% {
      opacity: 0.8;
    }
    20% {
      opacity: 0.6;
    }
    30% {
      opacity: 0.4;
    }
    40% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.1;
    }
    60% {
      opacity: 0.2;
    }
    70% {
      opacity: 0.4;
    }
    80% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
</style>

