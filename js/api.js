async function getKegiatan() {
    const response = await fetch(`${CONFIG.API_URL}/kegiatan`);

    console.log("Status kegiatan:", response.status);

    const result = await response.json();

    console.log(result);

    return result.data;
}

async function cariSertifikat(keyword) {

    const response = await fetch(
        `${CONFIG.API_URL}/sertifikat?keyword=${encodeURIComponent(keyword)}`
    );

    console.log("Status sertifikat:", response.status);

    const text = await response.text();

    console.log("Response mentah:", text);

    const result = JSON.parse(text);

    return result.data;
}