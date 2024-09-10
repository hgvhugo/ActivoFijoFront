import React from "react";
import { Paper, Text, Grid, TextInput, Select, Fieldset, Space, Button, Group } from "@mantine/core";

const Busqueda = ({ filters, setFilters, onSearch }) => {
  const data = ["Estado", "Partida", "Estatus", "CAMP", "Contrato", "Cucop"];
  const estatusId= ["Sin Asignar", "Asignado", "Mantenimeinto", "Baja"].map((item, index) => ({ value: index.toString(), label: item }));
  const estadoId = ["Malo", "Regular", "Bueno"].map((item, index) => ({ value: index.toString(), label: item }));
  const campId = ["Camp0", "Camp1", "Camp2", "Camp3"].map((item, index) => ({ value: index.toString(), label: item }));
  const partidaId = ["Partida 0", "Partida 1", "Partida 2", "Partida 3"].map((item, index) => ({ value: index.toString(), label: item }));
  const cucopId = ["cucop 0", "cucop 1", "cucop 2", "cucop 3"].map((item, index) => ({ value: index.toString(), label: item }));
  const contrato = ["contrato 0", "contrato 1", "contrato 2", "contrato 3"].map((item, index) => ({ value: index.toString(), label: item }));

  const handleChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return (
    <Paper shadow="xl" radius="md" p="xs" withBorder>
      <Text align="center" weight={700} size="xl">
        Búsqueda de Bienes
      </Text>
      <Grid>
        <Grid.Col span={3} />

        <Grid.Col span={6}>
          <TextInput
            placeholder="Buscar"
            radius="md"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
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
                  <Select
                    data={estadoId}
                    placeholder="Buscar por"
                    radius="md"
                    value={filters.estadoId}
                    onChange={(value) => handleChange("estadoId", value)}
                    clearable
                  />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    Estatus :
                  </Text>
                  <Select
                    data={estatusId}
                    placeholder="Buscar por"
                    radius="md"
                    value={filters.estatusId}
                    onChange={(value) => handleChange("estatusId", value)}
                    clearable
                  />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    Contrato :
                  </Text>
                  <Select
                    data={contrato}
                    placeholder="Buscar por"
                    radius="md"
                    value={filters.contrato}
                    onChange={(value) => handleChange("contrato", value)}
                    clearable
                  />
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
                  <Select
                    data={partidaId}
                    placeholder="Buscar por"
                    radius="md"
                    value={filters.partidaId}
                    onChange={(value) => handleChange("partidaId", value)}
                    clearable
                  />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    CAMB :
                  </Text>
                  <Select
                    data={campId}
                    placeholder="Buscar por"
                    radius="md"
                    value={filters.campId}
                    onChange={(value) => handleChange("campId", value)}
                    clearable
                  />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Group grow wrap="nowrap">
                  <Text fw={700} align="center">
                    {" "}
                    Cucop :
                  </Text>
                  <Select
                    data={cucopId}
                    placeholder="Buscar por"
                    radius="md"
                    value={filters.cucopId}
                    onChange={(value) => handleChange("cucopId", value)}
                    clearable
                  />
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
          <Button
            variant="filled"
            style={{ backgroundColor: 'var(--primary-color)' }}
            fullWidth
            radius="md"
            onClick={onSearch}
          >
            Buscar
          </Button>
        </Grid.Col>
        <Grid.Col span={4} />
      </Grid>
    </Paper>
  );
};

export default Busqueda;