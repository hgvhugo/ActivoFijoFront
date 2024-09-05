import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
 
 

export function useCreate(url, conAutorizacion) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (registro) => {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (conAutorizacion && conAutorizacion.trim() !== '') {
        headers['Authorization'] = `Bearer ${conAutorizacion}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(registro),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.data;
    },
    onMutate: (nuevoRegistro) => {
      queryClient.setQueryData(['consulta'], (regPrevios) => [
        ...regPrevios,
        {
          ...nuevoRegistro,
        },
      ]);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['menus'], (old) => [
        ...(Array.isArray(old) ? old : []),
        data,
      ]);
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['consulta'] }),
  });
}export function useGet(url, conAutorizacion) {
  console.log('useGet se está ejecutando');

  return useQuery({
    queryKey: ['consulta'],
    queryFn: async () => {
      console.log('queryFn se está ejecutando');

      const headers = {};
      if (conAutorizacion && conAutorizacion.trim() !== '') {
        console.log('Haciendo petición con autorización');
        headers['Authorization'] = `Bearer ${conAutorizacion}`;
      } else {
        console.log('Haciendo petición sin autorización');
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Respuesta recibida', data);

      const datos = data.data.map((dato) => ({
        ...dato,
      }));
      console.log('datos*******************');
      console.log(datos);
      return datos;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUpdate(url, conAutorizacion) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (registro) => {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (conAutorizacion && conAutorizacion.trim() !== '') {
        headers['Authorization'] = `Bearer ${conAutorizacion}`;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(registro),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Respuesta recibida', data);

      const datos = data.data.map((dato) => ({
        ...dato,
      }));
      console.log('datos*******************');
      console.log(datos);
      return datos;
    },
    onMutate: (nuevoRegistro) => {
      queryClient.setQueryData([queryClient], (registrosPrevios) =>
        registrosPrevios?.map((registroPrevio) =>
          registroPrevio.id === nuevoRegistro.id ? nuevoRegistro : registroPrevio,
        ),
      );
    },
    onSuccess: () => queryClient.invalidateQueries(['consulta']),
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useDelete(url, conAutorizacion) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (registro) => {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (conAutorizacion && conAutorizacion.trim() !== '') {
        headers['Authorization'] = `Bearer ${conAutorizacion}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(registro),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Respuesta recibida', data);

      const datos = data.data.map((dato) => ({
        ...dato,
      }));
      console.log('datos*******************');
      console.log(datos);
      return datos;
    },
    onMutate: (userId) => {
      queryClient.setQueryData(['consulta'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
    onSuccess: () => queryClient.invalidateQueries([queryClient]),
    onError: (error) => {
      console.error(error);
    },
  });
}