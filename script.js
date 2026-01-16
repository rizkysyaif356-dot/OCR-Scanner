    const GAS_URL = 'https://script.google.com/macros/s/AKfycbwzQbS_lRWpM3VW5JJgLmo7cCBktdQcleDVadu6ymk_t_AFnnfOCcLkg79SWWg9w3BF/exec';
    const API_KEY ="AIzaSyASnvHC0RaGATr5hKAadn8ySoXbAIpebNc";

    function toggleSidebar() { document.getElementById("mySidebar").classList.toggle("active"); }

function showSection(id) {
    // 1. Sembunyikan SEMUA section
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; // Paksa sembunyi lewat style inline
    });

    // 2. Tampilkan Target
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block'; // Paksa tampil
    }

    // 3. Logic Sidebar & Pelengkap
    const sidebar = document.getElementById("mySidebar");
    if(sidebar.classList.contains('active')) toggleSidebar();
    
    if (id === 'pelengkap') fetchPelengkap();
    if (id === 'kesalahan') fetchKesalahan();
    if (id !== 'togel') {
        document.getElementById('pasaranSelect').value = "";
    }
    if (window.innerWidth <= 768) {
        document.getElementById("mySidebar").classList.remove("active");
    }
}
// Jalankan saat window selesai dimuat
window.addEventListener('load', function() {
    // --- BAGIAN 1: MENAMPILKAN JAM & TANGGAL (Tetap Ada) ---
    const d = new Date();
    
    // Format Tanggal
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = d.toLocaleDateString('id-ID', options); // Gunakan id-ID agar hari jadi bahasa Indonesia
    
    // Update elemen HTML
    const dateDisplay = document.getElementById('display-date');
    if (dateDisplay) {
        dateDisplay.innerText = dateString;
    }

    // --- BAGIAN 2: LOGIKA PENGECEKAN ABSEN (Otomatis) ---
    const today = d.toDateString(); // Contoh: "Mon Dec 29 2025"
    const lastAbsen = localStorage.getItem('lastAbsenDate');

    if (lastAbsen === today) {
        console.log("Status: Sudah absen hari ini. Membuka akses...");
        
        // Buka gembok menu di sidebar
        document.querySelectorAll('.menu-item.locked').forEach(item => {
            item.classList.remove('locked');
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            item.style.filter = 'none';
        });
        
        // Opsional: Jika ingin tombol absen di halaman absen berubah jadi "SUDAH ABSEN"
        const btnAbsen = document.querySelector('.btn-absen');
        if (btnAbsen) {
            btnAbsen.innerHTML = "✅ ANDA SUDAH ABSEN HARI INI";
            btnAbsen.style.background = "#95a5a6";
            btnAbsen.disabled = true;
        }
    }
    // Tambahkan ini jika ingin jam di Welcome Screen bergerak terus
setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID');
    // Jika ada elemen id="display-time", jam akan muncul di sana
    const timeDisplay = document.getElementById('display-time');
    if (timeDisplay) timeDisplay.innerText = timeString;
}, 1000);
});

// --- KONFIGURASI LOGIN ---
const VALID_USER = "master";  // ID yang benar
const VALID_PASS = "1";   // Password yang benar

function attemptLogin() {
    const idInput = document.getElementById('login-id');
    const passInput = document.getElementById('login-pass');
    const btnLogin = document.getElementById('btn-login');
    const loader = document.getElementById('loader-koneksi');
    const loginForm = document.querySelector('.login-form');

    if (idInput.value === VALID_USER && passInput.value === VALID_PASS) {
        
        // 1. Tampilkan Alert Sukses Terlebih Dahulu
        Swal.fire({
            title: 'ACCESS GRANTED',
            text: 'Identitas terverifikasi. Menghubungkan ke server...',
            icon: 'success',
            background: '#1a1a1a',
            color: '#fff',
            showConfirmButton: false,
            timer: 2000, // Alert tampil selama 2 detik
            timerProgressBar: true
        }).then(() => {
            // 2. SETELAH ALERT SELESAI, Tampilkan Loading Screen
            if(loginForm) loginForm.style.display = 'none'; // Sembunyikan form
            if(loader) loader.style.display = 'block';     // Munculkan progress bar
            
            // 3. Jalankan proses loading (2 detik) lalu masuk sistem
            setTimeout(() => {
                lanjutkanKeSistem();
            }, 2000);
        });

    } else {
        // --- JIKA GAGAL ---
        Swal.fire({
            title: 'ACCESS DENIED',
            text: 'ID Agen atau Passcode salah!',
            icon: 'error',
            background: '#1a1a1a',
            color: '#fff',
            confirmButtonColor: '#f1c40f'
        });
        
        // Efek shake pada input
        const inputs = document.querySelectorAll('.input-group input');
        inputs.forEach(input => {
            input.classList.add('error-shake');
            setTimeout(() => input.classList.remove('error-shake'), 500);
        });
    }
}

