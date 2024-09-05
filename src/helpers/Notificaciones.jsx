import { 
    rem, 
  } from "@mantine/core";
   
  import { notifications } from "@mantine/notifications";
  import styles from "../notification.module.css";
  import {  IconX, IconCheck,IconInfoCircle } from "@tabler/icons-react";
  
  
    const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
    const infoIcon = <IconInfoCircle style={{ width: rem(20), height: rem(20) }} />;
  
    export const handleError = (error) => {
      notifications.show({
        title: "Error",
        message: "Causa: " + error,
        radius: "md",
        autoClose: true,
        withCloseButton: false,
        color: "#d10003",
        variant: "filled",
        icon: xIcon,
        pos: "top-right",
        classNames: styles,
      });
    };
  
    export const handleSuccess = (message) => {
      notifications.show({
        title: "Éxito	",
        message: message,
        radius: "md",
        autoClose: true,
        withCloseButton: false,
        icon: checkIcon,
        color: "#004208",
        variant: "filled",
        //  icon: xIcon,
        pos: "top-right",
        classNames: styles,
      });
    };
  
    export const handleInfo = (message) => {
      notifications.show({
        title: "Información ",
        message: message,
        radius: "md",
        autoClose: true,
        withCloseButton: false,
        icon: infoIcon,
        color: "#ECC608",
        variant: "filled",
        //  icon: xIcon,
        pos: "top-right",
        classNames: styles,
      });
    };
   
   
  
   