import axios from 'axios'

export const apiProductos = axios.create({
    baseURL: 'http://localhost:8081/api',
    timeout: 5000,
})