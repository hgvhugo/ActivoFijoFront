import React from "react";
import Busqueda from "../components/Busqueda.jsx";
import { AspectRatio, rem, Space } from "@mantine/core";
import Titulo from "../components/Titulo.jsx";
import Dash from "../components/Dashboard/Dash.jsx";

const Dashboard = () => {
  return (
    <div>
      <Titulo titulo="Dashboard Operativo" />
      <Space h="lg" />

   
      <Space h="lg" />
      <div>
        {/* <AspecktRatio ratio={16 / 9} style={{ height: rem(500) }}> */}
          <Dash/>
        {/* </AspecktRatio> */}
        </div>
    </div>
  );
};

export default Dashboard;