// Fungsi Penghubung ke Logic Lama (Absensi & Scanner)
function lanjutkanKeSistem() {
    const overlay = document.getElementById('welcome-overlay');
    
    // Efek menghilang
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';

    setTimeout(() => {
        overlay.style.display = 'none';

        // --- MASUK KE LOGIKA ABSENSI ANDA YANG SEBELUMNYA ---
        const today = new Date().toDateString();
        const lastAbsen = localStorage.getItem('lastAbsenDate');

        if (lastAbsen === today) {
            // Jika sudah absen hari ini -> Langsung ke Scanner
            showSection('scanner');
            // Pastikan sidebar terbuka
            document.querySelectorAll('.menu-item.locked').forEach(item => {
                item.classList.remove('locked');
                item.style.pointerEvents = 'auto';
                item.style.filter = 'none';
                item.style.opacity = '1';
            });
        } else {
            // Jika belum absen -> Ke halaman Absen
            showSection('absensi');
        }
    }, 800);
}

// Tambahan: Tekan Enter untuk Login
document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        // Cek apakah overlay masih tampil
        const overlay = document.getElementById('welcome-overlay');
        if (overlay && overlay.style.display !== 'none') {
            attemptLogin();
        }
    }
});

function selesaikanAbsen() {
    const btn = document.querySelector('.btn-absen');
    const today = new Date().toDateString();

    if(btn) btn.innerHTML = "⏳ Mengirim Data...";
    
    const payload = {
        action: "absen",
        nama: "MASTER"
    };

    fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(() => {
        console.log("Absensi terkirim ke Cloud");
    }).catch(err => console.error("Gagal kirim absen:", err));

    localStorage.setItem('lastAbsenDate', today);

Swal.fire({
        title: 'Absensi Berhasil!',
        text: 'Data Anda telah tercatat di Google Sheet.',
        icon: 'success',
        background: 'rgba(26, 26, 26, 0.95)',
        color: '#fff',
        confirmButtonText: 'Buka Dashboard',
        confirmButtonColor: '#27ae60'
    }).then((result) => {
        if (result.isConfirmed) {
            // Buka Gembok & Pindah Section
            document.querySelectorAll('.menu-item.locked').forEach(item => {
                item.classList.remove('locked');
                item.style.filter = 'none';
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
            });
            showSection('scanner');
        }
    });
}

    // --- LOGIKA COPY ---
function copyText(text, btnElement) {
    if (!text) return;

    // Cara Modern
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            updateBtnStatus(btnElement);
        }).catch(err => {
            console.error("Gagal Copy:", err);
            fallbackCopy(text, btnElement);
        });
    } else {
        fallbackCopy(text, btnElement);
    }
}

// Fungsi Cadangan jika navigator.clipboard tidak didukung/gagal
function fallbackCopy(text, btnElement) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Hindari scroll ke bawah
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        updateBtnStatus(btnElement);
    } catch (err) {
        alert("Gagal copy, silakan copy manual.");
    }
    document.body.removeChild(textArea);
}

function updateBtnStatus(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = ''; // Kembali ke warna asal CSS
    }, 1500);
}

    function copyResultText() {
        const text = document.getElementById('outputText').textContent;
        copyText(text, document.getElementById('copyBtn'));
    }

// --- FETCH PELENGKAP (VERSI BERSIH) ---
async function fetchPelengkap() {
    const tableBody = document.getElementById('pelengkapTableBody');
    tableBody.innerHTML = "<tr><td colspan='3' style='text-align:center'>Memuat data operasional...</td></tr>";
    try {
        const response = await fetch(GAS_URL + "?type=pelengkap&t=" + new Date().getTime());
        const rawData = await response.json();
        
        // --- LOGIKA FILTER BARIS KOSONG ---
        // Menghapus data yang kolom kendala & penjelasannya kosong
        const data = rawData.filter(item => 
            item.kendala.toString().trim() !== "" || 
            item.penjelasan.toString().trim() !== ""
        );

        tableBody.innerHTML = "";
        
        data.forEach(item => {
            tableBody.innerHTML += `<tr>
                <td style="vertical-align: middle;"><b style="color:#2ecc71">${item.kendala}</b></td>
                <td>
                    <div style="max-height: 100px; overflow-y: auto; font-size: 12px; line-height: 1.4; color: #ecf0f1;">
                        ${item.penjelasan}
                    </div>
                </td>
                <td style="vertical-align: middle; text-align: center;">
                    <button class="btn-copy-table" 
                        onclick="copyText(\`${item.penjelasan.replace(/"/g, '&quot;')}\`, this)">
                        Copy
                    </button>
                </td>
            </tr>`;
        });
    } catch (e) { 
        tableBody.innerHTML = "<tr><td colspan='3' style='text-align:center;color:red'>Gagal koneksi Cloud.</td></tr>"; 
    }
}

