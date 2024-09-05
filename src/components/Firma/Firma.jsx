import {
  Group,
  Paper,
  Space,
  Text,
  FileInput,
  Center,
  Stack,
  rem,
  Fieldset,
  Button,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import Titulo from "../Titulo.jsx";
import { IconFileUpload, IconCertificate , IconKey } from "@tabler/icons-react";

const Firma = () => {
  const [certFile, setCertFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);

  const icon = (
    <IconFileUpload style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  const iconKey = (
    <IconKey style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );
  const iconCert = (
    <IconCertificate style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );
  const handleCertFileChange = (event) => {
    const file = event.target.files[0];
    setCertFile(file);
  };

  const handleKeyFileChange = (event) => {
    const file = event.target.files[0];
    setKeyFile(file);
  };

  return (
    <Paper shadow="xl" radius="md" p="xs" withBorder>
      <Space h="xl" />
      <Titulo titulo="Firma Electrónica" />
      <Space h="xl" />
      <Space h="xl" />
      <Center>
        <Fieldset legend="Firma Electrónica" style={{ width: "50%" }}>
        <Stack direction="vertical" spacing="xl">
          <Group grow wrap="nowrap">
            <Text  size="xl" fw={700} style={{ textAlign: "right" }}>Certificado (.cer):</Text>
            <FileInput
              rightSection={iconCert}
              placeholder="Elegir archivo de Certificado..."
              onChange={handleCertFileChange}
              accept=".cer"
            />
          </Group>
          <Space h="xl" />
          <Group grow wrap="nowrap">
            <Text  size="xl" fw={700} style={{ textAlign: "right" }}>Clave Privada (.key):</Text>
            <FileInput
              rightSection={iconKey}
              placeholder="Elegir archivo de Clave Privada..."
              onChange={handleKeyFileChange}
              accept=".key"
            />
          </Group>
          <Space h="xl" />
          <Group grow wrap="nowrap">
            <Text  size="xl" fw={700} style={{ textAlign: "right" }}>Contraseña de Clave Privada:</Text>
            <TextInput
              type="password"
              placeholder="Ingrese su contraseña de Clave Privada..."
              onChange={handleKeyFileChange}       
            />
          </Group>
          <Space h="xl" />     
          <Group grow wrap="nowrap">
            <span/>
            <Button  variant="filled" size="lg"  style={{ backgroundColor: 'var(--primary-color)'}}> Firmar </Button>      
            </Group>
        </Stack>
        </Fieldset>
      </Center>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
    </Paper>
  );
};

export default Firma;
