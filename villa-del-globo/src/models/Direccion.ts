// Forma en que ms_direccion devuelve una dirección (entidad Direccion.java).
export interface Direccion {
  id: number
  usuarioId: number
  calle: string
  numero: string
  departamento: string | null
  comuna: string
  ciudad: string
  region: string
  referencia: string | null
  predeterminada: boolean
}