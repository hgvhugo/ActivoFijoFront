import { createTheme } from '@mantine/core';
import cx from 'clsx';  

const theme = createTheme({
  components: {
    Container: {
      classNames: (_, { size }) => ({
        root: cx({ responsiveContainer: size === 'responsive' }),
      }),
    },
  },
});

export default theme;