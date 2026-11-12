export default defineApiHandler(async (event) => {
  const kode = String(getQuery(event).kode || "").trim();

  if (!kode) {
    return sendFail(event, 400, "Parameter kode wajib diisi.");
  }

  if (kode.length > KODE_MAX) {
    return sendFail(event, 400, "Parameter kode tidak valid.");
  }

  const kegiatan = await getDetailKegiatan(kode);

  if (!kegiatan) {
    return sendFail(event, 404, "Kegiatan tidak ditemukan.");
  }

  return { success: true, data: kegiatan };
});
