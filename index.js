
import {AppRegistry, Text, View,Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { ContextProvider } from './Context';



AppRegistry.registerComponent(appName, () => App);