// --- FETCH KESALAHAN OPERASIONAL (DATA DARI SHEET BERBEDA) ---
async function fetchKesalahan() {
    document.getElementById('searchKesalahan').value = "";
    const tableBody = document.getElementById('kesalahanTableBody');
    tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center'>Mengambil data...</td></tr>";
    
    try {
        const response = await fetch(GAS_URL + "?type=kesalahan&t=" + new Date().getTime());
        const data = await response.json();
        
        tableBody.innerHTML = "";
        
        data.forEach(item => {
            const ssContent = item.ss ? item.ss.toString() : "";
            
            tableBody.innerHTML += `
            <tr style="font-size: 11px;">
                <td>${item.tanggal || '-'}</td>
                <td>${item.nama || '-'}</td>
                <td style="text-align: center;">
                    ${ssContent ? `
                        <button class="btn-copy-table" onclick="copyText(\`${ssContent.replace(/"/g, '&quot;')}\`, this)">
                            <i class="fas fa-copy"></i>
                        </button>
                    ` : '-'}
                </td>
                <td style="color: var(--primary-gold); font-weight: bold;">${item.jenis || '-'}</td>
                </tr>`;
        });
    } catch (e) { 
        tableBody.innerHTML = `<tr><td colspan='4' style='text-align:center;color:#e74c3c'>Gagal: ${e.message}</td></tr>`; 
    }
}
    // --- LOGIKA OCR ---
    function updateAiAssistant(type, message) {
    const assistant = document.getElementById('ai-assistant');
    const robot = document.getElementById('ai-robot');
    const bubble = document.getElementById('ai-bubble');

    bubble.textContent = message;
    
    // Reset Class
    robot.className = "robot-icon";
    bubble.style.background = "#2c3e50";

    if (type === 'error') {
        robot.classList.add('panic-mode');
        bubble.style.background = "#e74c3c"; // Merah
    } else if (type === 'success') {
        robot.classList.add('happy-mode');
        bubble.style.background = "#27ae60"; // Hijau
        // Kembali normal setelah 3 detik
        setTimeout(() => { robot.className = "robot-icon"; }, 3000);
    }
}

async function runOcr(file) {
    const statusEl = document.getElementById('status');
    const outputEl = document.getElementById('outputText');
    
    updateAiAssistant('normal', 'Sedang meneliti gambar...');

    try {
        const worker = await Tesseract.createWorker('eng');
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789',
        });

        const { data: { text, confidence } } = await worker.recognize(file);
        await worker.terminate();

        const cleanedResult = text.replace(/\D/g, '');

        // LOGIKA PENDETEKSI OTOMATIS
        if (cleanedResult.length < 15) {
            // DETEKSI: Angka terlalu sedikit (kemungkinan gambar blur/crop salah)
            updateAiAssistant('error', 'Waduh, angkanya kurang lengkap! Coba screenshot ulang.');
            outputEl.textContent = "Gagal Deteksi";
        } 
        else if (confidence < 80) {
            // DETEKSI: AI ragu-ragu (gambar kurang tajam)
            updateAiAssistant('error', 'Gambarnya agak blur nih, AI ragu membaca. Coba zoom dikit!');
            outputEl.textContent = cleanedResult;
        } 
        else {
            // DETEKSI: Kualitas Bagus
            updateAiAssistant('success', 'MANTAP! Kualitas tajam, data berhasil disalin.');
            outputEl.textContent = cleanedResult;
            addToHistory(cleanedResult);
            saveToCloud(cleanedResult);
        }

    } catch (err) {
        updateAiAssistant('error', 'Sistem error, refresh halamannya ya!');
    }
}
    // --- LOGIKA HISTORY (VERSI GALAK) ---
    function addToHistory(code) {
        let data = JSON.parse(localStorage.getItem('ocr_history')) || [];
        data.unshift({ time: new Date().toLocaleTimeString(), code: code });
        localStorage.setItem('ocr_history', JSON.stringify(data.slice(0, 15)));
        renderHistory();
    }

    function renderHistory() {
        const list = document.getElementById('historyList');
        const data = JSON.parse(localStorage.getItem('ocr_history')) || [];
        if (data.length === 0) {
            list.innerHTML = "<p style='color:#666; font-size:12px; text-align:center;'>Belum ada riwayat.</p>";
            return;
        }
        list.innerHTML = data.map(item => `
            <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid var(--primary-gold); display:flex; justify-content:space-between; align-items:center;">
                <div><small style="color:#aaa;">${item.time}</small><br><strong>${item.code}</strong></div>
                <button class="btn-copy-table" onclick="copyText('${item.code}', this)">Copy</button>
            </div>
        `).join('');
    }

    async function clearAllHistory() {
        if (!confirm("Hapus semua riwayat permanen (Cloud & Lokal)?")) return;
        
        // Bersihkan Lokal
        localStorage.removeItem('ocr_history');
        renderHistory();
        
        // Bersihkan Cloud (Sesuai action di GAS)
        try {
            await fetch(GAS_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'clear' }) });
            alert("History dibersihkan!");
        } catch (e) { console.error("Cloud clear failed"); }
    }

    // --- KALKULATOR ---
    let calcInput = "";
    function inputCalc(v) { calcInput += v; document.getElementById('calcDisplay').value = calcInput; }
    function clearCalc() { calcInput = ""; document.getElementById('calcDisplay').value = ""; }
    function delCalc() { calcInput = calcInput.slice(0,-1); document.getElementById('calcDisplay').value = calcInput; }
    function calculateResult() {
        try { calcInput = eval(calcInput).toString(); document.getElementById('calcDisplay').value = calcInput; }
        catch { document.getElementById('calcDisplay').value = "Error"; calcInput = ""; }
    }

    // Event Listeners
    document.getElementById('imageInput').onchange = e => {
        const file = e.target.files[0];
        if(file) {
            document.getElementById('uploadedImage').src = URL.createObjectURL(file);
            document.getElementById('uploadedImage').style.display = 'block';
            runOcr(file);
        }
    };

    document.body.onpaste = e => {
        const item = Array.from(e.clipboardData.items).find(x => x.type.indexOf('image') !== -1);
        if (item) {
            const file = item.getAsFile();
            document.getElementById('uploadedImage').src = URL.createObjectURL(file);
            document.getElementById('uploadedImage').style.display = 'block';
            runOcr(file);
        }
    };

    function bukaSemuaLink() {
        const links = ['https://bk.augipt.com/depobos', 'https://bonussmb.com/tickets', 'https://depobos.idrbo1.com', 'https://admin.deposmb.com'];
        links.forEach(url => window.open(url, '_blank'));
    }
// 1. Template Pesan Sesuai Aturan
const messageTemplates = {
  'Hadiah 4D Full': '🎉 Untuk Hadiah 4D jenis betingan Full, kemenangan anda adalah {value}.',
  'Hadiah 3D Full': '🎉 Untuk Hadiah 3D jenis betingan Full, kemenangan anda adalah {value}.',
  'Hadiah 2D Full': '🎉 Untuk Hadiah 2D jenis betingan Full, kemenangan anda adalah {value}.',
  'Hadiah 4D Diskon': '🎉 Untuk Hadiah 4D jenis betingan Diskon, kemenangan anda adalah {value}.',
  'Hadiah 3D Diskon': '🎉 Untuk Hadiah 3D jenis betingan Diskon, kemenangan anda adalah {value}.',
  'Hadiah 2D Diskon': '🎉 Untuk Hadiah 2D Belakang jenis betingan Diskon, kemenangan anda adalah {value}.',
  'Hadiah 2D Depan & Tengah': '🎉 Untuk Hadiah 2D (Depan & Tengah), kemenangan anda adalah {value}.',
  'Hadiah 4D BB Tepat': '🎉 Untuk Hadiah 4D jenis betingan BB Tepat, kemenangan anda adalah {value}.',
  'Hadiah 3D BB Tepat': '🎉 Untuk Hadiah 3D jenis betingan BB Tepat, kemenangan anda adalah {value}.',
  'Hadiah 2D BB Tepat': '🎉 Untuk Hadiah 2D jenis betingan BB Tepat, kemenangan anda adalah {value}.',
  'Hadiah 4D BB Tidak Tepat': '🎉 Untuk Hadiah 4D jenis betingan BB Tidak Tepat, kemenangan anda adalah {value}.',
  'Hadiah 3D BB Tidak Tepat': '🎉 Untuk Hadiah 3D jenis betingan BB Tidak Tepat, kemenangan anda adalah {value}.',
  'Hadiah 2D BB Tidak Tepat': '🎉 Untuk Hadiah 2D jenis betingan BB Tidak Tepat, kemenangan anda adalah {value}.',
  'Hadiah 4D Prize1':  '🎉 Untuk Hadiah 4D jenis betingan Prize1, kemenangan anda adalah {value}.',
  'Hadiah 3D Prize1': '🎉 Untuk Hadiah 3D jenis betingan Prize1, kemenangan anda adalah {value}.',
  'Hadiah 2D Prize1': '🎉 Untuk Hadiah 2D jenis betingan Prize1, kemenangan anda adalah {value}.',
  'Hadiah 4D Prize2': '🎉 Untuk Hadiah 4D jenis betingan Prize2, kemenangan anda adalah {value}.',
  'Hadiah 3D Prize2': '🎉 Untuk Hadiah 3D jenis betingan Prize2, kemenangan anda adalah {value}.',
  'Hadiah 2D Prize2': '🎉 Untuk Hadiah 2D jenis betingan Prize2, kemenangan anda adalah {value}.',
  'Hadiah 4D Prize3': '🎉 Untuk Hadiah 4D jenis betingan Prize3, kemenangan anda adalah {value}.',
  'Hadiah 3D Prize3': '🎉 Untuk Hadiah 3D jenis betingan Prize3, kemenangan anda adalah {value}.',
  'Hadiah 2D Prize3': '🎉 Untuk Hadiah 2D jenis betingan Prize3, kemenangan anda adalah {value}.',
  'Colok Bebas 1 Digit':            'Cara perhitungan Colok Bebas 1 Digit:\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 6%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Bebas 2 Digit':            'Cara perhitungan Colok Bebas 2 Digit:\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 6%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Bebas 3 Digit':            'Cara perhitungan Colok Bebas 3 Digit:\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 6%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Bebas 4 Digit':            'Cara perhitungan Colok Bebas 4 Digit:\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 6%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Bebas 2D 2 angka':          'Cara perhitungan Colok Bebas 2D 2 angka:\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 10%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Bebas 2D 3 angka':          'Cara perhitungan Colok Bebas 2D 3 angka:\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 10%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Bebas 2D 4 angka':          'Cara perhitungan Colok Bebas 2D 4 angka:\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 10%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Naga (3 Angka)':            'Cara perhitungan Colok Naga (3 Angka):\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 10%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Naga (4 Angka)':            'Cara perhitungan Colok Naga (4 Angka):\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 10%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.',
  'Colok Jitu':                     'Cara perhitungan Colok Jitu:\nNilai Bettingan x Nilai Hadiah + (Modal Betingan - 6%).\nJadi untuk kemenangan yang anda dapatkan sebesar {value}, sudah sesuai dengan yang tercatat pada history taruhan di akun bermain anda bosku.'

};

function renderMessage(label, value) {
    const tmpl = messageTemplates[label] || `🏆 Untuk ${label}, kemenangan anda adalah {value}.`;
    return tmpl.replace('{value}', "Rp " + Math.floor(value).toLocaleString('id-ID'));
}

function calculate() {
    const a = parseFloat(document.getElementById('nilaiA').value) || 0;
    const type = document.getElementById('calcType').value;
    const resultsArea = document.getElementById('calcResultsArea');
    const results = [];

    if (a <= 0 || type === "") {
        resultsArea.innerHTML = "";
        return;
    }

    switch (type) {
    case 'full':
      results.push({ label:'Hadiah 4D Full', value:10000*a });
      results.push({ label:'Hadiah 3D Full', value:1000*a });
      results.push({ label:'Hadiah 2D Full', value:100*a });
      break;
    case 'discount':
      results.push({ label:'Hadiah 4D Diskon', value:3000*a });
      results.push({ label:'Hadiah 3D Diskon', value:400*a });
      results.push({ label:'Hadiah 2D Diskon', value:70*a });
      results.push({ label:'Hadiah 2D Depan & Tengah', value:65*a });
      break;
    case 'bolakTepat':
      results.push({ label:'Hadiah 4D BB Tepat', value:4000*a });
      results.push({ label:'Hadiah 3D BB Tepat', value:400*a });
      results.push({ label:'Hadiah 2D BB Tepat', value:70*a });
      break;
    case 'bolakTidak':
      results.push({ label:'Hadiah 4D BB Tidak Tepat', value:200*a });
      results.push({ label:'Hadiah 3D BB Tidak Tepat', value:100*a });
      results.push({ label:'Hadiah 2D BB Tidak Tepat', value:20*a });
      break;
    case 'prize1':
      results.push({ label:'Hadiah 4D Prize1', value:6500*a });
      results.push({ label:'Hadiah 3D Prize1', value:650*a });
      results.push({ label:'Hadiah 2D Prize1', value:70*a });
      break;
    case 'prize2':
      results.push({ label:'Hadiah 4D Prize2', value:2100*a });
      results.push({ label:'Hadiah 3D Prize2', value:210*a });
      results.push({ label:'Hadiah 2D Prize2', value:20*a });
      break;
    case 'prize3':
      results.push({ label:'Hadiah 4D Prize3', value:1100*a });
      results.push({ label:'Hadiah 3D Prize3', value:110*a });
      results.push({ label:'Hadiah 2D Prize3', value:8*a });
      break;
    case 'colok':
      for (let i=1;i<=4;i++){
        results.push({
          label:`Colok Bebas ${i} Digit`,
          value: Math.pow(1.5,i)*a + (a*0.94)
        });
      }
      [2,3,4].forEach(n=>{
        results.push({
          label:`Colok Bebas 2D ${n} angka`,
          value:(n===2?7:(n===3?11:18))*a + (a*0.90)
        });
      });
      [3,4].forEach(n=>{
        results.push({
          label:`Colok Naga (${n} Angka)`,
          value:(n===3?23:35)*a + (a*0.90)
        });
      });
      results.push({ label:'Colok Jitu', value:8*a + (a*0.94) });
      results.push({ label:'Shio',        value:9.5*a + (a*0.95) });
      break;
        // Tambahkan case lainnya (prize1, prize2, dll) sesuai kebutuhan Anda
    }

// Render ke layar
resultsArea.innerHTML = results.map(res => `
    <div class="result-card">
        <p class="result-text" style="font-size: 13px; color: #ecf0f1; margin: 0; line-height: 1.5; white-space: pre-line;">
            ${renderMessage(res.label, res.value)}
        </p>
        <button class="btn-copy-table" style="margin-top:12px; width: 100%;" 
                onclick="copyText(\`${renderMessage(res.label, res.value)}\`, this)">
            Salin Pesan Kemenangan
        </button>
    </div>
`).join('');
}

    window.onload = renderHistory;
    
    // Fungsi AI Sederhana untuk membersihkan teks hasil scan
// Fungsi Smart Fix yang aman
function aiSmartFix(text) {
    try {
        // Cek apakah TensorFlow sudah siap
        if (typeof tf !== 'undefined') {
            console.log("AI sedang memproses...");
            // Logika pembersihan teks
            return text.replace(/O/g, '0')
                       .replace(/[Il]/g, '1')
                       .replace(/S/g, '5')
                       .replace(/B/g, '8')
                       .replace(/\D/g, '');
        } else {
            // Jika AI belum siap, gunakan pembersihan standar (tanpa bikin error)
            return text.replace(/\D/g, '');
        }
    } catch (error) {
        console.error("AI Error:", error);
        return text.replace(/\D/g, ''); // Tetap kembalikan angka standar jika AI gagal
    }
}

function changeTheme(element) {
    const newBg = element.getAttribute('data-bg');
    const defaultBg = "https://i.imgur.com/S594PkR.gif";

    // Fungsi internal untuk menerapkan background secara sempurna
    const applyBackground = (url) => {
        document.body.style.backgroundImage = `url('${url}')`;
        document.body.style.backgroundSize = "cover";       // WAJIB
        document.body.style.backgroundPosition = "center";  // WAJIB
        document.body.style.backgroundAttachment = "fixed"; // WAJIB
        document.body.style.backgroundRepeat = "no-repeat"; // WAJIB
    };

    if (newBg === "DEFAULT") {
        applyBackground(defaultBg);
        localStorage.removeItem('userTheme');
    } else {
        applyBackground(newBg);
        localStorage.setItem('userTheme', newBg);
    }
    
    // Logika border ikon tetap sama
    document.querySelectorAll('.icon-item img').forEach(img => {
        img.style.borderColor = "var(--primary-gold)";
    });
    element.querySelector('img').style.borderColor = "var(--success-green)";
}

let lastProcessedCode = ""; // Untuk mencegah duplikat ke Sheets

// Gunakan variabel ini di bagian paling atas script Anda
let lastSentCode = ""; 

function saveToCloud(code) {
    // Validasi: Jangan kirim jika kode kosong atau sama dengan yang barusan
    if (!code || code === lastSentCode) return;

    const scriptURL = 'AKfycbyrDyClaulM917fSvOPEP4pTOkZo4ZOrAkt';
    
    // Siapkan data dalam format FormData (lebih disukai oleh Google Apps Script)
    const formData = new URLSearchParams();
    formData.append('ticketCode', code);
    formData.append('timestamp', new Date().toLocaleString('id-ID'));

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Menghindari masalah kebijakan keamanan kantor
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
    })
    .then(() => {
        console.log("Data berhasil dikirim ke antrian cloud");
        lastSentCode = code; // Tandai sudah terkirim
    })
    .catch(err => {
        console.error("Gagal terhubung ke Google Sheets:", err);
    });
}

let lastSavedCode = ""; // Anti-Duplicate

async function saveToCloud(code) {
    // 1. Cek Duplikat
    if (code === lastSavedCode) return;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyrDyClaulM917fSvOPEP4pTOkZo4ZOrAkt-3dTM0DeTVsH7vIoZipwkKOIV33PC0WE/exec';
    
    // 2. Format data sesuai kebutuhan JSON.parse di Apps Script
    const payload = {
        action: "add",
        code: code
    };

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Tetap gunakan no-cors untuk lingkungan kantor
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Jika sampai sini, anggap berhasil karena mode no-cors tidak bisa membaca respon
        lastSavedCode = code;
        console.log("Data dikirim ke Cloud: " + code);
        
    } catch (error) {
        console.error("Gagal mengirim ke Cloud:", error);
    }
}


// --- TARUH INI DI BAGIAN PALING BAWAH SCRIPT.JS ---

// Tambahkan atau Ganti bagian ini di script.js Anda
window.addEventListener('load', function() {
    // 1. Ambil perintah dari URL (misal: #absensi)
    const hash = window.location.hash.substring(1); 

    // 2. Logika Penanganan Layar Blank
    if (hash === 'absensi') {
        // Jika ada #absensi di URL, paksa tampilkan section tersebut
        showSection('absensi');
    } else {
        // Jika tidak ada hash (akses langsung), default ke absen agar tidak blank
        showSection('absensi');
    }

    // 3. Update Jam & Tanggal agar tetap jalan
    updateDateTime();
});

// Pastikan fungsi showSection Anda seperti ini agar CSS display-nya berubah
function showSection(id) {
    // Sembunyikan semua section terlebih dahulu
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });

    // Tampilkan section yang dipilih
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block'; // Ini yang akan menghilangkan kondisi blank
    }
}


function toggleChat() {
    document.getElementById('ai-chat-window').classList.toggle('chat-hidden');
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

// Load catatan saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
    displayNotes();
});

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addQuickNote();
    }
}

function addQuickNote() {
    const input = document.getElementById('user-input');
    const noteText = input.value.trim();
    
    if (noteText === "") return;

    // Ambil data catatan yang sudah ada di LocalStorage
    const savedNotes = JSON.parse(localStorage.getItem('my_task_notes')) || [];
    
    // Buat objek catatan baru
    const newNote = {
        text: noteText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    // Simpan ke array dan LocalStorage
    savedNotes.push(newNote);
    localStorage.setItem('my_task_notes', JSON.stringify(savedNotes));

    input.value = ""; // Kosongkan input
    displayNotes(); // Refresh tampilan
}

function displayNotes() {
    const container = document.getElementById('chat-messages');
    const savedNotes = JSON.parse(localStorage.getItem('my_task_notes')) || [];
    
    if (savedNotes.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#555; font-size:12px; margin-top:50px;">Belum ada percakapan/catatan.</div>`;
        return;
    }

    container.innerHTML = savedNotes.map((note) => `
        <div class="note-bubble">
            <span class="note-content">${note.text}</span>
            <span class="note-meta">${note.time} <i class="fas fa-check-double"></i></span>
        </div>
    `).join('');

    // Selalu scroll ke paling bawah setiap ada pesan baru
    container.scrollTop = container.scrollHeight;
}

