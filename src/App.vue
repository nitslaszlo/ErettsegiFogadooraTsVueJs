<template>
  <div id="app">
    <p>
      Linkek:
      <a href="fogado.txt" download>fogado.txt</a>
      <a href="Fogadoora_fel.pdf" target="_blank">Feladat</a>
      <a href="Fogadoora_jav.pdf" target="_blank">Javítási</a>
      <a href="https://github.com/nitslaszlo/ErettsegiFogadooraTsVueJs" target="_blank">Forrás</a>
      <a href="https://github.com/nitslaszlo/JedlikVueJsStarter" target="_blank">SDK</a>
    </p>
    <txt-reader title="Kérem töltse fel a forrás (fogado.txt) állományt!" @load="txtSorai = $event" />
    <div v-if="mutat" id="megoldas">
      <p>2. feladat<br>Foglalások száma: {{ osszesFoglalas }}</p>
      <p>3. feladat<br>Adjon meg egy nevet:
        <input v-model="inputNev" type="text"><br>{{tanarFoglalas}}
      </p>
      <p>4. feladat<br>Adjon meg egy érvényes időpontot (pl. 17:10):
        <input v-model="inputIdopont" type="text" maxlength="5" style="width: 50px;">
        <span v-for="(t, index) in foglaltTanarokNevsora.split('\r\n')" :key="index"><br>{{ t }}</span>
      </p>
      <p>5. feladat<br>
        Tanár neve: {{ legelsonekFoglaltTanar.tanarNeve }}<br>
        Foglalt időpont: {{ legelsonekFoglaltTanar.legelsoFoglalasIdopont }}<br>
        Foglalás ideje: {{ legelsonekFoglaltTanar.legelsoFoglalasIdeje }}
      </p>
      <p>6. feladat <input v-model="inputNev2" type="text">
        <span v-for="(t, index) in szabadNev2" :key="index"><br>{{ t }}</span><br>
        {{ inputNev2 }} legkorábban távozhat: {{ legkorabbanTavozhatNev2 }}
      </p>

    </div>
    <p v-if="menthet">
      <txt-writer :title="mentesParancsgombFelirata" :content="foglaltTanarokNevsora" :filename="fajlNeve" />
    </p>
    <!-- Megoldás DIV -->

    <!-- Nem a feladat része : -->
    <div id="egyebek" v-if="mutat">
      <p><b>{{fajlNeve}} fájl:</b><br>
        <span v-for="(t, index) in foglaltTanarokNevsora.split('\n')" :key="index">{{ t.trim() }}<br></span>
      </p>
      <p><b>fogado.txt fájl:</b><br>
        <span v-for="(t, index) in txtSorai.split('\n')" :key="index">{{ t.trim() }}<br></span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TxtReader from "./components/TxtReader.vue";
import TxtWriter from "./components/TxtWriter.vue";
import Tanar from "./tanar";

@Component({ components: { TxtReader, TxtWriter } })
export default class App extends Vue {
  private tanarok: Map<string, Tanar> = new Map<string, Tanar>();
  private txtSorai: string = ""; // Watch végett nem lehet ékezetes azonosító! (pl.: forrás)!
  private mutat: boolean = false;
  private menthet: boolean = false;
  private inputNev: string = "Nagy Ferenc";
  private inputNev2: string = "Barna Eszter";
  private inputIdopont: string = "17:40";

  @Watch("txtSorai", { immediate: true, deep: true })
  private haForrasValtozik(val: string, oldVal: string) {
    if (val !== "") this.feldolgoz();
  }

  private feldolgoz(): void {
    try { // try-catch nem a feladat része
      this.txtSorai.split("\n").forEach(i => {
        const aktSor: string = i.trim();
        if (aktSor.length > 0) {
          const m: string[] = aktSor.split(" ");
          if (m.length !== 4) { // nem a feladat része
            throw new Error("Hibás forrás!");
          }
          const tanarNeve: string = m[0] + " " + m[1];
          if (!this.tanarok.has(tanarNeve)) {
            this.tanarok.set(tanarNeve, new Tanar(tanarNeve));
          }
          this.tanarok.get(tanarNeve)!.foglalastHozzaad(m[2] + " " + m[3]);
        }
      });
      this.mutat = true;
    } catch (error) { // try-catch nem a feladat része
      this.mutat = false;
      this.tanarok.clear();
      this.txtSorai = "";
      window.alert("Hibás forrás!");
    }
  }

  private get osszesFoglalas(): number {
    let sorokSzama: number = 0;
    for (const i of this.tanarok.values()) {
      sorokSzama += i.foglalasokSzama;
    }
    return sorokSzama;
  }

  private get tanarFoglalas(): string {
    const keresettTanar: Tanar = this.tanarok.get(this.inputNev)!;
    if (keresettTanar === undefined) {
      return "A megadott néven nincs időpontfoglalás.";
    } else {
      return `${this.inputNev} néven ${keresettTanar.foglalasokSzama} időpontfoglalás van.`;
    }
  }

  private get foglaltTanarokNevsora(): string {
    const lista: string[] = [];
    for (const i of this.tanarok.values()) {
      if (i.FoglaltE(this.inputIdopont)) {
        lista.push(i.tanarNeve);
      }
    }
    lista.sort();
    this.menthet = lista.length > 0 ? true : false; // parancsgomb be/ki
    return lista.join("\r\n");
  }

  private get legelsonekFoglaltTanar(): Tanar {
    // tanárok rendezése a tanárokkénti legelső foglalás ideje szerint
    const rendezve = new Map([...this.tanarok].sort(
      (a, b) => a[1].legelsoFoglalasIdeje > b[1].legelsoFoglalasIdeje ? 1 : -1));
    return rendezve.values().next().value; // legelső érték kinyerése
  }

  private get szabadNev2(): string[] {
    const tanar2 = this.tanarok.get(this.inputNev2);
    if (tanar2) {
      return tanar2.szabadIdopontok;
    } else {
      return [];
    }
  }

  private get legkorabbanTavozhatNev2(): string {
    const tanar2 = this.tanarok.get(this.inputNev2);
    if (tanar2) {
      return tanar2.legkorabbanTavozhat;
    } else {
      return "Nincs ilyen nevű tanár!";
    }
  }

  private get fajlNeve(): string {
    return this.inputIdopont.replace(":", "") + ".txt";
  }

  private get mentesParancsgombFelirata(): string {
    return `${this.fajlNeve} állomány mentése`;
  }
}
</script>

<style>
#app {
  font-family: Courier;
}

#megoldas {
  background-color: lightgrey;
  padding: 0px 10px;
  border-radius: 10px;
  max-width: 600px;
}

a {
  text-decoration: none;
  padding-left: 10px;
}

input[type="text"] {
  background-color: lightgray;
}
</style>
