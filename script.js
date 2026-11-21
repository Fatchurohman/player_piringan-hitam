// Konfigurasi Repo GitHub
const GITHUB_USER = "Fatchurohman";
const GITHUB_REPO = "kreasi-lagu-suno"; // Sesuaikan dengan nama repo persisnya
const BRANCH = "main";
const JSON_PATH = "songs.json"; // Sesuaikan nama file JSON-nya (misal: data.json / tracks.json)

const BASE_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/`;

async function loadTracksFromGitHub() {
    try {
        displayTitle.textContent = "Memuat lagu dari GitHub...";
        displayStatus.textContent = "Syncing Repository";

        // Tambah timestamp agar tidak kena cache browser
        const response = await fetch(`${BASE_RAW_URL}${JSON_PATH}?t=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: File JSON tidak ditemukan`);

        const data = await response.json();
        // Mendukung format array langsung [...] atau objek { songs: [...] } / { tracks: [...] }
        const list = Array.isArray(data) ? data : (data.songs || data.tracks || data.data || []);

        if (list.length === 0) {
            throw new Error("Daftar lagu di JSON kosong");
        }

        tracks = list.map((item, idx) => {
            // Sesuaikan nama properti URL audio (url / audio / src / audio_url)
            let rawUrl = item.url || item.audio || item.audio_url || item.src || "";
            
            // Jika URL masih relatif (bukan http/https), gabungkan dengan BASE_RAW_URL
            if (rawUrl && !rawUrl.startsWith("http")) {
                rawUrl = BASE_RAW_URL + encodeURI(rawUrl.replace(/^\/+/, ""));
            }

            return {
                title: item.title || item.judul || `Track ${idx + 1}`,
                artist: item.artist || item.artis || "fatur62",
                type: "file",
                url: rawUrl
            };
        }).filter(t => t.url);

        currentTrackIndex = 0;
        loadTrack(0);
        displayStatus.textContent = `Ready • ${tracks.length} Lagu dimuat`;
    } catch (error) {
        console.error("Gagal memuat dari GitHub:", error);
        displayTitle.textContent = "Gagal Memuat Lagu";
        displayStatus.textContent = error.message;
    }
}

document.addEventListener("DOMContentLoaded", loadTracksFromGitHub);
