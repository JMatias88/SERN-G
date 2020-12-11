import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../theme';


function MyApp({ Component, pageProps }) {
  return (
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
        


  )
}

export default MyApp
