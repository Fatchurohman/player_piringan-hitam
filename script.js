// Konfigurasi Supabase
const SUPABASE_URL = 'https://nqbjtzhhizjkhmhkkatb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_sIbk3yeQLELLhqDrvc9QHQ_1qErOVjU';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false }
});

// Fungsi untuk mengambil data lagu dari tabel 'songs' Supabase
async function fetchSunoSongsFromSupabase() {
    try {
        if (typeof displayStatus !== 'undefined') {
            displayStatus.textContent = "Mengambil koleksi Suno dari Supabase...";
        }
        
        const { data, error } = await _supabase
            .from('songs')
            .select('*');

        if (error) throw error;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(song => {
                // Pastikan variabel 'tracks' array sudah ada dari HTML utama
                if (typeof tracks !== 'undefined') {
                    tracks.push({
                        title: song.title || 'Lagu Suno',
                        artist: song.artist || 'Fatchurohman',
                        type: 'file', // Menggunakan tipe file agar bisa diputar sebagai audio URL
                        url: song.audio_url // Sesuai dengan kolom di tabel songs
                    });
                }
            });

            // Perbarui tampilan playlist dan muat ulang track
            if (typeof renderPlaylist === 'function') {
                renderPlaylist();
            }
            if (typeof loadTrack === 'function' && tracks.length > 0) {
                loadTrack(currentTrackIndex);
            }
            
            if (typeof displayStatus !== 'undefined') {
                displayStatus.textContent = "Koleksi Supabase siap diputar!";
            }
        } else {
            if (typeof displayStatus !== 'undefined') {
                displayStatus.textContent = "Tabel songs masih kosong.";
            }
        }
    } catch (error) {
        console.error("Gagal koneksi Supabase:", error.message);
        if (typeof displayStatus !== 'undefined') {
            displayStatus.textContent = "Gagal memuat database.";
        }
    }
}

// Jalankan otomatis saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Beri jeda 0.5 detik agar inisialisasi utama di HTML selesai dulu
    setTimeout(() => {
        fetchSunoSongsFromSupabase();
    }, 500);
});
