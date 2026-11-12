export default defineApiHandler(async () => {
  const data = await getDaftarKegiatan();

  return { success: true, total: data.length, data };
});
