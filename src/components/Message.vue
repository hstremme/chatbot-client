<script setup>
import {defineProps, onUpdated, ref} from 'vue';
import{ hyphenate } from 'hyphen/de';

const props = defineProps({
  text: String,
  isFromBot: Boolean,
  references: Array,
  source: Object,
  isNoAnswer: Boolean
})

const emit = defineEmits(['loaded', 'refRequested']);

const hasSource = ref(props.source && props.source.length !== 0);
const isLightMode = ref(true);
let displayLink = ref(false);

// Sets variable for light/dark mode
window.matchMedia('(prefers-color-scheme: dark)').matches ? isLightMode.value = false : isLightMode.value = true;
window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  e.matches ? isLightMode.value = false : isLightMode.value = true;
});

let output = ref([]);

// creates output that includes references
if (props.isFromBot && props.references){
  let orderedRefs = [];
  // create list that contains all references and the index where it appears in the message text
  for (const ref of props.references){
    let firstCut = props.text.indexOf(ref.displayText);
    while (firstCut !== -1 ){
      let copied = JSON.parse(JSON.stringify(ref))
      copied.firstCut = firstCut;
      orderedRefs.push(copied);
      firstCut = props.text.indexOf(ref.displayText, firstCut + 1);
    }
  }
  // sorts the references by the index where it appears in the message text
  orderedRefs.sort((a, b) => a.firstCut - b.firstCut);
  // fills output array with objects that either represent the references or the text in between the references
  let initCut = 0;
  for (const ref of orderedRefs){
    const firstCut = ref.firstCut;
    const secondCut = firstCut + ref.displayText.length;
    if (firstCut !== initCut){ // Cuts the first text, if its not a ref
      output.value.push({'isRef': false, 'text': props.text.slice(initCut, firstCut)})
    }
    output.value.push({'isRef': true, 'refId': ref.qnaId, 'text': props.text.slice(firstCut, secondCut)});
    initCut = secondCut;
  }
  if (initCut !== props.text.length){ // Cuts the last part of the text, if its not a ref
    output.value.push({'isRef': false, 'text': props.text.slice(initCut)});
  }
} else {
  output.value.push({'isRef': false, 'text': props.text});
}

// hyphenates the output
for (const out of output.value){
  hyphenate(out.text)
      .then((result) => {
        out.text = result;
      });
}

// emits reference clicked event, this will trigger the reference display in parent
function refClicked(refId){
  if (!refId){
    return
  }
  emit('refRequested', refId)
}

// emits loaded event, this will trigger the scroll to bottom function in parent
onUpdated(() => {
  emit('loaded');
})

</script>

<template>
  <div class="message" :class="{'from-bot': props.isFromBot}">
    <span class="output"
          :class="{ref: out.isRef}"
          v-for="out in output"
          @click="refClicked(out.refId)">
      {{out.text}}
    </span>
    <a class="source" v-if="hasSource && !displayLink" @click="displayLink=true">Quelle</a>
    <a class="source" v-if="props.isNoAnswer" @click="$emit('noAnswer')">Warum?</a>
    <a class="source" v-if="hasSource && displayLink" :href="props.source.link_url" target="_blank">
      <div style="display: inline">
        <img v-if="isLightMode" src="../assets/external.svg">
        <img v-else src="../assets/external_dmode.svg">
      </div>
      <span>
        {{ props.source.link_text }}
      </span>
    </a>
  </div>
</template>

<style scoped>
  .message{
    display: inline-block;
    width: fit-content;
    max-width: 70%;
    align-self: end;
  }
  .from-bot{
    align-self: start;
  }
  .reference-container .message{
    align-self: center;
  }
  .source{
    display: block;
    text-align: right;
    margin-top: 8px;
  }
  .source img{
    height: 13px;
    margin-right: 4px;
  }
</style>