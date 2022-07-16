import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    primary: {
      '500': '#1C3557',
      '600': '#14253E',
    },
    background: {
      '500': '#FAFBFE',
    },
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  styles: {
    global: {
      '@media(max-width: 1080px)': {
        html: {
          fontSize: '93.75%',
        },
      },
      '@media(max-width: 720px)': {
        html: {
          fontSize: '87.5%',
        },
      },
      'html, body': {
        minW: '380px',
        minH: '100vh',
        overflowX: 'auto',
        scrollBehavior: 'smooth',
        bg: 'background.500',
      },
      'html body': {
        marginRight: '0px !important',
      },
      pre: {
        fontFamily: 'Roboto',
      },
    },
  },
});
