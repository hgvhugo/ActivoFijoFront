import React, { useEffect, useState, useMemo, useRef } from "react";
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
  LoadingOverlay,Loader
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
import { saveAs } from 'file-saver';
import { URL_BASE_SERVICIOS,API_ENDPOINTS } from "../../config/Endpoints.jsx";

const CargaMasiva = () => {
  const [file, setFile] = useState(null);
  const [datosExcel, setDatosExcel] = useState([]);
  const [url, setUrl] = useState("http://localhost:3001/api/consulta");
  const [conAutorizacion, setConAutorizacion] = useState("");
  const [bulkLoad, setBulkLoad] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

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
    EmpleadoId: "",
  };

  //   const { data, refetch } = useGet(url, conAutorizacion);

  //   useEffect(() => {
  //     refetch();
  //   }, [data]);

  const bulkLoadF = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("archivo", file);

      const response = await fetch(
        // "http://localhost:5056/api/RegistroBienes/cargar-excel",
        URL_BASE_SERVICIOS+API_ENDPOINTS.CargaMasiva, 
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        handleSuccess("Carga masiva exitosa");
        setBulkLoad(!bulkLoad);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Restablecer el valor del input de archivo
         }
    

      } else {
        handleError("Error en la carga masiva");
      }
    } catch (error) {
      console.error(error);
      handleError("Error en la carga masiva");
    }
    finally{
      setIsLoading(false);
      setFile(null);
    }
  };


  const handleCreate = async ({ data, exitCreateMode }) => {
    try {
      // await created(data, url, conAutorizacion);
      await created(data);
      exitCreateMode();
      if (createSuccess) {
        handleSuccess("Registro cargado correctamente");
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
 

  const validateHeaders = (worksheet) => {
    const firstRow = worksheet.getRow(1);
    const headers = [];
    firstRow.eachCell((cell) => {
      headers.push(cell.value);
    });
    const expectedHeaders = Object.keys(defaultHeaders);
    return (
      headers.length === expectedHeaders.length &&
      headers.every((header, index) => header === expectedHeaders[index])
    );
  };


  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Layout');
  
    // Añadir encabezados con formato de texto
    worksheet.columns = Object.keys(defaultHeaders).map(header => ({
      header,
      key: header,
      width: 20, // Puedes ajustar el ancho de las columnas según sea necesario
      style: { numFmt: '@' } // Formato de texto
    }));
  
   
  
    // Añadir filas adicionales (ejemplo de datos)
    const dataRows = [
      {
        CodigoBien: "001",
        NombreBien: "Laptop",
        FechaEfectos: "2023-01-01",
        EstatusId: "Activo",
        FotoBien: "foto.jpg",
        Descripcion: "Laptop Dell",
        Marca: "Dell",
        Modelo: "XPS 13",
        Serie: "12345",
        PartidaId: "001",
        CambId: "002",
        CucopId: "003",
        NumeroContrato: "004",
        NumeroFactura: "005",
        FechaFactura: "2023-01-01",
        ValorFactura: "1000",
        ValorDepreciado: "800",
        UnidadAdministrativaId: "006",
        UbicacionId: "007",
        EmpleadoId: "008",
      },
      // Puedes añadir más filas aquí
    ];
  
    dataRows.forEach(data => {
      const row = worksheet.addRow(data);
      row.eachCell(cell => {
        cell.numFmt = '@'; // Aplicar formato de texto a cada celda
      });
    });
  
    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
  
    // Guardar el archivo
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'layout.xlsx');
  };

  
  const handleFileChange = async (selectedFile) => {
    setBulkLoad(false);
    setFile(selectedFile);
    setFileName(selectedFile.name);

    const acceptedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (selectedFile && !acceptedTypes.includes(selectedFile.type)) {
      handleError(
        "El tipo de archivo no es aceptado. Por favor, seleccione un archivo .xlsx."
      );
      setError(
        "El tipo de archivo no es aceptado. Por favor, seleccione un archivo .xlsx."
      );
      // setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      if (!validateHeaders(worksheet)) {
        handleError("El archivo Excel no tiene la estructura esperada.");
        console.log("El archivo Excel no tiene la estructura esperada.");
        setFile(null);
        return;
      }

      const parsedData = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          rowData[worksheet.getRow(1).getCell(colNumber).value] = cell.value;
        });
        parsedData.push(rowData);
      });

      setDatosExcel(parsedData);
      console.log(parsedData)
      setBulkLoad(true);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

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
    // data: datosExcel,
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Flex align="center" gap="md">
        <Button
          style={{ backgroundColor: "var(--primary-color)" }}
          onClick={exportToExcel}
          disabled={bulkLoad}
        >
          Obtener Layout
        </Button>
        <Button
          style={{ backgroundColor: "var(--primary-color)" }}
          onClick={() => {
            table.setCreatingRow(true);
          }}
          disabled={bulkLoad}
        >
          Nuevo Registro
        </Button>
        {bulkLoad && (
          <Button
            style={{ backgroundColor: "var(--primary-color)" }}
            onClick={ bulkLoadF }
            // disabled={!bulkLoad}
          >
            Confirmar Carga
          </Button>
        )}
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
      <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'var(--primary-color)', type: 'bars',size:'xl'  ,children:<div> <center>  <Loader   color='var(--primary-color)' size="xl" type="bars"  />Procesando archivo {fileName} ...</center></div> }}
        />
      <Grid>
        <Grid.Col span={4} />
        <Grid.Col span={4}>
          <FileInput
            leftSection={icon}
            label="Carga Masiva"
            placeholder="Seleccione un archivo..."
            onChange={handleFileChange}
            accept=".xlsx"
            ref={fileInputRef}
            clearable
            error={error}
            value={file} // Controlar el valor del input de archivo
          />
        </Grid.Col>
        <Grid.Col span={4} />
      </Grid>
      <Space h="lg" />
      <MantineReactTable table={table} />
    </Paper>
  );
};

export default CargaMasiva;
