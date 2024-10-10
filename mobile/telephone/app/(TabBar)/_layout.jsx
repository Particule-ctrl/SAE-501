import { Tabs} from "expo-router";
import Tarbar from "../../components/TabBar"


export default function TabLayout() {
  return (

    <>
    
      <Tabs

        tabBar={props => <Tarbar {...props}/>}
      
      >

        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",headerShown:false
          }}
        />
        <Tabs.Screen
          name="Maps"
          options={{
            title: "Map", headerShown:false
          }}
        />
        <Tabs.Screen
          name="Trafic"
          options={{
            title: "Trafic" ,headerShown:false
          }}
        />

        <Tabs.Screen
          name="Setting"
          options={{
            title: "Setting" ,headerShown:false
          }}
        />
      </Tabs>
    
    </>
    
  );
}
