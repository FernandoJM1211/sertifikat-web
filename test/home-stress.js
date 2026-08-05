import http from "k6/http";
import { check, sleep } from "k6";

export const options = {

    stages: [

        { duration: "20s", target: 50 },
        { duration: "20s", target: 100 },
        { duration: "20s", target: 200 },
        { duration: "20s", target: 300 },
        { duration: "20s", target: 0 },

    ],

    thresholds: {

        http_req_failed: ["rate<0.01"],

        http_req_duration: ["p(95)<2000"],

    },

};

const BASE_URL =
    "https://sertifikat-web-git-feature-system-v2-fernandojm1211s-projects.vercel.app";

export default function () {

    const res = http.get(
        `${BASE_URL}/api/kegiatan-list`
    );

    check(res, {

        "status 200": (r) => r.status === 200,

    });

    sleep(1);

}