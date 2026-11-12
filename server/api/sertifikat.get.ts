export default defineApiHandler(async (event) => {
  const query = getQuery(event);
  const keyword = String(query.keyword || "").trim();
  const kode = String(query.kode || "").trim();

  // Data peserta bersifat pribadi: jangan disimpan di cache browser/CDN.
  setResponseHeader(event, "Cache-Control", "no-store");

  if (!keyword) {
    return sendFail(event, 400, "Keyword wajib diisi.");
  }

  if (keyword.length < KEYWORD_MIN) {
    return sendFail(event, 400, `Keyword minimal ${KEYWORD_MIN} karakter.`);
  }

  if (keyword.length > KEYWORD_MAX) {
    return sendFail(event, 400, `Keyword maksimal ${KEYWORD_MAX} karakter.`);
  }

  if (!kode) {
    return sendFail(event, 400, "Kode kegiatan wajib diisi.");
  }

  if (kode.length > KODE_MAX) {
    return sendFail(event, 400, "Kode kegiatan tidak valid.");
  }

  const data = await searchCertificates(keyword, kode);

  return { success: true, data };
});
