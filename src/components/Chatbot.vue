<script setup>
import {onUpdated, ref} from "vue";
  import ChatInput from './ChatInput.vue'
  import ApiService from "../ApiService.js";
  import Message from './Message.vue';
  import LoadingAnimation from './LoadingAnimation.vue';
  import {v4 as uuidv4} from "uuid";
  import Popup from './Popup.vue';
  import texts from '../assets/staticText.json';

  const messageStack = ref([]);
  const scroller = ref(null);
  const refMessage = ref(null);

  const loadingAnimation = ref(false);
  const loadingRef = ref(false);
  const isLightMode = ref(true);
  const isReference = ref(false);

  const isPopup = ref(false);
  const popUp = ref({'text': 'test, isWarning: false'});
  const popupContent = ref(null);

  // Sets variable for light/dark mode
  window.matchMedia('(prefers-color-scheme: dark)').matches ? isLightMode.value = false : isLightMode.value = true;
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    e.matches ? isLightMode.value = false : isLightMode.value = true;
  });

  // scrolls to bottom of messages on update
  onUpdated(() => {
    scrollToBottom();
  });

  // displays a first welcome message
  messageStack.value.push({
    text: texts.welcomeText,
    fromBot: true
  });

  /**
   * Sends Question from user input to server and adds answer to message array
   * @param text the question from user input
   * @returns {Promise<void>}
   */
  async function sendQuestion(text){
    if (text){
      const messageCount = messageStack.value.length;
      messageStack.value.push({'text': text, 'fromBot': false, 'count': messageCount});
      loadingAnimation.value = true;
      ApiService.postQuestion(text.replace('\n',''), "azure", messageCount)
          .then((res) => {
            messageStack.value.push({
              'text': res.answer,
              'fromBot': true,
              'count': messageCount,
              'references': res.prompts,
              'source': res.source
            });
            loadingAnimation.value = false;
          })
          .catch((e) => {
            loadingAnimation.value = false;
            if (e.code === 1) {
              messageStack.value.push({
                text: 'Es wurde keine passende Antwort gefunden.',
                fromBot: true,
                isNoAnswer: true,
                count: messageCount,
              });
            } else {
              isPopup.value = true;
              popupContent.value =
                  `<p>An Error occurred: ${e.message}</p>`
            }
            console.log(e)
          });
    }
  }

  /**
   * Calls Server to get a reference that was clicked on by the user
   * @param refId the id that represent the answer-question pair in the azure kb
   * @returns {Promise<void>}
   */
  async function getReference(refId){
    loadingRef.value = true;
    ApiService.getReferenceFromAzure(refId)
        .then((res) => {
          refMessage.value = {
            'text': res.answer,
            'references': res.prompts,
            'source': res.source
          };
          isReference.value = true;
          loadingRef.value = false;
        })
        .catch((e) => {
          console.log(e);
          loadingRef.value = false;
        });
  }

  /**
   * Displays popup with a help text
   */
  function displayHelp(){
    isPopup.value = true;
    let imgSrc = '/src/assets/send_arrow.svg'
    popupContent.value =
        `<p style="margin: 0px">${texts.helpText}</p>`
  }

  /**
   *  Display popup with text that explains why no fitting answer was found
   */
  function displayNoAnswerHelp(){
    isPopup.value = true;
    popupContent.value =
        `<p>${texts.noAnswerText}</p>
        `
  }


  /**
   * Scrolls the div containing the message to bottom
   */
  function scrollToBottom(){
    const scrollHeight = scroller.value.scrollHeight;
    scroller.value.scrollTo(0, scrollHeight);
  }
</script>

<template>
  <div class="chatbot-container">
    <Popup v-if="isPopup" :is-warning="popUp.isWarning" @close-popup="isPopup = false">
      <div v-html="popupContent"></div>
    </Popup>
    <div class="flex" :class="{'blurred': isPopup}">
      <div class="header">
        <div class="logo-container">
          <img src="../assets/bot_avatar.svg">
        </div>
        <p>Wissensbot</p>
        <button @click="displayHelp" class="icon-btn">
          <img v-if="isLightMode" src="../assets/questionmark.svg">
          <img v-else src="../assets/questionmark_dmode.svg">
        </button>
      </div>
      <Transition>
        <div class="reference-container" v-if="isReference">
          <LoadingAnimation is-ref v-if="loadingRef"/>
          <Message
              v-if="!loadingRef"
              :text="refMessage.text"
              :is-from-bot="true"
              :references="refMessage.references"
              :source="refMessage.source"
              @ref-requested="(refId) => getReference(refId)"
          />
          <button @click="isReference=false">schließen</button>
        </div>
      </Transition>
      <div class="message-container" ref="scroller">
        <Message
            v-for="message in messageStack"
            :text="message.text"
            :is-from-bot="message.fromBot"
            :references="message.references"
            :source="message.source"
            :is-no-answer="message.isNoAnswer"
            @ref-requested="(refId) => getReference(refId)"
            @loaded="scrollToBottom()"
            @no-answer="displayNoAnswerHelp()"
        />
        <LoadingAnimation v-if="loadingAnimation"/>
      </div>
      <ChatInput @question-submitted="(text) => sendQuestion(text)"/>
    </div>
  </div>
</template>

<style scoped>
  .chatbot-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg-lmode-light);
    color: black;
  }
  .flex{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .blurred{
    pointer-events: none;
    filter: blur(4px);
  }
  .reference-container{
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    background-color: var(--color-bg-lmode-blueish);
    box-shadow: black 0 0 8px -4px inset;
    padding: 20px;
    z-index: 6;
    overflow: clip;
  }
  .message-container{
    flex-grow: 1;
    padding: 15px;
    overflow-y: scroll;
    scrollbar-width: thin;
    display: flex;
    flex-direction: column;
    gap: 30px;
    white-space: pre-line;
  }
  .header {
    background-color: var(--color-bg-lmode-main);
    box-shadow: rgba(0, 0, 0, 0.25) 0 1px 6px -2px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-family: Montserrat, Arial, sans-serif;
    font-size: 18px;
    gap: 10px;
    z-index: 5;
  }

  .logo-container img{
    height: 25px;
  }

  .header button{
    margin: 0 0 0 auto;
  }
  @media (prefers-color-scheme: dark) {
    .chatbot-container {
      background-color: var(--color-bg-dmode-main);
      color: white;
    }
    .header {
      background-color: var(--color-bg-dmode-dark-alt);
    }
    .reference-container{
      background-color: var(--color-bg-dmode-light);
    }
  }
  @media (min-width: 580px) {
    .chatbot-container{
      border-radius: 18px;
      position: relative;
      width: 540px;
      margin: 40px 0;
      height: calc(100vh - 80px);
      overflow: clip;
      box-shadow: rgba(0, 0, 0, 0.25) 0 0 6px 2px;
    }
  }
  .v-enter-active,
  .v-leave-active {
    max-height: 500px;
    transition: max-height 0.2s ease-in-out;
  }

  .v-enter-from,
  .v-leave-to {
    max-height: 0px;
  }
</style>

