export default class Tanar {

    private nev: string;
    private foglalasok: Map<string, string>;

    public constructor(nev: string) {
        this.nev = nev;
        this.foglalasok = new Map<string, string>();
    }

    public foglalastHozzaad(foglalas: string): boolean {
        const m: string[] = foglalas.split(" "); // 16:40 2017.10.28-21:31
        if (this.foglalasok.has(m[0])) { // ellenőrzés nem a feladat része
            return false;
        } else {
            this.foglalasok.set(m[0], m[1]); // elegendő lenne ennyi is
            return true;
        }
    }

    public get foglalasokSzama(): number {
        return this.foglalasok.size;
    }

    public get legelsoFoglalasIdeje(): string {
        // rendezés érték (value) szerint a[1], b[1]:
        const foglalasokRendezve = new Map([...this.foglalasok].sort((a, b) => a[1] > b[1] ? 1 : -1));
        return foglalasokRendezve.values().next().value; // első érték (value) kinyerése
    }

    public get legelsoFoglalasIdopont(): string {
        const foglalasokRendezve = new Map([...this.foglalasok].sort((a, b) => a[1] > b[1] ? 1 : -1));
        return foglalasokRendezve.keys().next().value; // első kulcs (key) kinyerése
    }

    public get tanarNeve(): string {
        return this.nev;
    }

    public get szabadIdopontok(): string[] {
        const szabadLista: string[] = [];
        for (let i: number = 16 * 60; i < 18 * 60; i += 10) {
            const ora: string = `${Math.floor(i / 60)}`;
            const perc: string = `${i % 60}`.padStart(2, "0"); // "0" -> "00"
            const idopont: string = `${ora}:${perc}`; // pl.: "16:00"
            if (!this.foglalasok.has(idopont)) { // ha nincs ilyen időpont foglalva
                szabadLista.push(idopont); // mehet a szabad időpont a listába
            }
        }
        return szabadLista;
    }

    public get legkorabbanTavozhat(): string {
        // rendezés key szerint a[0], b[0] csökkenő rendben:
        const rendezve = new Map([...this.foglalasok].sort((a, b) => b[0] > a[0] ? 1 : -1));
        const utolsoFoglalat: string = rendezve.keys().next().value; // első kulcs kinyerése
        let utolsoFoglalatPercben: number = parseInt(utolsoFoglalat.split(":")[0], 10) * 60 +
            parseInt(utolsoFoglalat.split(":")[1], 10);
        utolsoFoglalatPercben += 10;
        const perc: string = `${utolsoFoglalatPercben % 60}`.padStart(2, "0"); // vezető nullát hozzáad
        return `${Math.floor(utolsoFoglalatPercben / 60)}:${perc}`;
    }

    public FoglaltE(idopont: string): boolean {
        return this.foglalasok.has(idopont);
    }
}
