# 🧮 Age Calculator — Workflow & Arsitektur

Dokumentasi lengkap alur kerja project **Age Calculator** dari awal sampai tuntas.
Cocok buat dipelajari ulang kapan saja.

---

## 📦 Tech Stack

| Teknologi | Versi | Fungsi |
|---|---|---|
| **React** | 19.2 | Library UI berbasis komponen |
| **TypeScript** | 5.9 | Superset JavaScript dengan type safety |
| **Vite** | 7.3 | Build tool & dev server (super cepat) |
| **Tailwind CSS** | 4.2 | Utility-first CSS framework |
| **Zustand** | 5.0 | State management ringan (alternatif Redux) |
| **Framer Motion** | 12.x | Library animasi deklaratif untuk React |
| **Axios** | 1.13 | HTTP client untuk panggil API |
| **React Router** | 7.13 | Client-side routing |

### Kenapa Tech Stack Ini?

- **Vite** dipilih karena jauh lebih cepat dari CRA (Create React App). Dev server langsung jalan <1 detik.
- **Zustand** dipilih karena lebih ringan & simpel dari Redux — tidak perlu boilerplate (Provider, reducer, action).
- **Tailwind CSS v4** dipilih untuk styling cepat tanpa file CSS terpisah. Langsung pakai class di JSX.
- **Axios** dipilih karena punya fitur interceptor, auto JSON parse, dan error handling yang lebih baik dari `fetch()`.

---

## 🗂 Struktur Folder

```
age-calculator/
├── index.html            ← Entry point HTML (Vite inject script di sini)
├── vite.config.ts        ← Konfigurasi Vite (plugins, dev server)
├── tsconfig.json         ← TypeScript config utama (references)
├── tsconfig.app.json     ← TS config untuk source code (src/)
├── tsconfig.node.json    ← TS config untuk config files (vite.config.ts)
├── package.json          ← Dependencies & scripts
├── eslint.config.js      ← Konfigurasi linting
├── public/
│   └── favicon.ico       ← Icon tab browser
└── src/
    ├── main.tsx          ← ⭐ Entry point React (mount App ke DOM)
    ├── App.tsx           ← ⭐ Root component + Router setup
    ├── index.css         ← Global CSS + Tailwind import
    ├── types/
    │   └── age.types.ts  ← 📝 Semua TypeScript interfaces/types
    ├── utils/
    │   └── calculateAge.ts ← 🧮 Logika hitung umur + validasi input
    ├── services/
    │   ├── api.ts        ← 🌐 Axios instance + API call ke Wikipedia
    │   └── translate.ts  ← 🌐 API call translate English → Indonesia
    ├── store/
    │   └── useAgeStore.ts ← 📊 Zustand store (global state)
    ├── pages/
    │   └── Home.tsx      ← 📄 Halaman utama (layout + compose components)
    └── components/
        ├── InputForm.tsx  ← 🖊️ Form input tanggal (Day/Month/Year)
        ├── ResultCard.tsx ← 📊 Tampilkan hasil umur (tahun/bulan/hari)
        └── HistoryFact.tsx ← 📰 Tampilkan fakta sejarah dari Wikipedia
```

---

## 🔄 Alur Kerja Lengkap (Data Flow)

### Diagram Alur

```
User buka browser
       │
       ▼
 ┌─────────────┐
 │  index.html  │ ← Vite inject <script src="/src/main.tsx">
 └──────┬───────┘
        ▼
 ┌─────────────┐
 │   main.tsx   │ ← Mount <App /> ke <div id="root">
 └──────┬───────┘
        ▼
 ┌─────────────┐
 │   App.tsx    │ ← BrowserRouter + Routes → render <Home />
 └──────┬───────┘
        ▼
 ┌─────────────┐
 │  Home.tsx    │ ← Layout halaman: background + glassmorphism card
 │  (Page)      │    Compose: <InputForm />, <ResultCard />, <HistoryFact />
 └──────┬───────┘
        ▼
  ┌─────────────────────────────────────────────────────┐
  │                    InputForm.tsx                      │
  │  1. User isi Day, Month, Year                        │
  │  2. Klik "Hitung Umur"                               │
  │  3. validateDateInput() → cek input valid             │
  │  4. calculateAge() → hitung selisih umur              │
  │  5. setResult() → simpan ke Zustand store             │
  │  6. getHistoricalEvents() → panggil Wikipedia API     │
  │  7. translateToId() → terjemahkan ke Bahasa Indonesia  │
  │  8. setHistoricalFacts() → simpan ke Zustand store    │
  └──────────────────────┬──────────────────────────────┘
                         ▼
  ┌──────────────────────────────────────────────────────┐
  │  Zustand Store (useAgeStore)                          │
  │  ┌──────────────────────────────────────────┐        │
  │  │ result: { years, months, days }           │        │
  │  │ historicalFacts: WikiEvent[]              │        │
  │  │ isLoading: boolean                        │        │
  │  │ error: string | null                      │        │
  │  └──────────────────────────────────────────┘        │
  └──────────┬───────────────────────┬───────────────────┘
             ▼                       ▼
  ┌──────────────────┐    ┌────────────────────┐
  │   ResultCard.tsx  │    │  HistoryFact.tsx    │
  │   Baca result     │    │  Baca facts, show   │
  │   dari store      │    │  loading/error/data  │
  └──────────────────┘    └────────────────────┘
```

