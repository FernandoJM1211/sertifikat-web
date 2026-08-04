import http from "k6/http";
import { check, sleep } from "k6";

export const options = {

    stages: [

        { duration: "20s", target: 10 },

        { duration: "20s", target: 30 },

        { duration: "20s", target: 50 },

        { duration: "20s", target: 0 },

    ],

};

const BASE_URL = "http://localhost:3000/api";

export default function () {

    const res = http.get(
        `${BASE_URL}/kegiatan-list`
    );

    check(res, {
        "status 200": (r) => r.status === 200,
    });

    sleep(1);

}