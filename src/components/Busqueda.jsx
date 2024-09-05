import React from "react";
import {
  Autocomplete,
  Select,
  TextInput,
  Button,
  Center,
  Fieldset,
  Group,
  Paper,
  Text,
  Grid,
  Space,
} from "@mantine/core";

const Busqueda = () => {
  const data = ["Estado", "Partida", "Estatus", "CAMP", "Contrato", "Cucop"];

  return (
    <Paper shadow="xl" radius="md" p="xs" withBorder >
      <Text align="center" weight={700} size="xl">
        Búsqueda de Bienes
      </Text>
      <Grid>
        <Grid.Col span={3} />

        <Grid.Col span={6}>
          <TextInput placeholder="Buscar" radius="md" />
        </Grid.Col>
        <Grid.Col span={3} />
      </Grid>

      <Space h="lg" />

      <Fieldset radius="md">
        <Grid>
          <Grid.Col span={2} />

          <Grid.Col span={8}>
            <Grid>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    Estado :
                  </Text>
                  <Select data={data} placeholder="Buscar por" radius="md" />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    Estatus :
                  </Text>
                  <Select data={data} placeholder="Buscar por" radius="md" />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    Contrato :
                  </Text>
                  <Select data={data} placeholder="Buscar por" radius="md" />
                </Group>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={2} />

          <Grid.Col span={2} />

          <Grid.Col span={8}>
            <Grid>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    Partida :
                  </Text>
                  <Select data={data} placeholder="Buscar por" radius="md" />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    CAMB :
                  </Text>
                  <Select data={data} placeholder="Buscar por" radius="md" />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    Cucop :
                  </Text>
                  <Select data={data} placeholder="Buscar por" radius="md" />
                </Group>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={2} />
        </Grid>
      </Fieldset>
      <Space h="lg" />
      <Grid>
        <Grid.Col span={4} />
        <Grid.Col span={4}>
          <Button variant="filled" style={{ backgroundColor: 'var(--primary-color)'}} fullWidth radius="md">Buscar</Button>
        </Grid.Col>

        <Grid.Col span={4} />
      </Grid>
    </Paper>
  );
};

export default Busqueda;