---

## 📄 Penjelasan Tiap File

### 1. `index.html` — Entry Point HTML

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

**Apa yang terjadi:**
- Browser load file ini pertama kali
- Vite otomatis inject script `main.tsx` dengan `type="module"` (ESM)
- `<div id="root">` adalah tempat React akan me-render seluruh aplikasi
- Favicon dan meta tags didefinisikan di `<head>`

**Konsep:** Single Page Application (SPA) — hanya 1 file HTML, konten berubah lewat JavaScript.

---

### 2. `vite.config.ts` — Konfigurasi Build Tool

```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: { usePolling: true },  // Fix untuk WSL
  },
})
```

**Apa yang dilakukan:**
- `react()` → plugin agar Vite bisa proses file `.tsx` / `.jsx` (React JSX)
- `tailwindcss()` → plugin untuk Tailwind CSS v4 (versi baru pakai Vite plugin, bukan PostCSS)
- `usePolling: true` → fix khusus WSL karena WSL tidak bisa detect file changes di Windows filesystem secara native

**Konsep:** Vite menggunakan **ESBuild** untuk development (super cepat) dan **Rollup** untuk production build.

---

### 3. `src/main.tsx` — Entry Point React

```tsx
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Apa yang dilakukan:**
1. Ambil elemen `<div id="root">` dari `index.html`
2. `createRoot()` → API React 19 untuk membuat root (pengganti `ReactDOM.render()`)
3. Render `<App />` di dalam `<StrictMode>` (StrictMode = deteksi bug saat development)

**Konsep:** `createRoot` adalah React 19 Concurrent API. StrictMode akan render komponen 2x di dev mode untuk cek side effects.

---

### 4. `src/App.tsx` — Root Component + Router

```tsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Apa yang dilakukan:**
- Setup routing dengan React Router v7
- `BrowserRouter` → menggunakan HTML5 History API (URL bersih tanpa `#`)
- Saat ini hanya ada 1 route: `/` → render `<Home />`
- Kalau nanti mau tambah halaman (misal `/about`), tinggal tambah `<Route>` baru

**Konsep:** Client-side routing — navigasi antar halaman tanpa reload browser.

---

### 5. `src/index.css` — Global Styles + Tailwind

```css
@import "tailwindcss";

@utility text-shadow {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
```

**Apa yang dilakukan:**
- `@import "tailwindcss"` → import semua utility class Tailwind CSS v4
- `@utility` → cara Tailwind v4 untuk bikin custom utility class
- `text-shadow` dan `text-shadow-sm` → custom utility untuk bikin teks lebih readable di atas background image gelap

**Konsep:** Tailwind v4 tidak pakai `tailwind.config.js` lagi. Semua config via CSS dengan `@utility`, `@theme`, dll.

---

### 6. `src/types/age.types.ts` — TypeScript Interfaces

```ts
export interface AgeResult {
  years: number;
  months: number;
  days: number;
}

export interface AgeState { ... }    // Shape dari Zustand store
export interface WikiEvent { ... }   // Shape data dari Wikipedia API
export interface WikiPage { ... }    // Detail halaman Wikipedia
export interface WikiResponse { ... } // Response wrapper
export interface DateInput { ... }   // Input form (day, month, year)
```

**Apa yang dilakukan:**
- Mendefinisikan "bentuk" data yang akan dipakai di seluruh aplikasi
- `AgeResult` → output dari kalkulasi umur
- `AgeState` → bentuk state di Zustand store
- `WikiEvent`, `WikiPage`, `WikiResponse` → bentuk response dari Wikipedia API
- `DateInput` → bentuk data input form

