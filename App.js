import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';
import { useFonts, 
  Nunito_300Light, 
  Nunito_400Regular, 
  Nunito_700Bold, 
  Nunito_900Black } from '@expo-google-fonts/nunito'

import Login from './src/screens/Login';
import { Loading } from './src/components/loading'
import theme from './src/theme/theme';

export default function App() {

  const [fontsLoaded] = useFonts({ Nunito_300Light, Nunito_400Regular, Nunito_700Bold, Nunito_900Black});

  return (

    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <Login /> : <Loading />}
    </ThemeProvider>

  );
}
;
