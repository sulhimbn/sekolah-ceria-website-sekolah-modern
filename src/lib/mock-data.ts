export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  imageUrl?: string;
}
export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'Sekolah Ceria Meraih Juara 1 Lomba Sains Nasional',
    date: '15 Juli 2024',
    author: 'Tim Jurnalistik',
    excerpt: 'Siswa-siswi kami berhasil menunjukkan prestasi gemilang dalam kompetisi sains tingkat nasional, membawa pulang medali emas.',
  },
  {
    id: '2',
    title: 'Peringatan Hari Kemerdekaan ke-79 di Sekolah Ceria',
    date: '17 Agustus 2024',
    author: 'OSIS Sekolah Ceria',
    excerpt: 'Berbagai lomba dan kegiatan seru diadakan untuk memeriahkan HUT RI, menumbuhkan semangat nasionalisme.',
  },
  {
    id: '3',
    title: 'Workshop Coding untuk Siswa SMP',
    date: '02 September 2024',
    author: 'Klub STEM',
    excerpt: 'Bekerja sama dengan praktisi industri, kami mengadakan workshop coding untuk mengenalkan siswa pada dunia teknologi.',
  },
  {
    id: '4',
    title: 'Pentas Seni Akhir Tahun: Spektakuler!',
    date: '10 Desember 2024',
    author: 'Tim Kesenian',
    excerpt: 'Siswa dari berbagai tingkatan menampilkan bakat mereka dalam acara pentas seni yang meriah dan penuh kreativitas.',
  },
  {
    id: '5',
    title: 'Program Bakti Sosial ke Panti Asuhan',
    date: '22 Desember 2024',
    author: 'OSIS Sekolah Ceria',
    excerpt: 'Sebagai bentuk kepedulian, siswa-siswi menggalang dana dan memberikan bantuan kepada anak-anak di panti asuhan.',
  },
  {
    id: '6',
    title: 'Penerimaan Siswa Baru Tahun Ajaran 2025/2026 Dibuka',
    date: '05 Januari 2025',
    author: 'Panitia PSB',
    excerpt: 'Jadilah bagian dari keluarga besar Sekolah Ceria! Pendaftaran untuk tahun ajaran baru telah resmi dibuka.',
  },
];