async function loadKegiatan() {

    const container = document.getElementById("kegiatan-grid");

    showLoading(container);

    try {

        const response = await fetch("/api/kegiatan-list");

        const result = await response.json();

        if (!result.success) {

            showError(container, result.message);

            return;

        }

        renderKegiatan(container, result.data);

    }

    catch (err) {

        console.error(err);

        showError(
            container,
            "Gagal mengambil data kegiatan."
        );

    }

}

function renderKegiatan(container, kegiatan) {

    console.log("DATA KEGIATAN:", kegiatan);

    container.innerHTML = "";

    if (!kegiatan.length) {

        container.innerHTML = `
            <div class="empty-state">
                Belum ada kegiatan.
            </div>
        `;

        return;

    }

    kegiatan.forEach(item => {

        console.log(item);

        container.insertAdjacentHTML(
            "beforeend",
            createCard(item)
        );

    });

}

function createCard(item) {

    console.log(item.flyer);
console.log(convertDriveImage(item.flyer));

    return `

        <div
            class="kegiatan-card"
            onclick="bukaKegiatan('${item.kode}')">

            <div class="card-image">

                <img
    src="${convertDriveImage(item.flyer)}"
    alt="${item.nama}"
    onload="console.log('BERHASIL:', this.src)"
    onerror="console.log('GAGAL:', this.src)">

            </div>

            <div class="card-content">

                <div class="card-date">

                    📅 ${item.tanggal}

                </div>

                <h3>

                    ${item.nama}

                </h3>

            </div>

        </div>

    `;

}

function bukaKegiatan(kode){

    window.location.href =
        "kegiatan.html?kode=" + kode;

}

function convertDriveImage(url){

    if(!url){

        return "";

    }

    const text = url.toString().trim();

    /*
    https://drive.google.com/file/d/FILE_ID/view
    */

    const match1 = text.match(/\/d\/([^/]+)/);

    /*
    https://drive.google.com/open?id=FILE_ID
    */

    const match2 = text.match(/[?&]id=([^&]+)/);

    let id = "";

    if(match1 && match1[1]){

        id = match1[1];

    }

    else if(match2 && match2[1]){

        id = match2[1];

    }

    if(id){

        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

    }

    return text;

}

function showLoading(container){

    container.innerHTML = `

        <div class="loading">

            Memuat daftar kegiatan...

        </div>

    `;

}

function showError(container,message){

    container.innerHTML = `

        <div class="error">

            ${message}

        </div>

    `;

}

loadKegiatan();