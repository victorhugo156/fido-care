import { Tabs } from "expo-router"

export default function Layout(){
    return(
        <Tabs>
            <Tabs.Screen name="Find"
            options={{title: "Welcome"}}  />
            <Tabs.Screen name="Login"/>
        </Tabs>
    )
}