**Konsep:** TypeScript interfaces = kontrak. Kalau kamu salah ketik property name atau salah tipe data, TypeScript langsung error sebelum runtime. Ini mencegah bug di production.

**Kenapa dipisah file?**
- Supaya bisa di-import dari mana saja tanpa circular dependency
- Single source of truth — ubah type di 1 tempat, semua file ikut update

---

### 7. `src/utils/calculateAge.ts` — Logika Hitung Umur

**Fungsi 1: `calculateAge(input: DateInput): AgeResult`**

```
Hari ini: 2026-02-26
Lahir:    2000-05-15
─────────────────────
Selisih:  25 tahun, 9 bulan, 11 hari
```

**Cara kerja:**
1. Hitung selisih year, month, day secara terpisah
2. Jika `days < 0` → pinjam 1 bulan (ambil jumlah hari bulan sebelumnya)
3. Jika `months < 0` → pinjam 1 tahun (tambah 12 bulan)
4. Return object `{ years, months, days }`

**Fungsi 2: `validateDateInput(input: DateInput): string | null`**

Validasi bertingkat:
1. Semua field harus diisi (tidak boleh 0)
2. Bulan harus 1-12
3. Hari harus 1-31
4. Hari harus valid untuk bulan tersebut (misal: Feb max 28/29)
5. Tanggal tidak boleh di masa depan
6. Tahun minimal 1900

Return `null` kalau valid, atau string error message kalau tidak valid.

**Konsep:** Pure function — tidak ada side effect, tidak akses state/API. Hanya terima input, return output. Mudah di-test.

---

### 8. `src/services/api.ts` — Axios Instance + Wikipedia API

```ts
const wikiApi = axios.create({
  baseURL: 'https://en.wikipedia.org/api/rest_v1/feed/onthisday',
  timeout: 10000,
  headers: { 'Accept': 'application/json' },
});

// Interceptor: handle error secara global
wikiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// GET /events/{MM}/{DD}
export const getHistoricalEvents = async (month, day) => { ... };
```

**Apa yang dilakukan:**
1. `axios.create()` → buat instance Axios khusus Wikipedia API dengan config default
2. `interceptors.response` → middleware yang jalan setiap response masuk. Kalau error, log ke console
3. `getHistoricalEvents()` → panggil endpoint `/events/{month}/{day}` dan return data

**Endpoint Wikipedia:**
```
GET https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/2/26
→ Return peristiwa sejarah yang terjadi di tanggal 26 Februari
```

**Konsep:**
- **Axios Instance** → buat satu konfigurasi, pakai di banyak tempat. Tidak perlu ulang-ulang baseURL
- **Interceptor** → seperti middleware Express.js, tapi untuk HTTP client. Bisa log, transform, atau redirect error secara global

---

### 9. `src/services/translate.ts` — Translate API

```ts
export const translateToId = async (text: string): Promise<string> => {
  const response = await axios.get('https://api.mymemory.translated.net/get', {
    params: { q: text, langpair: 'en|id' },
  });
  return response.data.responseData.translatedText;
};
```

**Apa yang dilakukan:**
- Terjemahkan teks English → Indonesia menggunakan **MyMemory API** (gratis, tanpa API key)
- Kalau gagal translate, return teks asli (fallback gracefully)

**API Endpoint:**
```
GET https://api.mymemory.translated.net/get?q=hello&langpair=en|id
→ { responseData: { translatedText: "halo" } }
```

**Konsep:** Graceful degradation — kalau API translate down, app tetap jalan tapi teks tampil dalam bahasa Inggris.

---

### 10. `src/store/useAgeStore.ts` — Zustand Store (Global State)

```ts
const useAgeStore = create<ExtendedAgeState>((set) => ({
  birthDate: '',
  result: null,
  historicalFacts: [],
  isLoading: false,
  error: null,
  setBirthDate: (date) => set({ birthDate: date }),
  setResult: (result) => set({ result }),
  setHistoricalFacts: (facts) => set({ historicalFacts: facts }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ birthDate: '', result: null, historicalFacts: [], ... }),
}));
```

**Apa yang dilakukan:**
- Menyimpan state global yang bisa diakses dari komponen manapun
- State: `birthDate`, `result`, `historicalFacts`, `isLoading`, `error`
- Actions: `setResult()`, `setHistoricalFacts()`, `setLoading()`, `setError()`, `reset()`

