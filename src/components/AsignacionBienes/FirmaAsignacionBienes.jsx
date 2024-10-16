import React, { useContext } from 'react';
import Firma from '../Firma/Firma.jsx';
import { EditedRowsContext } from '../../context/EdicionRowsContext';
import { useUpdateWithFormData,  } from "../../hooks/useCRUDTables.js";
import { URL_BASE_SERVICIOS, API_ENDPOINTS } from "../../config/Endpoints.jsx";
import {
    handleError,
    handleSuccess,
    handleInfo,
  } from "../../helpers/Notificaciones.jsx";

const FirmaAsignacionBienes = ({onSubmit}) => {
  const { editedRows } = useContext(EditedRowsContext);

  const { mutateAsync: updated, isLoading: isUpdating } = useUpdateWithFormData(
    `${URL_BASE_SERVICIOS}${API_ENDPOINTS.FirmaAsignador}`,
    ''
    ,["AsignaBienes"]
  );


    // Crear un array de objetos con solo los campos id y empleado
    const datosFirmarSimplificado = Object.keys(editedRows).map(key => {
        return {
          id: editedRows[key].id,
          empleadoId: parseInt(editedRows[key].empleado, 10) // Transformar a entero
        };
      });


      
  const handleSubmit = async (formData) => {
    // console.log("firma asignacion bienes");
    // console.log(editedRows,"FirmaAsignacionBienes");
    //  for (let pair of formData.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]); 
    //   }
    
    try {
        await updated(formData);
        // console.log("Llamando a onSubmit");
        onSubmit(); // Llama a onSubmit para cerrar el modal
       
            handleSuccess("Firma realizada correctamente");
        
      } catch (error) {
            const errorMessage = error.message.replace(/^Error:\s*/, '');

            handleError(errorMessage);
         
          onSubmit(); // Llama a onSubmit para cerrar el modal

      }
      
  };

  return <Firma onSubmit={handleSubmit} datosFirmar={datosFirmarSimplificado} />;
};

export default FirmaAsignacionBienes;