function clearNotes() {
    Swal.fire({
        title: 'HAPUS SEMUA?',
        text: "Semua catatan percakapan akan dibersihkan secara permanen.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c', // Warna merah untuk hapus
        cancelButtonColor: '#333',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        background: '#1a1a1a',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            // 1. Hapus dari LocalStorage
            localStorage.removeItem('my_task_notes');
            
            // 2. Refresh tampilan chat
            displayNotes();

            // 3. Notifikasi sukses kecil (Toast)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                background: '#1a1a1a',
                color: '#fff'
            });
            Toast.fire({
                icon: 'success',
                title: 'Catatan telah dibersihkan'
            });
        }
    });
}

function toggleChat() {
    const windowEl = document.getElementById('ai-chat-window');
    windowEl.classList.toggle('chat-hidden');
}

// --- LOGIKA LOGOUT & ABSEN KELUAR ---

// Fungsi Logout dengan JSON
async function handleLogout() {
    // 1. Konfirmasi User
    const result = await Swal.fire({
        title: 'Yakin ingin keluar?',
        text: "Sistem akan mencatat waktu selesai tugas Anda.",
        icon: 'warning',
        background: '#1a1a1a',
        color: '#fff',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#333',
        confirmButtonText: 'Ya, Logout',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        // 2. Loading...
        Swal.fire({
            title: 'Menyimpan Data...',
            text: 'Sedang mencatat log keluar...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading() },
            background: '#1a1a1a',
            color: '#fff'
        });

        try {
            // 3. Kirim ke Google Apps Script (Format JSON)
            await fetch(GAS_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" }, // Gunakan text/plain agar tidak kena CORS preflight
                body: JSON.stringify({
                    action: "keluar",
                    nama: "RIZKY SYAIFULLAH" // Ganti sesuai nama user login
                })
            });

            // 4. Hapus data sesi lokal (opsional)
            localStorage.removeItem('lastAbsenDate'); 

            // 5. Sukses & Redirect ke Auth
            Swal.fire({
                icon: 'success',
                title: 'SAMPAI JUMPA',
                text: 'Sesi Anda telah berakhir.',
                showConfirmButton: false,
                timer: 1500,
                background: '#1a1a1a',
                color: '#fff'
            }).then(() => {
                window.location.href = "auth.html"; // Kembali ke halaman Login
            });

        } catch (error) {
            console.error("Gagal Logout:", error);
            // Tetap logout meski internet error (Opsional)
            window.location.href = "auth.html";
        }
    }
}

