import React from "react";
import Busqueda2 from "../components/Busqueda2.jsx";
import { AspectRatio, rem, Space } from "@mantine/core";
import Titulo from "../components/Titulo.jsx";
import CargaMasiva from "../components/RecepcionBienes/CargaMasiva.jsx";

const RecepcionBienes = () => {
  
  return (
    <div>
      <Titulo titulo="Recepción de Bienes (Alta)" />
      <Space h="lg" />

      <div  >
        {/* <Busqueda2 /> */}
      </div>

      <Space h="lg" />
      <div>
        {/* <AspecktRatio ratio={16 / 9} style={{ height: rem(500) }}> */}
          <CargaMasiva />
        {/* </AspecktRatio> */}
        </div>
    </div>
  );
};

export default RecepcionBienes;
