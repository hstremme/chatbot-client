<script setup>
import {defineProps, onUpdated, ref} from 'vue';
import{ hyphenate } from 'hyphen/de';

const props = defineProps({
  'text': String,
  'isFromBot': Boolean,
  'references': Array
})

const emit = defineEmits(['loaded', 'refRequested']);

const hyphenatedText = ref(null);

let output = ref([]);

if (props.isFromBot && props.references){
  let orderedRefs = [];
  for (const ref of props.references){
    let firstCut = props.text.indexOf(ref.displayText);
    while (firstCut !== -1 ){
      let copied = JSON.parse(JSON.stringify(ref))
      copied.firstCut = firstCut;
      orderedRefs.push(copied);
      firstCut = props.text.indexOf(ref.displayText, firstCut + 1);
    }
  }
  orderedRefs.sort((a, b) => a.firstCut - b.firstCut);
  console.log(orderedRefs);
  let initCut = 0;
  for (const ref of orderedRefs){
    const firstCut = ref.firstCut;
    const secondCut = firstCut + ref.displayText.length;
    if (firstCut !== initCut){                                        // Cuts the first text, if its not a ref
      output.value.push({'isRef': false, 'text': props.text.slice(initCut, firstCut)})
    }
    output.value.push({'isRef': true, 'refId': ref.qnaId, 'text': props.text.slice(firstCut, secondCut)});
    initCut = secondCut;
  }
  if (initCut !== props.text.length){                                 // Cuts the last part of the text, if its not a ref
    output.value.push({'isRef': false, 'text': props.text.slice(initCut)});
  }
} else {
  output.value.push({'isRef': false, 'text': props.text});
}

for (const out of output.value){
  hyphenate(out.text)
      .then((result) => {
        out.text = result;
      });
}

hyphenate(props.text).then((result) => {
  hyphenatedText.value = result;
});

function refClicked(refId){
  if (!refId){
    return
  }
  emit('refRequested', refId)
}

onUpdated(() => {
  emit('loaded');
})

</script>

<template>
  <div class="container" :class="{'bot-message': props.isFromBot}">
    <span class="output"
          :class="{ref: out.isRef}"
          v-for="out in output"
          @click="refClicked(out.refId)">
      {{out.text}}
    </span>
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
    text-align: left;
  }
  .bot-message{
    float: left;
    background-color: #747bff;
  }
  .ref {
    text-decoration: underline #2d3084 2px;
  }
  .ref:hover{
    cursor: pointer;
  }
</style>