function globalFilterKesalahan() {
    // 1. Ambil kata kunci pencarian
    const input = document.getElementById("searchKesalahan");
    const filter = input.value.toLowerCase();
    const table = document.getElementById("kesalahanTableBody");
    const tr = table.getElementsByTagName("tr");

    // 2. Loop melalui setiap baris tabel
    for (let i = 0; i < tr.length; i++) {
        // Lewati jika baris menampilkan pesan "Menunggu data" atau "Data Kosong"
        if (tr[i].cells.length < 4) continue; 

        // Ambil semua teks dari baris tersebut (Tanggal + Nama + Link + Jenis)
        const rowText = tr[i].textContent || tr[i].innerText;
        
        // 3. Jika kata kunci ditemukan di bagian mana saja dalam baris tersebut
        if (rowText.toLowerCase().indexOf(filter) > -1) {
            tr[i].style.display = ""; // Tampilkan
        } else {
            tr[i].style.display = "none"; // Sembunyikan
        }
    }
}

function generateTogel() {
    const pasaran = document.getElementById('pasaranSelect').value;
    const tableBody = document.getElementById('togelTableBody');
    
    if (!pasaran) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color: #888;">Silahkan pilih pasaran di atas...</td></tr>';
        return;
    }

    // Fungsi pembantu generate angka unik (tidak kembar untuk BBFS)
    const getUniqueNumbers = (count) => {
        let nums = [];
        while(nums.length < count){
            let r = Math.floor(Math.random() * 10);
            if(nums.indexOf(r) === -1) nums.push(r);
        }
        return nums.join('');
    };

    // Fungsi generate angka (boleh kembar untuk 4D/3D/2D)
    const getRandomDigits = (count) => {
        let res = "";
        for(let i=0; i<count; i++) res += Math.floor(Math.random() * 10);
        return res;
    };

    // Data Prediksi
    const dataPrediksi = [
        { tipe: "BBFS", angka: getUniqueNumbers(6) },
        { tipe: "4D Jitu", angka: getRandomDigits(4) },
        { tipe: "3D Jitu", angka: getRandomDigits(3) },
        { tipe: "2D Belakang", angka: getRandomDigits(2) },
        { tipe: "Colok Bebas", angka: Math.floor(Math.random() * 10) }
    ];

    // Render ke Tabel
    tableBody.innerHTML = "";
    dataPrediksi.forEach(item => {
        tableBody.innerHTML += `
        <tr>
            <td style="font-weight: bold; color: #bdc3c7;">${item.tipe}</td>
            <td style="color: var(--primary-gold); font-family: 'Courier New', monospace; font-size: 18px; letter-spacing: 2px; font-weight: bold;">
                ${item.angka}
            </td>
            <td style="text-align: center;">
                <button class="btn-copy-table" onclick="copyText('${item.angka}', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </td>
        </tr>`;
    });
}
