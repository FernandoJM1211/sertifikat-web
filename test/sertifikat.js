import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 10,
    duration: "30s",
};

const BASE_URL = "http://localhost:3000/api";

const keyword = "Fernando";

const kode = "VPLR001";

export default function () {

    const res = http.get(

        `${BASE_URL}/sertifikat?keyword=${encodeURIComponent(keyword)}&kode=${encodeURIComponent(kode)}`

    );

    check(res, {
        "status 200": (r) => r.status === 200,
        "response < 700ms": (r) => r.timings.duration < 700,
    });

    sleep(1);

}