**Kenapa Zustand, bukan Redux?**

| Zustand | Redux Toolkit |
|---|---|
| ~10 baris setup | ~30+ baris (slice, store, Provider) |
| Tidak perlu Provider wrapper | Harus bungkus App dengan `<Provider>` |
| Hook-based (`useAgeStore()`) | Hook-based (`useSelector()`, `useDispatch()`) |
| Cocok untuk app kecil-menengah | Cocok untuk app besar/enterprise |

**Konsep:**
- `create()` → bikin store baru
- `set()` → update state (mirip `setState` di React, tapi global)
- Komponen yang pakai `useAgeStore()` otomatis re-render saat state berubah
- Tidak perlu `useContext`, tidak perlu prop drilling

---

### 11. `src/pages/Home.tsx` — Halaman Utama

```tsx
function Home() {
  const { result } = useAgeStore();
  return (
    <div style={{ backgroundImage: "url('...')" }}>
      <motion.div> {/* Card utama - glassmorphism */}
        <h1>Age Calculator</h1>
        <InputForm />
        {result && <ResultCard />}    {/* Conditional rendering */}
      </motion.div>
      {result && <HistoryFact />}     {/* Muncul setelah hitung */}
    </div>
  );
}
```

**Apa yang dilakukan:**
1. Set background image (digital art dari URL eksternal)
2. Render card utama dengan efek **glassmorphism** (backdrop-blur + semi-transparent background)
3. **Conditional rendering** — `ResultCard` dan `HistoryFact` hanya muncul setelah user hitung umur (`result !== null`)
4. Animasi entrance menggunakan Framer Motion (`initial` → `animate`)

**Tailwind Classes yang dipakai:**
- `bg-black/40` → background hitam 40% opacity
- `backdrop-blur-xl` → efek blur di belakang elemen (glassmorphism)
- `border-white/10` → border putih 10% opacity

**Konsep:**
- **Glassmorphism** → desain modern: background blur + transparansi + border halus
- **Conditional rendering** → `{condition && <Component />}` hanya render jika condition true

---

### 12. `src/components/InputForm.tsx` — Form Input (Komponen Terpenting!)

Ini adalah **otak** dari aplikasi. Semua logika ada di sini.

**Alur saat user klik "Hitung Umur":**

```
handleSubmit()
│
├─ 1. validateDateInput(input)
│     └─ Cek: field kosong? bulan 1-12? hari valid? masa depan?
│     └─ Kalau error → tampilkan pesan error, STOP
│
├─ 2. calculateAge(input)
│     └─ Hitung selisih tahun, bulan, hari
│     └─ setResult() → simpan ke Zustand store
│
├─ 3. setLoading(true)
│
├─ 4. getHistoricalEvents(month, day)
│     └─ Panggil Wikipedia API: /events/{MM}/{DD}
│     └─ Ambil 5 event teratas: data.events.slice(0, 5)
│
├─ 5. translateToId() untuk setiap event (paralel dengan Promise.all)
│     └─ Translate 5 fakta sekaligus, tidak satu-satu (lebih cepat!)
│
├─ 6. setHistoricalFacts(translatedEvents)
│     └─ Simpan fakta yang sudah diterjemahkan ke Zustand store
│
└─ 7. setLoading(false)
```

**Input styling:**
- Glassmorphism style: `bg-white/10`, `border-white/20`, `focus:border-pink-400`
- Number input dengan placeholder DD, MM, YYYY

**Konsep penting:**
- `async/await` → menangani operasi asinkron (API call) secara sequential
- `Promise.all()` → jalankan banyak async operation secara **paralel** (translate 5 teks sekaligus, bukan satu-satu)
- `try/catch/finally` → error handling: `try` jalankan kode, `catch` tangkap error, `finally` selalu jalan (matikan loading)

---

### 13. `src/components/ResultCard.tsx` — Tampilan Hasil Umur

```tsx
function ResultCard() {
  const { result } = useAgeStore();    // Baca dari global state
  if (!result) return null;            // Guard clause

  const items = [
    { value: result.years, singular: 'tahun', plural: 'tahun' },
    { value: result.months, singular: 'bulan', plural: 'bulan' },
    { value: result.days, singular: 'hari', plural: 'hari' },
  ];

  // Render dengan staggered animation (muncul satu-satu)
  return items.map((item, index) => (
    <motion.p delay={index * 0.15}> {/* Delay bertingkat */}
      <span className="gradient-text">{item.value}</span> {item.singular}
    </motion.p>
  ));
}
```

