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

const urlEvents = 'https://web-lichsukien.onrender.com/api/get';

export async function fetchDataEventsFromAPI() {
    try {
        const response = await axios.get(urlEvents);
        return response.data.events;
    } catch (error) {
        console.log('Lỗi khi gọi API:', error);
        throw error;
    }
}

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