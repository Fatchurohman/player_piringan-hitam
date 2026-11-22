// Konfigurasi Repo GitHub
const GITHUB_USER = "Fatchurohman";
const GITHUB_REPO = "lagu-suno-kreasiku";
const JSON_PATH = "songs.json";

async function loadTracksFromGitHub() {
    const branches = ["main", "master"];
    let lastError = "";

    displayTitle.textContent = "Memuat lagu dari GitHub...";
    displayStatus.textContent = "Syncing Repository";

    for (const branch of branches) {
        const baseRawUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${branch}/`;
        try {
            const response = await fetch(`${baseRawUrl}${JSON_PATH}?t=${Date.now()}`);
            if (!response.ok) {
                lastError = `HTTP ${response.status} (${branch})`;
                continue;
            }

            const data = await response.json();
            const list = Array.isArray(data) ? data : (data.songs || data.tracks || data.data || []);

            if (list.length === 0) {
                throw new Error("Daftar lagu di songs.json kosong");
            }

            tracks = list.map((item, idx) => {
                let rawUrl = item.url || item.audio || item.audio_url || item.src || "";
                if (rawUrl && !rawUrl.startsWith("http")) {
                    rawUrl = baseRawUrl + encodeURI(rawUrl.replace(/^\/+/, ""));
                }

                return {
                    title: item.title || item.judul || `Track ${idx + 1}`,
                    artist: item.artist || item.artis || "fatur62",
                    type: "file",
                    url: rawUrl
                };
            }).filter(t => t.url);

            if (tracks.length === 0) {
                throw new Error("Format URL audio di songs.json tidak terbaca");
            }

            currentTrackIndex = 0;
            loadTrack(0);
            displayStatus.textContent = `Ready • ${tracks.length} Lagu dimuat`;
            return; // Berhasil, hentikan loop
        } catch (error) {
            lastError = error.message;
        }
    }

    console.error("Gagal memuat dari GitHub:", lastError);
    displayTitle.textContent = "Gagal Memuat Lagu";
    displayStatus.textContent = lastError;
}

document.addEventListener("DOMContentLoaded", loadTracksFromGitHub);
