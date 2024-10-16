import React, { useEffect, useState, useMemo,useContext} from "react";
import {
  FileInput,
  Table,
  Paper,
  rem,
  Grid,
  Space,
  Flex,
  Button,
  Tooltip,
  ActionIcon,
  Group,
  Text,
  Stack,
  Modal,
} from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  handleError,
  handleSuccess,
  handleInfo,
} from "../../helpers/Notificaciones.jsx";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import {
  useCreate,
  useGet,
  useUpdate,
  useDelete,
} from "../../hooks/useCRUDTables.js";
import { modals } from "@mantine/modals";
import { URL_BASE_SERVICIOS, API_ENDPOINTS } from "../../config/Endpoints.jsx";
import { Link } from "react-router-dom";  
import { EditedRowsContext } from "../../context/EdicionRowsContext.jsx";
import FirmaAsignacionBienes from "./FirmaAsignacionBienes.jsx";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

 


const AsignaBienes = ({ data, isLoading2, isError }) => {
  const [conAutorizacion, setConAutorizacion] = useState("");
  const [unidadAdministrativaId, setUnidadAdministrativaId] = useState(3);
  const [estatusId, setEstatusId] = useState(0);
  const [refreshData, setRefreshData] = useState(false);
  const [edited, setEdited] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [empleados, setEmpleados] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [dataUpdated, setDataUpdated] = useState(false); // Estado adicional para forzar la actualización
  const [tableData, setTableData] = useState(data);

  /// se agrega el contexto de EditedRowsContext
  const { editedRows, setEditedRows } = useContext(EditedRowsContext);


  const [modalOpened, setModalOpened] = useState(false);

  const queryClient = useQueryClient();


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
        `${URL_BASE_SERVICIOS}${API_ENDPOINTS.BuscarRegistroBien}`,
        {
          unidadAdministrativaId,
          estatusId,
        }
      ),
    [unidadAdministrativaId, estatusId]
  );

  const {
    mutateAsync: created,
    isLoading: isCreating,
    error: createError,
    isSuccess: createSuccess,
  } = useCreate(url, conAutorizacion,["AsignaBienes"]);

  const {
    data: fetched = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
    refetch,
  } = useGet(url, conAutorizacion,["AsignaBienes"]);

  const { mutateAsync: updated, isLoading: isUpdating } = useUpdate(
    url,
    conAutorizacion
    ,["AsignaBienes"]
  );

  const { mutateAsync: deleted } = useDelete(url, conAutorizacion,["AsignaBienes"]);

  /// Se agrega el useEffect para refrescar la tabla
  useEffect(() => {
    refetch();
  }, [refreshData, url]);



  ///////  Se agrega el useEffect para la consulta de empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch(
          `${URL_BASE_SERVICIOS}${API_ENDPOINTS.EmpleadosxUnidad}${unidadAdministrativaId}`
        );
        const data = await response.json();
        setEmpleados(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmpleados();
  }, [unidadAdministrativaId]);

 
  const handleCreate = async ({ data, exitCreateMode }) => {
    try {
      // await created(data, url, conAutorizacion);
      await created(data);
      exitCreateMode();
      if (createSuccess) {
        handleSuccess("Registro AsignaBienes");
      }
    } catch (error) {
      console.error(error);
      if (createError) {
        handleError("Error al crear el registro: " + error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await updated(Object.values(edited));
      exitCreateMode();
      if (createSuccess) {
        handleSuccess("Registro actualizado correctamente");
      }
    } catch (error) {
      console.error(error);
      if (createError) {
        handleError("Error al actualizar el registro: " + error);
      }
    }
  };

  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: "Seguro que deseas aplicar baja lógica el registro?",
      children: (
        <Text>
          Oprime Baja Lógica para confirmar la baja lógica del registro
        </Text>
      ),
      labels: { confirm: "Baja Lógica", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => deleted(row.original.id),
    });

    
  const columnsToExclude = ["id", "FotoBien", "FotoBienFile", "fotosBienActivo",""]; // Array de claves a excluir

 

  const defaultHeaders = {
    CodigoBien: "Código de Bien",
    NombreBien: "Nombre del Bien",
    FechaEfectos: "Fecha de Efectos",
    EstatusId: "Estatus del Bien",
    // FotoBien: "Foto del Bien",
    Descripcion: "Descripción",
    Marca: "Marca",
    Modelo: "Modelo",
    Serie: "Serie/QR/Codigo de Barras",
    Partida: "Objeto de Gasto",
    Camb: "CAMB",
    Cucop: "CUCOP",
    NumeroContrato: "Número de Contrato",
    NumeroFactura: "Número de Factura",
    FechaFactura: "Fecha de Factura",
    ValorFactura: "Valor de Factura",
    ValorDepreciado: "Valor Depreciado",
    UnidadAdministrativa: "Unidad Administrativa",
    Ubicacion: "Ubicación",
    empleado: "Empleado",
    EstadoFisicoId: "Estado Físico",
  };


  
  const columns = useMemo(() => {
     if (tableData && tableData.length > 0) {
      return Object.keys(tableData[0])
        .filter((key) => !columnsToExclude.includes(key) ) // Filtrar las claves a excluir y que estén en defaultHeaders
        .map((key) => {
          const isObject =
            typeof tableData[0][key] === "object" && tableData[0][key] !== null;
          if (key === "empleado") {
            return {
              accessorKey: key,
              header: defaultHeaders[key],
              accessorFn: (originalRow) =>
                originalRow[key]?.id?.toString() || "", // Convertir id a cadena para el filtrado
              Cell: ({ row }) => {
                const value = row.original[key];
                if (value) {
                  const { rfc, nombre, apellidoPaterno, apellidoMaterno } =
                    value;
                  return `${rfc} ${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
                }
                return ""; // Valor por defecto si empleado es nulo
              },
              editVariant: "select",
              filterVariant: "select",
              mantineFilterSelectProps: {
                data:
                  empleados.length > 0
                    ? empleados.map((emp) => ({
                        value: emp.id.toString(),
                        label: `${emp.rfc} ${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`,
                      }))
                    : [{ value: "", label: "" }],
              },
            };
          }
          return {
            accessorKey: key,
            header: defaultHeaders[key.charAt(0).toUpperCase() + key.slice(1)] ,  // Usar el valor de defaultHeaders como encabezado
                    // header: key.charAt(0).toUpperCase() + key.slice(1), 
            enableEditing: false,
            Cell: ({ row }) => {
              const value = row.original[key];
              return isObject ? value?.descripcion || "N/A" : value ?? "N/A"; // Mostrar 'N/A' si no existe 'descripcion' o si el valor es null
            },
          };
        });
    }
    return [];
  }, [tableData, empleados, columnsToExclude]);

  
  // const columns = useMemo(() => {
  //   if (tableData && tableData.length > 0) {
  //     return Object.keys(tableData[0])
  //       .filter((key) => !columnsToExclude.includes(key)) // Filtrar las claves a excluir
  //       .map((key) => {
  //         const isObject =
  //           typeof tableData[0][key] === "object" && tableData[0][key] !== null;
  //         if (key === "empleado") {
  //           return {
  //             accessorKey: key,
  //             header: "Empleado",
  //             accessorFn: (originalRow) =>
  //               originalRow[key]?.id?.toString() || "", // Convertir id a cadena para el filtrado
  //             Cell: ({ row }) => {
  //               const value = row.original[key];
  //               if (value) {
  //                 const { rfc, nombre, apellidoPaterno, apellidoMaterno } =
  //                   value;
  //                 return `${rfc} ${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
  //               }
  //               return ""; // Valor por defecto si empleado es nulo
  //             },
  //             editVariant: "select",
  //             filterVariant: "select",
  //             mantineFilterSelectProps: {
  //               data:
  //                 empleados.length > 0
  //                   ? empleados.map((emp) => ({
  //                       value: emp.id.toString(),
  //                       label: `${emp.rfc} ${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`,
  //                     }))
  //                   : [{ value: "", label: "" }],
  //             },
  //           };
  //         }
  //         return {
  //           accessorKey: key,
  //           header: key.charAt(0).toUpperCase() + key.slice(1), // Convertir la clave a título
  //           enableEditing: false,
  //           Cell: ({ row }) => {
  //             const value = row.original[key];
  //             return isObject ? value?.descripcion || "N/A" : value ?? "N/A"; // Mostrar 'N/A' si no existe 'descripcion' o si el valor es null
  //           },
  //         };
  //       });
  //   }
  //   return [];
  // }, [tableData, empleados, columnsToExclude]);
  
  // [fetched, edited, empleados, validationErrors,setEditedRows]);


  useEffect(() => {
    //do something when the row selection changes...
    console.info({ rowSelection });
  }, [rowSelection]);


  const table = useMantineReactTable({
    // columns: data.length >0 ? columnsData : columns,
    columns: columns,
    // data: data.length >0 ? data : fetched,
    data:tableData,
    localization: MRT_Localization_ES,
    createDisplayMode: "row",
    editDisplayMode: "table",
 
// selectDisplayMode: 'switch',
    enableRowSelection: (row) => edited.hasOwnProperty(row.id), // Solo permite la selección de filas contenidas en edited
     getRowId: (row) => row.id, 

    onRowSelectionChange: setRowSelection,
    selectAllMode: "all",
    initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
    // positionToolbarAlertBanner: 'bottom',

    // positionActionsColumn: "last",
    // enableRowActions: true,

    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableEditing: true,
    mantineTableContainerProps: {
      sx: {
        // minHeight: '500px',
        tableLayout: "auto",
      },
    },
    
    getRowId: (row) => row.id,

    mantineToolbarAlertBannerProps: isLoadingError
      ? {
          color: "red",
          children: "Error al obtener los datos, por favor intenta de nuevo.",
        }
      : undefined,

    mantineSelectCheckboxProps: {
      color: "var(--primary-color)",
    },
    mantineSelectAllCheckboxProps: {
      color: "var(--primary-color)",
    },
    mantinePaginationProps: {
      color: "var(--primary-color)",
      // withEdges: false,
      // showRowsPerPage: true,
    },

    
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreate,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdate,
 
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Editar">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Borrar">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    mantineEditSelectProps: ({ cell, row }) => ({
      data:
        empleados.length > 0
          ? empleados.map((emp) => ({
              value: emp.id.toString(),
              label: `${emp.rfc} ${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`,
            }))
          : [{ value: "", label: "" }],
      error: validationErrors?.empleado,
      onChange: (value) => {
        setEdited((prevEdited) => {
          const newEdited = {
            ...prevEdited,
            [row.id]: { ...row.original, [cell.column.id]: value },
          };
          console.log("Edited Object (onChange):", newEdited);
          return newEdited;
        });
        setEditedRows((prevEdited) => {
          const newEdited = {
            ...prevEdited,
            [row.id]: { ...row.original, [cell.column.id]: value },
          };
          console.log("Edited Object (onChange):", newEdited);
          return newEdited;
        });
        
      },
    }),
    state: {
      isLoading: isLoading,
      isSaving: isCreating || isUpdating,
      showAlertBanner: isLoadingError,
      showProgressBars: isFetching,
      rowSelection 
    },
    
  });

  const handleOpenModal = () => {
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
  };
  const handleFirmaSuccess = () => {
    // console.log("handleFirmaSuccess");
    // refetch().then(() => {
    //   setDataUpdated(true); // Forzar la actualización del useEffect
    // });
    queryClient.invalidateQueries('AsignaBienes');
    setDataUpdated(true);
    handleCloseModal();
    refetch();
    // window.location.reload(); // Forzar recarga de la página

  };


  useEffect(() => {
    if (fetched.length > 0 || dataUpdated) {
      setRowSelection({});
      setEdited({});
      setEditedRows({});
      console.log("useEffect rowSelection", rowSelection);
      setDataUpdated(false); // Resetear el estado
      setTableData(fetched); // Actualiza el estado de tableData con fetched

    }
  }, [fetched, dataUpdated, setEditedRows,data]);

  useEffect(() => {
    if (data.length > 0) {
      setTableData(data);
      setRowSelection({});
      setEdited({});
      setEditedRows({});
      setDataUpdated(false); // Resetear el estado
      clearSelectionAndEdits();

    }
  }, [data]);
  
    // Función para limpiar las variables de selección y edición
    const clearSelectionAndEdits = () => {
      setRowSelection({});
      setEdited({});
      setEditedRows({});
    };
  
    // useEffect(() => {
    //   clearSelectionAndEdits();
    // }, [data]); // Limpiar cuando los datos cambian
 
 
    

  return (
    <Paper shadow="xl" radius="md" p="xs" withBorder>
      <MantineReactTable table={table} />
      <Space h="lg" />
      <Grid>
        <Grid.Col span={6} />
        <Grid.Col span={3.5} />
        <Grid.Col span={2.5}>
          <Button
            variant="filled"
            style={{ backgroundColor: "var(--secondary-color)" }}
            size="xl"
            radius="md"
            disabled={Object.keys(rowSelection).length=== 0} // Habilita o deshabilita el botón basado en la selección
            // component={Link}
            // to="/firmarAsigacion"
            onClick={handleOpenModal}

          >
            {" "}
            <Stack direction="vertical" gap="xs">
              <Space h="xs" />
              <Text>Confirmar asignación de Bienes</Text>
              E.Firma
              <Space h="xs"></Space>
            </Stack>
          </Button>
        </Grid.Col>
      </Grid>
      <Space h="lg" />
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        // title="Firma Electrónica"
        // size="lg"
        fullScreen
      >
        <FirmaAsignacionBienes onSubmit={handleFirmaSuccess} />
      </Modal>  
    </Paper>
  );
};

export default AsignaBienes;
