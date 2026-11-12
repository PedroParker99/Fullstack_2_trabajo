import axios from 'axios'

// Un cliente de Axios por cada microservicio (cada uno corre en su propio puerto).
export const apiProductos = axios.create({
  baseURL: 'http://localhost:8081/api',
  timeout: 5000,
})

export const apiUsuarios = axios.create({
  baseURL: 'http://localhost:8082/api',
  timeout: 5000,
})

export const apiPedidos = axios.create({
  baseURL: 'http://localhost:8083/api',
  timeout: 5000,
})

export const apiDirecciones = axios.create({
  baseURL: 'http://localhost:8086/api',
  timeout: 5000,
})