**Apa yang dilakukan:**
- Baca `result` dari Zustand store
- Tampilkan 3 baris: **X tahun**, **X bulan**, **X hari**
- Angka ditampilkan dengan gradient warna pink → purple
- Animasi **staggered**: setiap baris muncul dengan delay 150ms setelah baris sebelumnya

**Konsep:**
- **Guard clause** → `if (!result) return null` — cegah render kalau belum ada data
- **Staggered animation** → `delay: index * 0.15` bikin efek "cascade" yang enak dilihat

---

### 14. `src/components/HistoryFact.tsx` — Fakta Sejarah

```tsx
function HistoryFact() {
  const { historicalFacts, isLoading, error } = useAgeStore();

  if (isLoading) return <Spinner />;        // Loading state
  if (error) return <ErrorMessage />;        // Error state
  if (historicalFacts.length === 0) return null; // Empty state

  return historicalFacts.map((fact) => (
    <Card>
      <Badge>{fact.year}</Badge>
      <p>{fact.text}</p>
      <a href={fact.pages[0].content_urls...}>Baca selengkapnya →</a>
    </Card>
  ));
}
```

**Apa yang dilakukan:**
- Handle 3 state: **loading** (spinner), **error** (pesan merah), **success** (tampilkan data)
- Setiap fakta ditampilkan dalam card dengan:
  - Badge tahun (misal: `1945`)
  - Teks peristiwa (sudah diterjemahkan ke Indonesia)
  - Link ke Wikipedia untuk baca selengkapnya

**Konsep:**
- **State machine pattern** → komponen punya 3 kemungkinan state (loading / error / success)
- **Hover effect** → `whileHover={{ scale: 1.02 }}` bikin card sedikit membesar saat di-hover

---

## 🔗 Hubungan Antar File (Dependency Graph)

```
                    age.types.ts (semua interface)
                   ╱      |       ╲
                  ╱       |        ╲
    calculateAge.ts   useAgeStore.ts   api.ts
          |               |             |
          └──────┬────────┘        translate.ts
                 |                      |
                 ▼                      |
            InputForm.tsx ◄─────────────┘
                 |
        useAgeStore.ts (baca/tulis state)
           ╱          ╲
     ResultCard.tsx   HistoryFact.tsx  (baca state)
           ╲          ╱
            Home.tsx (compose semua components)
               |
            App.tsx (routing)
               |
            main.tsx (mount ke DOM)
```

---

## ⚡ Teknik & Pattern yang Digunakan

### 1. Component Composition
Home.tsx tidak berisi logic — hanya **menyusun** komponen lain. Logic ada di masing-masing komponen.

### 2. Global State (Zustand)
State disimpan di satu tempat (`useAgeStore`), bisa diakses dari komponen manapun tanpa prop drilling.

### 3. Separation of Concerns
- `types/` → definisi tipe data
- `utils/` → pure functions (kalkulasi, validasi)
- `services/` → API calls (external communication)
- `store/` → state management
- `components/` → UI components
- `pages/` → page-level layout

### 4. Graceful Error Handling
- `validateDateInput()` → validasi sebelum proses
- `interceptors` → log error API secara global
- `try/catch` → tangkap error saat fetch
- `translateToId()` → fallback return teks asli jika translate gagal

### 5. Parallel Async (Promise.all)
5 teks diterjemahkan **sekaligus**, bukan satu-satu. Dari ~5 detik jadi ~1 detik.

### 6. Conditional Rendering
`ResultCard` dan `HistoryFact` hanya muncul setelah user submit form.

### 7. Staggered Animations
Elemen muncul satu-satu dengan delay bertingkat, menciptakan efek visual yang premium.

---

## 🚀 Cara Jalankan

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
# → Buka http://localhost:5173

# Build production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Checklist Fitur

- [x] Input tanggal lahir (Day, Month, Year)
- [x] Validasi input (field kosong, range invalid, masa depan)
- [x] Hitung umur (tahun, bulan, hari)
- [x] Ambil fakta sejarah dari Wikipedia API
- [x] Terjemahkan fakta ke Bahasa Indonesia
- [x] Animasi entrance & staggered reveal
- [x] Glassmorphism UI dengan background image
- [x] Responsive design (mobile + desktop)
- [x] Error handling & loading state
- [x] Custom favicon
