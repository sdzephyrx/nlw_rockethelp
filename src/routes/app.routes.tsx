import {createNativeStackNavigator} from '@react-navigation/native-stack'

import { Home } from "../screens/Home";
import { Details } from "../screens/Details";
import { Register } from "../screens/Register";
import { SignIn } from '../screens/SignIn';

const { Navigator, Screen} = createNativeStackNavigator();

export function AppRoutes(){
    return(
        <Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            {/* <Screen 
                name="signin"
                component={SignIn}
            /> */}
            <Screen 
                name="home" 
                component={Home} 
            />
            <Screen 
                name="new" 
                component={Register} 
            />
            <Screen 
                name="details" 
                component={Details} 
            />
        </Navigator>
    );
}