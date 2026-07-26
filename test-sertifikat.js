const { searchCertificates } = require("./api/sertifikat");

(async () => {

  const hasil = await searchCertificates("Fernando");

  console.log(hasil);

})();