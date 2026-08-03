async function getDetailKegiatan(kode) {

    const response = await fetch(
        `${CONFIG.API_URL}/kegiatan-detail?kode=${encodeURIComponent(kode)}`
    );

    console.log("Status kegiatan:", response.status);

    const result = await response.json();

    console.log(result);

    return result.data;

}

async function cariSertifikat(keyword, kode) {

    const response = await fetch(
        `${CONFIG.API_URL}/sertifikat?keyword=${encodeURIComponent(keyword)}&kode=${encodeURIComponent(kode)}`
    );

    if (!response.ok) {
        throw new Error("Gagal mencari sertifikat.");
    }

    const result = await response.json();

    console.log("Hasil Sertifikat:", result);

    if (!result.success) {
        return [];
    }

    return result.data;

}