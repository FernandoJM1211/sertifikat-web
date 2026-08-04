import http from "k6/http";
import { check, sleep } from "k6";

export const options = {

    vus: 10,

    duration: "30s",

};

const BASE_URL =
"https://sertifikat-web-git-feature-system-v2-fernandojm1211s-projects.vercel.app";

const KODE = "VPL001";

export default function () {

    const res = http.get(
        `${BASE_URL}/api/kegiatan-detail?kode=${encodeURIComponent(KODE)}`
    );

    check(res, {

        "status 200": (r) => r.status === 200,

        "response < 1000ms": (r) => r.timings.duration < 1000,

    });

    sleep(1);

}