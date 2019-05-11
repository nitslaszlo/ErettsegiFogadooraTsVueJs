<template>
  <label class="text-writer">
    {{ title }}
    <input type="button" @click="writeTextToFile()" />
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
// A komponensek azonosítójában nem lehet ékezetes karakter pl.: TxtOlvasó !'
export default class TxtWriter extends Vue {
  // prettier-ignore
  @Prop() private title!: string;
  @Prop() private content!: string;
  @Prop() private filename!: string;
  public writeTextToFile(): void {
    if (!this.content) return;
    if (!this.filename) return;
    const textFileAsBlob = new Blob(["\ufeff", this.content], { type: "text/plain"});
    const downloadLink = document.createElement("a");
    downloadLink.download = this.filename;
    downloadLink.innerHTML = "Download File"; // Elhagyható?
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = e => document.body.removeChild(e.target as Node);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
</script>

<style>
.text-writer {
  position: relative;
  overflow: hidden;
  display: inline-block;
  border: 2px solid black;
  background-color: lightgrey;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.text-writer input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
