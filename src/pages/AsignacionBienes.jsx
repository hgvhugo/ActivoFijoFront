import React from "react";
import Busqueda from "../components/Busqueda.jsx";
import { AspectRatio, rem, Space } from "@mantine/core";
import Titulo from "../components/Titulo.jsx";
import CargaMasiva from "../components/RecepcionBienes/CargaMasiva.jsx";
import AsignaBienes from "../components/AsignacionBienes/AsignaBienes.jsx";

const AsignacionBienes = () => {
  return (
    <div>
      <Titulo titulo="Asignación de Bienes (Alta)" />
      <Space h="lg" />

      <div>
        <Busqueda />
      </div>

      <Space h="lg" />
      <div>
        {/* <AspecktRatio ratio={16 / 9} style={{ height: rem(500) }}> */}
          <AsignaBienes/>
        {/* </AspecktRatio> */}
        </div>
    </div>
  );
};

export default AsignacionBienes;
