# Sekolah Ceria: Website Sekolah Modern

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sulhimbn/sekolah-ceria-website-sekolah-modern)

Website sekolah yang fungsional dan menawan dengan gaya ilustratif, menampilkan informasi lengkap dan portal berita dinamis.

Sekolah Ceria adalah sebuah platform website sekolah yang lengkap, modern, dan fungsional, dirancang dengan gaya visual ilustratif yang hangat dan menyenangkan. Aplikasi ini bertujuan untuk menjadi pusat informasi utama bagi calon siswa, siswa aktif, orang tua, dan staf.

## Key Features

- **Desain Modern & Ilustratif**: Tampilan visual yang hangat, personal, dan menyenangkan untuk mencerminkan semangat ceria sekolah.
- **Informasi Lengkap**: Halaman-halaman komprehensif termasuk Beranda, Tentang Kami, Akademik, Pendaftaran, dan Kontak.
- **Portal Berita Dinamis**: Ditenagai oleh Cloudflare Workers dan Durable Objects, memungkinkan staf untuk mempublikasikan berita dan acara dengan mudah.
- **Pengalaman Pengguna Intuitif**: Navigasi yang mudah dan alur pengguna yang mulus di seluruh situs.
- **Sepenuhnya Responsif**: Desain yang sempurna di semua perangkat, dari desktop hingga ponsel.
- **Interaksi Halus**: Animasi dan transisi yang halus untuk pengalaman pengguna yang lebih baik.

## Technology Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Hono on Cloudflare Workers
- **Penyimpanan**: Cloudflare Durable Objects
- **Bahasa**: TypeScript
- **Validasi Skema**: Zod
- **Package Manager**: Bun

## Getting Started

Untuk menjalankan proyek ini secara lokal, Anda memerlukan Bun dan Git yang terinstal di mesin Anda.

### Instalasi

1.  **Clone repositori:**

    ```bash
    git clone <repository-url>
    cd sekolah_ceria
    ```

2.  **Instal dependensi:**
    Proyek ini menggunakan Bun sebagai package manager.

    ```bash
    bun install
    ```

3.  **Konfigurasi environment:**
    Salin file `.env.example` ke `.env` dan sesuaikan nilai-nilainya:
    ```bash
    cp .env.example .env
    ```

## Development

Untuk memulai server pengembangan lokal, jalankan perintah berikut. Ini akan menjalankan frontend Vite dan backend Worker secara bersamaan.

```bash
bun dev
```

Aplikasi akan tersedia di `http://localhost:3000` (atau port lain yang tersedia).

## Build

Untuk membangun aplikasi untuk produksi:

```bash
bun run build
```

Ini akan mengompilasi frontend dan menjalankan analisis bundle size.

## Linting & Formatting

Untuk memeriksa dan memperbaiki kode:

```bash
# Lint (cek error saja)
bun run lint

# Lint & fix otomatis
bun run lint:fix

# Format kode
bun run format

# Cek format saja
bun run format:check
```

## Testing

Proyek ini menggunakan Vitest untuk unit testing dan Playwright untuk e2e testing.

```bash
# Unit tests (watch mode)
bun test

# Unit tests (single run)
bun run test:run

# Unit tests dengan coverage
bun run test:coverage

# E2E tests
bun run test:e2e

# E2E tests dengan UI
bun run test:e2e:ui
```

## Project Structure

- `src/`: Berisi semua kode frontend aplikasi React, termasuk halaman, komponen, dan hooks.
- `worker/`: Berisi kode backend Cloudflare Worker yang dibangun dengan Hono, termasuk rute API dan logika entitas.
- `shared/`: Berisi tipe TypeScript yang dibagikan antara frontend dan backend untuk memastikan konsistensi data.

## Deployment

Proyek ini dirancang untuk di-deploy ke Cloudflare Pages & Workers.

1.  **Login ke Wrangler:**
    Jika ini adalah pertama kalinya Anda, otentikasi dengan akun Cloudflare Anda.

    ```bash
    npx wrangler login
    ```

2.  **Deploy aplikasi:**
    Jalankan skrip deploy untuk membangun aplikasi dan menerbitkannya ke Cloudflare.
    ```bash
    bun deploy
    ```

Atau, deploy dengan satu klik menggunakan tombol di bawah ini.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sulhimbn/sekolah-ceria-website-sekolah-modern)
