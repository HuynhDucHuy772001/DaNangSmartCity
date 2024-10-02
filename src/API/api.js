import axios from 'axios';

const username = 'huynhduchuy1';
const password = 'Duchuy7701@';
const url = 'https://congdulieu.vn/api/dataset/MTM1NTM2Nw==?limit=10&offset=0';

export async function fetchDataFromAPI() {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                'Cache-Control': 'no-cache',
            },
        });
        return response.data; // Cập nhật state data với dữ liệu từ API
    } catch (error) {
        console.log('Lỗi khi gọi API:', error);
        throw error;
    }
}

const urlBDS = 'https://congdulieu.vn/api/dataset/MTM5MDA5NA==?limit=20&offset=0';

export async function fetchDataBDSFromAPI() {
    try {
        const response = await axios.get(urlBDS, {
            headers: {
                Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                'Cache-Control': 'no-cache',
            },
        });
        return response.data; // Cập nhật state data với dữ liệu từ API
    } catch (error) {
        console.log('Lỗi khi gọi API:', error);
        throw error;
    }
}

const urlEvents = 'https://apisukien.1022.vn/api/get';

export async function fetchDataEventsFromAPI() {
    try {
        const response = await axios.get(urlEvents, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-cache',
            },
        });
        return response.data.events;
    } catch (error) {
        console.log('Lỗi khi gọi API:', error);
        throw error;
    }
}

// const urlEvents = 'https://web-lichsukien.onrender.com/api/get';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZiNjM1MjRmMmJlMzVlOTQ4MDdlNWYiLCJpYXQiOjE3Mjc4MzMzMDcsImV4cCI6MTcyNzkxOTcwN30.zwg2vufGKDNbLY_ohAxZcpaSn8dY8abGukU6dkmcOmA';  // Replace with your actual token

// export async function fetchDataEventsFromAPI() {
//     try {
//         const response = await axios.get(urlEvents, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//                 'Cache-Control': 'no-cache',
//             },
//         });
//         return response.data.events;
//     } catch (error) {
//         console.log('Lỗi khi gọi API:', error);
//         throw error;
//     }
// }

const urlMaHoSo = 'https://congdulieu.vn/api/dataset/MTQ0NjEyOA==?limit=10&offset=0';

export async function fetchDataMaHoSoFromAPI() {
    try {
        const response = await axios.get(urlMaHoSo, {
            headers: {
                Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                'Cache-Control': 'no-cache',
            },
        });
        return response.data; // Cập nhật state data với dữ liệu từ API
    } catch (error) {
        console.log('Lỗi khi gọi API:', error);
        throw error;
    }
}