import React, { useEffect, useState, useMemo } from "react";
import { Grid, Paper, Space } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useGet } from "../../hooks/useCRUDTables.js";
import { URL_BASE_SERVICIOS, API_ENDPOINTS } from "../../config/Endpoints.jsx";
import {
  AreaChart,
  RadarChart,
  PieChart,
  DonutChart,
  BarChart,
} from "@mantine/charts";

const Dash = () => {
  const [conAutorizacion, setConAutorizacion] = useState("");
  const [unidadAdministrativaId, setUnidadAdministrativaId] = useState(3);
  const [estatusId, setEstatusId] = useState(0);
  const [refreshData, setRefreshData] = useState(false);
  const [edited, setEdited] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [empleados, setEmpleados] = useState([]);
  const [transformedData, setTransformedData] = useState([]);

  const buildUrlWithParams = (baseUrl, params) => {
    const url = new URL(baseUrl);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    return url.toString();
  };
  ///// Se agrega la constante url para la consulta de los registros de bienes sin asignar se usara en GET para llenado de tabla
  const url = useMemo(
    () =>
      buildUrlWithParams(
        `${URL_BASE_SERVICIOS}${API_ENDPOINTS.ConteosRegistroBien}`,
        {
          unidadAdministrativaId,
          estatusId,
        }
      ),
    [unidadAdministrativaId, estatusId]
  );

  const {
    data: fetched = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
    refetch,
  } = useGet(url, conAutorizacion,["ConteoDash"]);

  /// Se agrega el useEffect para refrescar la tabla
  useEffect(() => {
    refetch();
    console.log("Refetching...");

  }, [refreshData, url]);


//   useEffect(() => {
//     if (fetched.length > 0) {
//       setTransformedData(transformData(fetched));
//     }
//   }, [fetched]);

useEffect(() => {
    if (!isLoading && !isFetching && fetched.length > 0) {
      setTransformedData(transformData(fetched));
    }
  }, [fetched, isLoading, isFetching]);

  const columns = useMemo(() => {
    if (fetched && fetched.length > 0) {
      return Object.keys(fetched[0])
        .filter((key) => key !== "unidadadministrativaid") // Filtrar la clave 'unidadadministrativaid'
        .map((key) => ({
          accessorKey: key,
          header: key.charAt(0).toUpperCase() + key.slice(1), // Convertir la clave a título
        }));
    }
    return [];
  }, [fetched, edited]);

  const transformData = (data) => {
    const estados = ["asignados", "noAsignados", "mantenimiento", "baja"];
    const result = estados.map((estado) => {
      const obj = { Estado: estado.charAt(0).toUpperCase() + estado.slice(1) };
      data.forEach((item) => {
        obj[item.nombreUnidadAdministrativa] = item[estado];
      });
      return obj;
    });
    return result;
  };

  

  const table = useMantineReactTable({
    columns: columns,
    data: fetched,
    localization: MRT_Localization_ES,
    enableColumnOrdering: true,
    enableStickyHeader: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingError
      ? {
          color: "red",
          children: "Error al obtener los datos, por favor intenta de nuevo.",
        }
      : undefined,
    mantineTableContainerProps: {
      sx: {
        // minHeight: '500px',
        tableLayout: "auto",
      },
    },
    state: {
      isLoading: isLoading,
      showAlertBanner: isLoadingError,
      showProgressBars: isFetching,
    },
  });

//   const colors = [
//     "indigo.6",
//     "teal.6",
//     "pink.6",
//     "orange.6",
//     "blue.6",
//     "green.6",
//     "red.6",
//     "cyan.6",
//     "purple.6",
//   ];

const colors = ["#4c6ef5", "#ae3ec9", "#0ca678", "#f06595"]; // Define los colores

  return (
    <div>
      <Paper shadow="xl" radius="md" p="xs" withBorder>
        <Grid>
          <Grid.Col span={6}>
            <BarChart
              h={300}
              data={fetched}
              dataKey="nombreUnidadAdministrativa"
              series={[
                { name: "asignados", color: "indigo.6" },
                { name: "noAsignados", color: "grape.6" },
                { name: "mantenimiento", color: "teal.6" },
                { name: "baja", color: "pink.6" },
              ]}
              tickLine="xy"
              gridAxis="xy"
              withLegend
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <RadarChart
              h={300}
              data={transformedData}
              dataKey="Estado"
              series={fetched.map((item, index) => ({
                name: item.nombreUnidadAdministrativa,
                color: colors[index % colors.length], // Asigna colores cíclicamente
                opacity: 0.2,
              }))}
              withPolarGrid
              withPolarAngleAxis
              withPolarRadiusAxis
              withLegend
               
              
            />
          </Grid.Col>
          <Grid.Col span={6}></Grid.Col>
        </Grid>
      </Paper>

      <Paper shadow="xl" radius="md" p="xs" withBorder>
        <MantineReactTable table={table} />
        <Space h="lg" />

        <Space h="lg" />
      </Paper>
    </div>
  );
};

export default Dash;
