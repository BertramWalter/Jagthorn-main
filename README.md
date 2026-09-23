# Jagthorn – melodier og signaler

En moderne webapp til at finde, se og øve jagthornsmelodier. Appen viser et
katalog over jagthornssignaler og -melodier, hvor du kan søge og filtrere,
læse noderne i stor visning og afspille lyden eller videoen med fuld kontrol
over play/pause/stop, søgning, hastighed, volumen og loop.

Projektet er en modernisering af det oprindelige statiske HTML/JavaScript-site
(se [Licens og attribution](#licens-og-attribution)) til en vedligeholdelses-
venlig **React + TypeScript + Vite**-frontend. Melodierne kommer fra et typet
katalog, der genereres ud fra de eksisterende lyd-, video- og nodefiler.

## Funktioner

- Katalog over alle **83 melodier** fordelt på seks kategorier: Bronzeprøven,
  Sølvprøven, Guldprøven, Dulighedsprøve, Andre og DM/FM.
- Fritekstsøgning (tåler danske tegn, fx `grævling`/`graevling`) og
  kategorifiltre.
- Detaljeside pr. melodi med delbar URL (`/melodies/bronze-jagtbegynd`).
- Nodevisning med zoom/fuld størrelse og link til teori-PDF.
- Afspiller med play/pause, stop, seek, aktuel tid/varighed, volumen,
  hastighed (0,5× / 0,75× / 1× / 1,25× / 1,5×) og loop med valgfri start/slut.
- Robust håndtering af manglende assets – appen crasher ikke, men viser status.
- Responsivt, naturinspireret og tilgængeligt design med dansk brugerflade.

## Krav

- **Node.js 22+** og npm (frontend – det eneste, der kræves for at køre appen).
- **.NET 8 SDK** (valgfrit – kun hvis du vil starte appen via .NET Aspire).

## Kom hurtigt i gang

```bash
cd web
npm install
npm run dev
```

Åbn adressen, som Vite udskriver (typisk <http://localhost:5173>).

## Kommandoer (kør i `web/`)

| Kommando | Beskrivelse |
| --- | --- |
| `npm run dev` | Starter udviklingsserveren med hot reload. |
| `npm run build` | Typechecker og bygger produktionsversionen til `dist/`. |
| `npm run preview` | Servér den byggede `dist/` lokalt. |
| `npm test` | Kører testsuiten (Vitest) én gang. |
| `npm run test:watch` | Kører tests i watch-mode. |
| `npm run lint` | Kører linteren (oxlint). |
| `npm run typecheck` | Kører TypeScript-typecheck uden build. |
| `npm run generate:catalog` | Regenererer melodikataloget ud fra `public/`-assets. |

## Projektstruktur

```
Jagthorn/
├── web/                      # React + TypeScript + Vite frontend
│   ├── public/
│   │   ├── audio/mp3/<kat>/  # MP3-lydfiler (bronze, solv, guld, DM)
│   │   ├── audio/image/<kat>/# Nodebilleder (PNG) til lydmelodierne
│   │   ├── video/<kat>/      # Video (MP4/WebM), fx dulighed og andre
│   │   └── pdf/              # Delte PDF'er (fx nodelæsningsteori)
│   ├── scripts/
│   │   ├── generate-catalog.mjs   # Migrerings-/genereringsværktøj
│   │   └── legacy-index.html      # Kopi af det oprindelige site (kilde til titler/kategorier)
│   └── src/
│       ├── data/            # Genereret katalog + opslag (catalog.ts)
│       ├── types/           # Melody-typen og hjælpefunktioner
│       ├── hooks/           # useMediaPlayer (afspillerlogik)
│       ├── components/      # SearchBar, MelodyCard, MediaPlayer, SheetMusic …
│       ├── pages/           # CatalogPage, MelodyPage, NotFoundPage
│       └── utils/           # Søgning/filter, loop-logik, tidsformat
├── Jagthorn.AppHost/         # Valgfri .NET Aspire-wrapper
└── Jagthorn.sln              # Solution til Aspire-hosten
```

## Sådan tilføjer du en melodi

Melodierne er **ikke** hardkodet i UI'et. De genereres til
`web/src/data/melodies.generated.ts` af `scripts/generate-catalog.mjs`, som
læser `scripts/legacy-index.html` og krydsrefererer de faktiske filer i
`web/public/`.

For at tilføje en ny melodi:

1. Læg assets i `web/public/` efter samme mønster som de eksisterende:
   - Lyd: `public/audio/mp3/<kategori>/<navn>.mp3`
   - Noder: `public/audio/image/<kategori>/<navn>.png`
   - Video: `public/video/<kategori>/<navn>.mp4` (og evt. `.webm`)
2. Tilføj en `<option>` i `web/scripts/legacy-index.html` under den rigtige
   kategori-overskrift, med `value` svarende til stien uden filendelse
   (fx `value="bronze/mitnyesignal"`) og en læsbar titel som label.
3. Kør genereringen:

   ```bash
   cd web
   npm run generate:catalog
   ```

4. Verificér med `npm run typecheck && npm test`.

Generatoren udleder automatisk hvilke assets der findes (lyd/noder/video),
danner et URL-sikkert `id` (danske tegn foldes: `æ→ae`, `ø→oe`, `å→aa`) og
sætter kategori ud fra overskriften i listen. Du behøver ikke redigere
UI-komponenterne.

## Kør via .NET Aspire (valgfrit)

Appen er en ren statisk SPA og kræver ikke Aspire. Hosten er en tynd wrapper,
der starter Vite-dev-serveren som en Aspire-ressource, så den vises i Aspire-
dashboardet – nyttigt hvis du senere tilføjer backend-services.

Forudsætning: kør `npm install` i `web/` først (Aspire installerer **ikke**
node-afhængigheder automatisk).

```bash
cd web && npm install && cd ..
dotnet run --project Jagthorn.AppHost --launch-profile http
```

Dashboardet lytter på <http://localhost:15180>. Vite-appen får sin port tildelt
af Aspire (via `PORT`-miljøvariablen, som `web/vite.config.ts` læser) og åbnes
via ressourcen `web` i dashboardet. Der findes også en `https`-profil, hvis du
foretrækker HTTPS på dashboardet.

## Statisk hosting

`npm run build` producerer en fuldt statisk `web/dist/`, som kan lægges på en
vilkårlig statisk host. Fordi appen bruger client-side routing
(`/melodies/:id`), skal serveren rewrite'e ukendte stier til `index.html`
(SPA-fallback), så deep links og genindlæsning virker. Eksempler:

- **Netlify**: `/*  /index.html  200`
- **Nginx**: `try_files $uri /index.html;`
- **GitHub Pages / statiske hosts uden rewrites**: brug en hash-baseret router
  eller en 404→index-fallback.

## Browser-afspilning

Browsere kræver en brugerhandling (klik) før lyd/video kan starte – appen
starter derfor først afspilning efter interaktion og viser en tydelig status,
hvis en fil mangler eller ikke kan afspilles. Skift af melodi stopper altid den
igangværende afspilning.

## Test

Testene dækker bl.a. søgning/filtrering, valg af melodi, afspillerens
play/pause/stop, hastighed, loop-logik og håndtering af manglende assets:

```bash
cd web
npm test
```

## Licens og attribution

Denne app er baseret på det oprindelige jagthorn-projekt af
**Morten B. Matthiesen**, som er udgivet under **MIT-licensen**. Den fulde
oprindelige licenstekst ligger i
[`web/scripts/UPSTREAM-LICENSE`](web/scripts/UPSTREAM-LICENSE). Lyd-, video- og
nodemateriale er genbrugt fra det oprindelige projekt og tilhører de
oprindelige rettighedshavere.
