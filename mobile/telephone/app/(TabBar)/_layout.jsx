import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar";

export default function TabLayout() {
  return (
    <>
      <Tabs tabBar={(props) => 
        <TabBar {...props} />} screenOptions={{ headerShown: false, }}>
          <Tabs.Screen name="Home"options={{ title: "Home", }}/>
          <Tabs.Screen name="Maps" options={{ title: "Map",}}/>
          <Tabs.Screen name="Trajet" options={{title: "Trajet",}}/>
          <Tabs.Screen name="Setting" options={{ title: "Setting", }}/>
        </Tabs>
    </>
  );
}
