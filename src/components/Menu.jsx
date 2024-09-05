import React, { useState } from 'react';
import { Burger, Drawer, TextInput, NavLink, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconHome, IconChevronRight } from '@tabler/icons-react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';

const Menu = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');
  const [options] = useState([
    { label: 'Inicio', path: '/' },
    { label: 'Recepción de Bienes', path: '/recepcionBienes' },
    { label: 'Contacto', path: '/contacto' },
  ]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <Burger opened={opened} onClick={toggle} size="sm" />
      <Drawer
        opened={opened}
        onClose={toggle}
        title="Menú"
        padding="md"
        size="sm"
      >
        <TextInput
          placeholder="Buscar..."
          icon={<IconSearch size={14} />}
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          mb="md"
        />
        {filteredOptions.map((option) => (
          <NavLink
            key={option.path}
            label={option.label}
            component={RouterNavLink}
            to={option.path}
            icon={<IconChevronRight size={14} />}
          />
        ))}
        <NavLink
          label="Más Opciones"
          icon={<IconHome size={14} />}
          childrenOffset={28}
        >
          <NavLink
            label="Opción Anidada 1"
            component={RouterNavLink}
            to="/opcion-anidada-1"
          />
          <NavLink
            label="Opción Anidada 2"
            component={RouterNavLink}
            to="/opcion-anidada-2"
          />
        </NavLink>
      </Drawer>
    </>
  );
};

export default Menu;