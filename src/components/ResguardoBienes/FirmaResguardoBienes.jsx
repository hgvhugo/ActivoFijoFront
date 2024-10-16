import React, { useState } from "react";
import Firma from "../Firma/Firma.jsx";
import { useUpdateWithFormData } from "../../hooks/useCRUDTables.js";
import { URL_BASE_SERVICIOS, API_ENDPOINTS } from "../../config/Endpoints.jsx";
import {
  handleError,
  handleSuccess,
  handleInfo,
} from "../../helpers/Notificaciones.jsx";
import {  LoadingOverlay,Loader} from "@mantine/core";


const FirmaResguardoBienes = ({ onSubmit, datos,empleadoFirmanteResguardo }) => {

  const [isLoading, setIsLoading] = useState(false);


  const { mutateAsync: updated, isLoading: isUpdating } = useUpdateWithFormData(
    `${URL_BASE_SERVICIOS}${API_ENDPOINTS.FirmaResguardo}`,
    "",
    ["Resguardo"]
  );

  console.log(datos);

  // Crear un array de objetos con solo los campos id y empleado
  const datosFirmarSimplificado = Object.keys(datos).map((key) => {
    return {
      id: datos[key].id,
      empleadoId:empleadoFirmanteResguardo, // Transformar a entero
    };
  });

  


  const handleSubmit = async (formData) => {
    // console.log("firma asignacion bienes");
    // console.log(editedRows,"FirmaResguardoBienes");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      setIsLoading(true);
      await updated(formData);
      // console.log("Llamando a onSubmit");
      setIsLoading(false);
      handleSuccess("Firma realizada correctamente");


      
      onSubmit(); // Llama a onSubmit para cerrar el modal

    } catch (error) {
      const errorMessage = error.message.replace(/^Error:\s*/, "");
      setIsLoading(false);
      handleError(errorMessage);

      onSubmit(); // Llama a onSubmit para cerrar el modal
    }
  };

  return (
    <>
    <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayOpacity={0.5}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'var(--primary-color)', type: 'bars',size:'xl'  ,children:<div> <center>  <Loader   color='var(--primary-color)' size="xl" type="bars"  />Procesando firma...</center></div> }}
        />
      <Firma onSubmit={handleSubmit} datosFirmar={datosFirmarSimplificado} isLoading={isLoading} />
    </>
  );
};

export default FirmaResguardoBienes;
