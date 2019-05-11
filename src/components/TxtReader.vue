<template>
  <label class="text-reader">
    {{ title }}
    <input type="file" accept=".txt" @change="loadTextFromFile" />
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
// A komponensek azonosítójában nem lehet ékezetes karakter pl.: TxtOlvasó !
export default class TxtReader extends Vue {
  // prettier-ignore
  @Prop() private title!: string;
  public loadTextFromFile(ev: any): void {
    const file = ev.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = e => {
      if (e.target) {
        this.$emit("load", reader.result);
      }
    };
    reader.readAsText(file);
  }
}
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  border: 2px solid black;
  background-color: lightgrey;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
