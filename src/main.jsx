import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "@mantine/core/styles.css";
import "mantine-react-table/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/code-highlight/styles.css";
import { MantineProvider, Container, createTheme } from "@mantine/core";
import theme from "./helpers/Tema.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./hooks/queryClient.js";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <Notifications />
            <Container size="responsive">
              <Routes>
                <Route path="*" element={<App />} />
                {/* <App /> */}
              </Routes>
            </Container>
          </QueryClientProvider>
          <Notifications />
        </ModalsProvider>
      </MantineProvider>
    </HashRouter>
  </StrictMode>
);
