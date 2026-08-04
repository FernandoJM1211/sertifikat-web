import http from "k6/http";
import { check, sleep } from "k6";

export const options = {

    stages: [

        { duration: "20s", target: 10 },

        { duration: "20s", target: 30 },

        { duration: "20s", target: 50 },

        { duration: "20s", target: 0 },

    ],

    thresholds: {

        http_req_failed: ["rate<0.01"],

        http_req_duration: ["p(95)<1000"],

    },

};

const BASE_URL =
    "https://sertifikat-web-git-feature-system-v2-fernandojm1211s-projects.vercel.app";

const KODE = "VPL001";
const KEYWORD = "Fernando";

export default function () {

    // Home
    let res = http.get(
        `${BASE_URL}/api/kegiatan-list`
    );

    check(res, {
        "home status 200": (r) => r.status === 200,
    });

    sleep(0.3);

    // Detail Kegiatan
    res = http.get(
        `${BASE_URL}/api/kegiatan-detail?kode=${encodeURIComponent(KODE)}`
    );

    check(res, {
        "detail status 200": (r) => r.status === 200,
    });

    sleep(0.3);

    // Cari Sertifikat
    res = http.get(
        `${BASE_URL}/api/sertifikat?keyword=${encodeURIComponent(KEYWORD)}&kode=${encodeURIComponent(KODE)}`
    );

    check(res, {
        "sertifikat status 200": (r) => r.status === 200,
    });

    sleep(1);

}