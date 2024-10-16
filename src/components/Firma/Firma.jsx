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
  Modal,

} from "@mantine/core";
import React, { useState, useEffect } from "react";
import Titulo from "../Titulo.jsx";
import { IconFileUpload, IconCertificate, IconKey } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const Firma = ({ onSubmit, datosFirmar }) => {
  const [certFile, setCertFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); ///Para habilitar Boton de Firmar  hasta que esten todos los campos llenos

  const [opened, { open, close }] = useDisclosure(false);

  const icon = (
    <IconFileUpload style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  const iconKey = (
    <IconKey style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );
  const iconCert = (
    <IconCertificate style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  const handleCertFileChange = (file) => {
    setCertFile(file);
  };

  const handleKeyFileChange = (file) => {
    setKeyFile(file);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  
  const handleOpenModal = (event) => {
    event.preventDefault();
    open();
  };

  const handleSubmit = async () => {
    close();
    const formData = new FormData();
    formData.append("certificado", certFile);
    formData.append("clavePrivada", keyFile);
    formData.append("password", password);
    if (datosFirmar) {
      formData.append("datosFirmar", JSON.stringify(datosFirmar));
    }

    // console.log("firma asignacion bienes 2");
    // console.log("pass", password);
    console.log("cert", certFile);
    console.log("key", keyFile);
    console.log("datosFirmar", datosFirmar);

    // for (let pair of formData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]); 
    // }
  
    await onSubmit(formData);
   
  };

  useEffect(() => {
    if (certFile && keyFile && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [certFile, keyFile, password]);

  return (
    <Paper shadow="xl" radius="md" p="xs" withBorder>
      <Space h="xl" />
      <Titulo titulo="Firma Electrónica" />
      <Space h="xl" />
      <Space h="xl" />
      <Center>
        <Fieldset legend="Firma Electrónica" style={{ width: "50%" }}>
          <form onSubmit={handleOpenModal} >
          <Stack direction="vertical" spacing="xl">
            <Group grow wrap="nowrap">
              <Text size="xl" fw={700} style={{ textAlign: "right" }}>
                Certificado (.cer):
              </Text>
              <FileInput
                rightSection={iconCert}
                placeholder="Elegir archivo de Certificado..."
                onChange={handleCertFileChange}
                accept=".cer"
              />
            </Group>
            <Space h="xl" />
            <Group grow wrap="nowrap">
              <Text size="xl" fw={700} style={{ textAlign: "right" }}>
                Clave Privada (.key):
              </Text>
              <FileInput
                rightSection={iconKey}
                placeholder="Elegir archivo de Clave Privada..."
                onChange={handleKeyFileChange}
                accept=".key"
              />
            </Group>
            <Space h="xl" />
            <Group grow wrap="nowrap">
              <Text size="xl" fw={700} style={{ textAlign: "right" }}>
                Contraseña de Clave Privada:
              </Text>
              <TextInput
                type="password"
                placeholder="Ingrese su contraseña de Clave Privada..."
                autoComplete="off"
                onChange={handlePasswordChange}
              />
            </Group>
            <Space h="xl" />
            <Group grow wrap="nowrap">
              <span />
              <Button
                variant="filled"
                size="lg"
                style={{ backgroundColor: "var(--primary-color)" }}
                // onClick={open}
                type="submit"
                disabled={isButtonDisabled}
              >
                Firmar
              </Button>
            </Group>
          </Stack>
          </form>
        </Fieldset>
      </Center>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Modal opened={opened} onClose={close} title="Firma Electrónica">
        <h4>¿Desea confirmar el firmado electrónico?</h4>
        {/* <Space h="xl" /> */}
        <Group justify="center">
          <Button
            variant="filled"
            style={{ backgroundColor: "var(--primary-color)" }}
            onClick={handleSubmit}
          >
            Confirmar
          </Button>

          <Button
            variant="filled"
            style={{ backgroundColor: "var(--secondary-color)" }}
            onClick={close}
          >
            Cancelar
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};

export default Firma;
