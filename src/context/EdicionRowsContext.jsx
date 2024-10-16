import React, { createContext, useState } from 'react';

export const EditedRowsContext = createContext();

export const EditedRowsProvider = ({ children }) => {
  
  const [editedRows, setEditedRows] = useState({});

  return (
    <EditedRowsContext.Provider value={{ editedRows, setEditedRows }}>
      {children}
    </EditedRowsContext.Provider>
  );
};