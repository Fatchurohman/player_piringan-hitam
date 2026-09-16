// Konfigurasi Supabase
const SUPABASE_URL = 'https://nqbjtzhhizjkhmhkkatb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_sIbk3yeQLELLhqDrvc9QHQ_1qErOVjU';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false }
});

async function fetchSunoSongsFromSupabase() {
    try {
        const displayStatusElem = document.getElementById('displayStatus');
        if (displayStatusElem) {
            displayStatusElem.textContent = "Mengambil koleksi Suno dari Supabase...";
        }
        
        const { data, error } = await _supabase
            .from('songs')
            .select('*');

        if (error) throw error;

        if (Array.isArray(data) && data.length > 0) {
            // Langsung masukkan data ke variabel tracks global
            tracks = data.map(song => ({
                title: song.title || 'Lagu Suno',
                artist: song.artist || 'Fatchurohman',
                type: 'file',
                url: song.audio_url
            }));

            currentTrackIndex = 0;
            
            if (typeof renderPlaylist === 'function') {
                renderPlaylist();
            }
            if (typeof loadTrack === 'function') {
                loadTrack(0);
            }
            
            if (displayStatusElem) {
                displayStatusElem.textContent = "Koleksi Supabase siap diputar!";
            }
        } else {
            if (displayStatusElem) {
                displayStatusElem.textContent = "Tabel songs masih kosong.";
            }
        }
    } catch (error) {
        console.error("Gagal koneksi Supabase:", error);
        const displayStatusElem = document.getElementById('displayStatus');
        if (displayStatusElem) {
            displayStatusElem.textContent = "Gagal memuat database.";
        }
    }
}

// Jalankan otomatis saat script dimuat
window.addEventListener('DOMContentLoaded', () => {
    fetchSunoSongsFromSupabase();
});
