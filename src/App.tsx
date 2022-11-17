// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
// import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import { ConfirmProvider } from 'material-ui-confirm';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

// react-query provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 60 * 24, refetchOnMount: false, refetchOnReconnect: false, refetchOnWindowFocus: false }
  }
});

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    {/* <RTLLayout> */}
    <Locales>
      <ScrollTop>
        <QueryClientProvider client={queryClient}>
          <ConfirmProvider>
            <AuthProvider>
              <>
                <Routes />
                <Snackbar />
              </>
            </AuthProvider>
          </ConfirmProvider>
        </QueryClientProvider>
      </ScrollTop>
    </Locales>
    {/* </RTLLayout> */}
  </ThemeCustomization>
);

export default App;
