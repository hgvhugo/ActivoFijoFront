import React from "react";
import { AspectRatio, rem, Space } from "@mantine/core";
import Titulo from "../components/Titulo.jsx";
import Resguardo from "../components/ResguardoBienes/Resguardo.jsx";
 
const ResguardoBienes = () => {
  return (
    <div>
      <Titulo titulo="Resguardo Bienes" />
      <Space h="lg" />
 
 

      <Space h="lg" />
      <div>
           <Resguardo />
         </div>
    </div>
  );
};

export default ResguardoBienes;
