import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Grid,
  Paper,
  Space,
  Button,
  Stack,
  Text,
  Alert,
  Modal,

} from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useGet } from "../../hooks/useCRUDTables.js";
import { URL_BASE_SERVICIOS, API_ENDPOINTS } from "../../config/Endpoints.jsx";
import { IconInfoCircle } from "@tabler/icons-react";
import FirmaResguardoBienes from "./FirmaResguardoBienes.jsx";
 

const Resguardo = () => {
  const [conAutorizacion, setConAutorizacion] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [empleadoId, setEmpleadoId] = useState(1028);
  const [modalOpened, setModalOpened] = useState(false);
 
  const icon = <IconInfoCircle />;

  ///// Se agrega la constante url para la consulta de los registros de bienes sin asignar se usara en GET para llenado de tabla
  const url = useMemo(
    () =>
      `${URL_BASE_SERVICIOS}${API_ENDPOINTS.BienesSinFirmarResguardo}/` +
      empleadoId,
    [empleadoId]
  );

  const {
    data: fetched = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
    refetch,
  } = useGet(url, conAutorizacion, ["Resguardo"]);

  /// Se agrega el useEffect para refrescar la tabla
  useEffect(() => {
    refetch();
    console.log("Refetching...");
    console.log(fetched);
  }, [refreshData, url]);


  const defaultHeaders = {
    CodigoBien: "Código de Bien",
    NombreBien: "Nombre del Bien",
    FechaEfectos: "Fecha de Efectos",
    EstatusId: "Estatus del Bien",
    Descripcion: "Descripción",
    // Marca: "Marca",
    // Modelo: "Modelo",
    Serie: "Serie/QR/Codigo de Barras",
    Partida: "Objeto de Gasto",
    // Camb: "CAMB",
    // Cucop: "CUCOP",
    // NumeroContrato: "Número de Contrato",
    // NumeroFactura: "Número de Factura",
    // FechaFactura: "Fecha de Factura",
    // ValorFactura: "Valor de Factura",
    // ValorDepreciado: "Valor Depreciado",
    // UnidadAdministrativa: "Unidad Administrativa",
    Ubicacion: "Ubicación",
    empleado: "Empleado",
    EstadoFisicoId: "Estado Físico",
  };

  const columns = useMemo(() => {
    if (fetched && fetched.length > 0) {
      const columnsToInclude = [
        "codigoBien",
        "nombreBien",
        "fechaEfectos",
        "descripcion",
        "estatusId",
        "serie",
        "estadoFisicoId",
        "ubicacion",
      ];

      return columnsToInclude.map((key) => {
        let column = {
          accessorKey: key,
          // header: key.charAt(0).toUpperCase() + key.slice(1), // Convertir la clave a título
          header: defaultHeaders[key.charAt(0).toUpperCase() + key.slice(1)] ,  // Usar el valor de defaultHeaders como encabezado

        };

        // Personalizar la renderización de ciertas columnas
        if (key === "fechaEfectos") {
          column.Cell = ({ cell }) =>
            new Date(cell.getValue()).toLocaleDateString(); // Formatear la fecha
        } else if (key === "ubicacion") {
          column.Cell = ({ cell }) => cell.getValue()?.codigo || "N/A"; // Mostrar la descripción de la ubicación
        }

        return column;
      });
    }
    return [];
  }, [fetched]);
  //

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

  const handleFirmaSuccess = async () => {
    // console.log("handleFirmaSuccess");
    // refetch().then(() => {
    //   setDataUpdated(true); // Forzar la actualización del useEffect
    // });

    handleCloseModal();
    const tableRef = useRef();

    // const htmlContent = renderToString(element);

    // const emailRequest = {
    //   ToEmail: "recipient@example.com",
    //   Subject: "Resguardo de Bienes",
    //   Body: "Adjunto encontrará el resguardo de bienes en formato PDF.",
    //   PdfContent: htmlContent,
    // };
    // try {
    //   const response = await fetch("https://your-endpoint.com/api/send-email", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(emailRequest),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Error sending email");
    //   }

    //   console.log("Email sent successfully");
    // } catch (error) {
    //   console.error("Error sending email:", error);
    // }

    refetch();
    // window.location.reload(); // Forzar recarga de la página
  };
  const handleOpenModal = () => {
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
  };

   

  return (
    <div>
      <Paper shadow="xl" radius="md" p="xs" withBorder>
      <h2>Bienes Asignados</h2>
        {fetched.length > 0 ? (
          <>
           
          

            <MantineReactTable table={table} />
            
            <Space h="lg" />
            <Space h="lg" />
            <Grid>
              <Grid.Col span={6} />
              <Grid.Col span={3.5} />
              <Grid.Col span={2.5}>
                <Button
                  variant="filled"
                  style={{ backgroundColor: "var(--primary-color)" }}
                  size="xl"
                  radius="md"
                  // disabled={fetched.length === 0} // Habilita o deshabilita el botón basado en la selección
                  // component={Link}
                  // to="/firmarAsigacion"
                  onClick={handleOpenModal}
                >
                  <Stack direction="vertical" gap="xs">
                    <Space h="xs" />
                    <Text>Confirmar Resguardo de Bienes</Text>
                    E.Firma
                    <Space h="xs"></Space>
                  </Stack>
                </Button>
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <>
 
            <Space h="lg" />
            <Space h="lg" />
            <Grid>
              <Grid.Col span={3} />
              <Grid.Col span={6}>
                <Alert
                  variant="filled" 
                  color="var(--primary-color)"
                  radius="lg"
                  title="Aviso"
                  icon={icon}
                >
                  No tienes bienes asignados, favor de validar con el
                  administrador.
                </Alert>
              </Grid.Col>

              <Grid.Col span={3} />
            </Grid>

            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
            <Space h="lg" />
          </>
        )}
        <Modal
          opened={modalOpened}
          onClose={handleCloseModal}
          // title="Firma Electrónica"
          // size="lg"
          fullScreen
        >
          <FirmaResguardoBienes onSubmit={handleFirmaSuccess} datos={fetched} empleadoFirmanteResguardo={empleadoId} />
        </Modal>
      </Paper>
    </div>
  );
};

export default Resguardo;
