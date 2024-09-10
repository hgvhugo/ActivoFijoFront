import React, { useEffect, useState, useMemo } from "react";
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

const AsignaBienes = ({ data, isLoading2, isError }) => {
  const [conAutorizacion, setConAutorizacion] = useState("");
  const [unidadAdministrativaId, setUnidadAdministrativaId] = useState(3);
  const [estatusId, setEstatusId] = useState(0);
  const [refreshData, setRefreshData] = useState(false);
  const [edited, setEdited] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [empleados, setEmpleados] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

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
  } = useCreate(url, conAutorizacion);

  const {
    data: fetched = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
    refetch,
  } = useGet(url, conAutorizacion);

  const { mutateAsync: updated, isLoading: isUpdating } = useUpdate(
    url,
    conAutorizacion
  );

  const { mutateAsync: deleted } = useDelete(url, conAutorizacion);

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
  }, []);

  console.log(empleados);

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

  const defaultHeaders = {
    CodigoBien: "",
    NombreBien: "",
    FechaEfectos: "",
    EstatusId: "",
    FotoBien: "",
    Descripcion: "",
    Marca: "",
    Modelo: "",
    Serie: "",
    PartidaId: "",
    CambId: "",
    CucopId: "",
    NumeroContrato: "",
    NumeroFactura: "",
    FechaFactura: "",
    ValorFactura: "",
    ValorDepreciado: "",
    UnidadAdministrativaId: "",
    UbicacionId: "",
  };

  const columnsToExclude = ["id", "FotoBien", "FotoBienFile", ""]; // Array de claves a excluir

  const columns = useMemo(() => {
    if (fetched && fetched.length > 0) {
      return Object.keys(fetched[0])
        .filter((key) => !columnsToExclude.includes(key)) // Filtrar las claves a excluir
        .map((key) => {
          const isObject =
            typeof fetched[0][key] === "object" && fetched[0][key] !== null;
          if (key === "empleado") {
            return {
              accessorKey: key,
              header: "Empleado",
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
              // mantineEditSelectProps: ({cell, row }) => ({
              //   data: empleados.length > 0 ? empleados.map(emp => ({

              //     value: emp.id.toString(),
              //     label: `${emp.rfc} ${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`
              //   })) : [{ value: '', label: '' }],
              //   error: validationErrors?.empleado,
              //   onChange: (value) => {
              //     setEdited({
              //       ...edited,
              //       [row.id]: { ...row.original, [cell.column.id]: value },
              //     });
              //     console.log("Edited Object (onChange):", edited);
              //   },
              //   onBlur: (event) => {
              //     if (row.id !== "mrt-row-create") {
              //       setEdited({ ...edited, [row.id]: row._valuesCache });
              //       console.log("Edited Object (onBlur):", edited);
              //     }
              //   },
              // }),
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
            header: key.charAt(0).toUpperCase() + key.slice(1), // Convertir la clave a título
            enableEditing: false,
            Cell: ({ row }) => {
              const value = row.original[key];
              return isObject ? value?.descripcion || "N/A" : value ?? "N/A"; // Mostrar 'N/A' si no existe 'descripcion' o si el valor es null
            },
            mantineEditTextInputProps: ({ cell, row }) => ({
              onBlur: (event) => {
                if (row.id !== "mrt-row-create") {
                  setEdited({ ...edited, [row.id]: row._valuesCache });
                }
              },
            }),
          };
        });
    }
    return [];
  }, [fetched, edited, empleados, validationErrors]);


  
  const columnsData = useMemo(() => {
    if (data && data.length > 0) {
      return Object.keys(data[0])
        .filter((key) => !columnsToExclude.includes(key)) // Filtrar las claves a excluir
        .map((key) => {
          const isObject =
            typeof data[0][key] === "object" && data[0][key] !== null;
          if (key === "empleado") {
            return {
              accessorKey: key,
              header: "Empleado",
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
            header: key.charAt(0).toUpperCase() + key.slice(1), // Convertir la clave a título
            enableEditing: false,
            Cell: ({ row }) => {
              const value = row.original[key];
              return isObject ? value?.descripcion || "N/A" : value ?? "N/A"; // Mostrar 'N/A' si no existe 'descripcion' o si el valor es null
            },
            mantineEditTextInputProps: ({ cell, row }) => ({
              onBlur: (event) => {
                if (row.id !== "mrt-row-create") {
                  setEdited({ ...edited, [row.id]: row._valuesCache });
                }
              },
            }),
          };
        });
    }
    return [];
  }, [data, edited, empleados, validationErrors]);

  const table = useMantineReactTable({
    columns: data.length >0 ? columnsData : columns,
    data: data.length >0 ? data : fetched,
    localization: MRT_Localization_ES,
    createDisplayMode: "row",
    editDisplayMode: "table",

    enableRowSelection: (row) => edited.hasOwnProperty(row.id), // Solo permite la selección de filas contenidas en edited
    getRowId: (row) => row.id,
    // onRowSelectionChange: (rows) => setSelectedRows(rows),
     // selectDisplayMode: 'switch',

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
    mantineTableContainerProps: {
      sx: {
        // minHeight: '500px',
        tableLayout: "auto",
      },
    },

    mantineSelectCheckboxProps: {
      color: "var(--primary-color)",
    },
    mantineSelectAllCheckboxProps: {
      color: "var(--primary-color)",
    },
    mantinePaginationProps: {
      color: "var(--primary-color)",
      withEdges: false,
      showRowsPerPage: true,
    },

    // onEditingRowChange: (row, key, value) => {
    //   setEdited({ ...edited, [row.id]: { ...row._valuesCache, [key]: value } });
    // },

    // paginationDisplayMode: "pages",
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
      },
    }),
    state: {
      isLoading: isLoading,
      isSaving: isCreating || isUpdating,
      showAlertBanner: isLoadingError,
      showProgressBars: isFetching,
      selectedRows: selectedRows,
    },
    
  });

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
            disabled={selectedRows.length === 0} // Habilita o deshabilita el botón basado en la selección
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
    </Paper>
  );
};

export default AsignaBienes;
