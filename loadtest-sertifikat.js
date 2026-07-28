import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 20,
  duration: "30s",
};

export default function () {
  const res = http.get(
    "https://sertifikat-web-pearl.vercel.app/api/sertifikat?keyword=Fernando"
  );

  if (res.status !== 200) {
    console.log(`Status: ${res.status}`);
    console.log(res.body);
  }

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}