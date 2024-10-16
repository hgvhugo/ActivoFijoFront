import React, { useState } from "react";
import Busqueda from "../components/Busqueda.jsx";
import { AspectRatio, rem, Space } from "@mantine/core";
import Titulo from "../components/Titulo.jsx";
import AsignaBienes from "../components/AsignacionBienes/AsignaBienes.jsx";
import { useGet } from "../hooks/useCRUDTables.js";
import { URL_BASE_SERVICIOS, API_ENDPOINTS } from "../config/Endpoints.jsx";
import {
  handleError,
  handleSuccess,
  handleInfo,
} from "../helpers/Notificaciones.jsx";
import Busqueda2 from "../components/Busqueda2.jsx";

const AsignacionBienes = () => {

  // const { data: fetched, isLoading, isError } = useGet(`${URL_BASE_SERVICIOS}${API_ENDPOINTS.BIENES}`);
  const [filters, setFilters] = useState({
    estadoId: "",
    estatusId: "",
    campId: "",
    partidaId: "",
    cucopId: "",
    contrato: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [unidadAdministrativaId, setUnidadAdministrativaId] = useState(3);

  
  const buildUrlWithParams = (baseUrl, params) => {
    const url = new URL(baseUrl);
    Object.keys(params).forEach((key) => {
      if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  };

  const handleSearch = async () => {
    const params = { ...filters, unidadAdministrativaId };
    const url = buildUrlWithParams(
      `${URL_BASE_SERVICIOS}${API_ENDPOINTS.BuscarRegistroBien}`,
      params
    );

    try {
      setFilteredData([]);
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        handleError(`Error al buscar los registros de bienes, causa del error: ${errorText}`);
        return;
      }
      const data = await response.json();
      setFilteredData(data);
      handleSuccess( "Registros de bienes encontrados correctamente");
    } catch (error) {
      handleError(`Error al buscar los registros de bienes, causa del error: ${error.message}`);
    }
  };



  return (
    <div>
      <Titulo titulo="Asignación de Bienes (Alta)" />
      <Space h="lg" />

      <div>
        {/* <Busqueda /> */}
        <Busqueda filters={filters} setFilters={setFilters} onSearch={handleSearch} />
       </div>

      <Space h="lg" />
      <div>
        {/* <AspecktRatio ratio={16 / 9} style={{ height: rem(500) }}> */}
          {/* <AsignaBienes/> */}
          <AsignaBienes data={filteredData} />

        {/* </AspecktRatio> */}
        </div>
    </div>
  );
};

export default AsignacionBienes;
