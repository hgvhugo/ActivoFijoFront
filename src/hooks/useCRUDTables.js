import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
 
 

export function useCreate(url, conAutorizacion, queryKey = ['consulta']) {
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
      return data;
    },
    onMutate: (nuevoRegistro) => {
      queryClient.setQueryData(queryKey, (regPrevios) => [
        ...regPrevios,
        {
          ...nuevoRegistro,
        },
      ]);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, (old) => [
        ...(Array.isArray(old) ? old : []),
        data,
      ]);
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useGet(url, conAutorizacion, queryKey = ['consulta']) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const headers = {};
      if (conAutorizacion && conAutorizacion.trim() !== '') {
        headers['Authorization'] = `Bearer ${conAutorizacion}`;
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
      return data;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUpdate(url, conAutorizacion, queryKey = ['consulta']) {
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
      return data;
    },
    onMutate: (nuevoRegistro) => {
      queryClient.setQueryData(queryKey, (registrosPrevios) =>
        registrosPrevios?.map((registroPrevio) =>
          registroPrevio.id === nuevoRegistro.id ? nuevoRegistro : registroPrevio,
        ),
      );
    },
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useDelete(url, conAutorizacion, queryKey = ['consulta']) {
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
      return data;
    },
    onMutate: (userId) => {
      queryClient.setQueryData(queryKey, (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onError: (error) => {
      console.error(error);
    },
  });
}