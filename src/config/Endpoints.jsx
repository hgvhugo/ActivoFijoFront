export const URL_BASE_PROYECTO = import.meta.env.VITE_URL_BASE_PROYECTO;

export const URL_BASE_SERVICIOS = import.meta.env.VITE_BACK_APP_API_URI;



export const API_ENDPOINTS = {
    CargaMasiva: '/api/RegistroBienes/cargar-excel',
    BuscarRegistroBien: '/api/RegistroBienes/buscar',
    ConteosRegistroBien: '/api/RegistroBienes/conteos',
    EmpleadosxUnidad: '/api/Empleado/unidad/',
    FirmaAsignador: '/api/RegistroBienes/firmaAsignador',
    BienesSinFirmarResguardo: '/api/RegistroBienes/registrosSinFirmar',
    FirmaResguardo: '/api/RegistroBienes/firmaResguardo',
    EnviarCorreo: '/api/Correo/enviar-correo',
}
