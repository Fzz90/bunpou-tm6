# Bunpou — ～ております & ～でございます

Presentasi web 6 slide untuk **Faiz Syihab · NIM 125241046 · Kelas A**.

## Buka presentasi

Buka `index.html` dengan Chrome, Edge, atau Firefox. Tidak perlu instalasi atau build. Font presentasi dimuat dari Google Fonts saat koneksi internet tersedia; jika offline, browser memakai Georgia untuk Latin dan Yu Gothic / Meiryo untuk Jepang.

Untuk server lokal, jalankan dari folder ini:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Kemudian buka `http://127.0.0.1:4173`.

## Isi

1. Sampul: kedua bunpou dan identitas presenter.
2. Arti, makna, fungsi, serta perbedaan penggunaan.
3. Rumus kata kerja, kata benda, dan kata sifat な.
4. Empat contoh dengan konteks, romaji, dan terjemahan Indonesia.
5. Empat latihan transformasi bertahap, dengan lima jawaban yang muncul berurutan.
6. Terima kasih.

## Kontrol

- Tombol panah kiri/kanan, Page Up/Page Down: berpindah slide.
- Home/End: slide pertama/terakhir.
- F: masuk/keluar layar penuh, jika didukung browser.
- Ponsel: tombol navigasi atau geser horizontal. Konten mengalir vertikal agar tetap terbaca.
- Pada slide latihan, tekan next sekali untuk menampilkan jawaban dengan animasi. Tekan next lagi untuk menuju penutup. Previous menyembunyikan jawaban sebelum kembali ke slide contoh.
- Pengaturan sistem untuk mengurangi animasi dihormati.

## PDF, nanti

CSS cetak sudah disiapkan untuk **6 halaman 16:9, ukuran 320 × 180 mm**. Tidak ada PDF presentasi yang dibuat pada tahap ini.

Ketika ekspor diminta nanti, gunakan print browser, simpan sebagai PDF, aktifkan background graphics, nonaktifkan header/footer browser, dan gunakan ukuran halaman CSS atau custom 320 × 180 mm. Empat latihan muncul bersama di halaman kelima. Jika jawaban sedang terbuka saat print dipanggil, jawabannya ikut tercetak. Periksa pratinjau cetak karena tiap browser dapat menangani ukuran halaman kustom secara berbeda.

## GitHub Pages

Repository: [Fzz90/bunpou-tm6](https://github.com/Fzz90/bunpou-tm6).

Situs: [fzz90.github.io/bunpou-tm6](https://fzz90.github.io/bunpou-tm6/).

Situs berupa HTML/CSS/JavaScript statis dan diterbitkan dari root branch `main`. `.qa/` berisi bukti pemeriksaan lokal dan diabaikan Git.

## Rujukan

- Agency for Cultural Affairs, Japan: [敬語の指針, Bab II](https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/keigo_tosin.pdf). Dasar klasifikasi おる sebagai 謙譲語Ⅱ（丁重語）dan ございます sebagai 丁寧語.
- Penjelasan Indonesia, contoh, dan latihan disusun untuk materi ini. ～ております mempertahankan makna aspek dari ～ている; terjemahan bergantung pada konteks. Untuk tindakan guru atau pelanggan yang dihormati, ～ていらっしゃいます merupakan pilihan sonkeigo yang sesuai.
- Font: Gentium Book Plus untuk teks Latin dan Huninn untuk teks Jepang, dimuat lewat Google Fonts pada import di `styles.css`.

## File

- `index.html`: struktur dan isi enam slide.
- `styles.css`: desain, responsive layout, animasi, serta media print.
- `app.js`: navigasi, fullscreen, dan latihan.
- `assets/`: favicon; arsip font lokal lama tetap ada tetapi tidak lagi direferensikan.
- `DESIGN.md`: konsep dan keputusan desain.

Tidak menggunakan framework, analytics, atau layanan AI saat presentasi berjalan. Google Fonts menjadi satu-satunya aset eksternal.
