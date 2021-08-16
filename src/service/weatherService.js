import axios from 'axios';


let baseURL = "http://127.0.0.1:3001";


export function getCitylistData() {
    return axios.get(
        baseURL + '/weatherData/weatherList'
    )
}

export function getCityDetailedData(city) {
    return axios.get(
        baseURL + '/weatherData/' + city
    )
}
