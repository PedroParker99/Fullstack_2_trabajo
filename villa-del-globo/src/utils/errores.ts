import axios from 'axios'

// Obtiene un mensaje entendible de un error de Axios.
// Si el backend respondió, usa su mensaje (por ejemplo "Stock insuficiente...").
// Si no respondió, es porque el microservicio está apagado.
export const obtenerMensajeError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const datos = error.response.data as { message?: string }
      return datos.message || `El servidor respondió con el error ${error.response.status}.`
    }
    return 'No se pudo conectar con el servidor. Revisa que los microservicios estén encendidos.'
  }
  return 'Ocurrió un error inesperado.'
}