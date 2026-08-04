import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {

    vus: 20,

    duration: '30s',

};

const BASE_URL = 'http://localhost:3000';

export default function () {

    const res = http.get(
        `${BASE_URL}/api/kegiatan-list`
    );

    check(res, {

        'status 200': (r) => r.status === 200,

    });

    sleep(1);

}