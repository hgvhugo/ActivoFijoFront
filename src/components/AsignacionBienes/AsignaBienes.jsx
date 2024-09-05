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
import { IconFileUpload, IconEdit, IconTrash } from "@tabler/icons-react";
import ExcelJS from "exceljs";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import {
  useCreate,
  useGet,
  useUpdate,
  useDelete,
} from "../../hooks/useCRUDTables.js";
import { modals } from "@mantine/modals";

const AsignaBienes = () => {
  const [file, setFile] = useState(null);
  const [datosExcel, setDatosExcel] = useState([]);
  const [url, setUrl] = useState("http://localhost:3001/api/consulta");
  const [conAutorizacion, setConAutorizacion] = useState("");
  const [bulkLoad, setBulkLoad] = useState(false);

  const icon = (
    <IconFileUpload style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  const {
    mutateAsync: created,
    isLoading: isCreating,
    error: createError,
    isSuccess: createSuccess,
  } = useCreate(url, conAutorizacion);
  //   const {
  //     data: fetched = [],
  //     isError: isLoadingError,
  //     isFetching: isFetching,
  //     isLoading: isLoading,
  //   } = useGet(url, conAutorizacion);

  const { mutateAsync: updated, isLoading: isUpdating } = useUpdate(
    url,
    conAutorizacion
  );
  const { mutateAsync: deleted, isLoading: isDeleting } = useDelete(
    url,
    conAutorizacion
  );

  const [edited, setEdited] = useState({});

  const [validationErrors, setValidationErrors] = useState({});

  //   const { data, refetch } = useGet(url, conAutorizacion);

  //   useEffect(() => {
  //     refetch();
  //   }, [data]);

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

  const handleFileChange = async (selectedFile) => {
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);
      const parsedData = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          rowData[worksheet.getRow(1).getCell(colNumber).value] = cell.value;
        });
        parsedData.push(rowData);
      });
      //   console.log("Datos parseados:", parsedData);
      setDatosExcel(parsedData);
      setBulkLoad(true);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

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

    const columns = useMemo(() => {
        const headers = datosExcel.length === 0 ? defaultHeaders : datosExcel[0];
        const cols = Object.keys(headers).map((key) => ({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          accessorKey: key,
          mantineEditTextInputProps: ({ cell, row }) => ({
            onBlur: (event) => {
              if (row.id !== "mrt-row-create") {
                setEdited({ ...edited, [row.id]: row._valuesCache });
              }
            },
          }),
        }));
    
        // console.log(cols);
        return cols;
      }, [datosExcel, edited]);

  const table = useMantineReactTable({
    columns: columns,
    data: datosExcel,
    localization: MRT_Localization_ES,
    createDisplayMode: "row",
    editDisplayMode: "row",
    positionActionsColumn: "last",

    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableEditing: bulkLoad ? false : true,
    enableRowActions: true,

    mantineTableContainerProps: {
      sx: {
        // minHeight: '500px',
        tableLayout: "auto",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreate,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdate,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Editar">
          <ActionIcon
            onClick={() => table.setEditingRow(row)}
            disabled={bulkLoad}
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Borrar">
          <ActionIcon
            color="red"
            onClick={() => openDeleteConfirmModal(row)}
            disabled={bulkLoad}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),

    state: {
      // isLoading: isLoading,
      isSaving: isCreating || isUpdating || isDeleting,
      // showAlertBanner: isLoadingError,
      // showProgressBars: isFetching,
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
          <Button variant="filled" style={{ backgroundColor: 'var(--secondary-color)'}}  size="xl" radius="md" disabled >
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
