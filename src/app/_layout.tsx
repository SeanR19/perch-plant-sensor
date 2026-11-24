import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { StatusBar } from 'expo-status-bar';
import { CalendarCheck, House, Notebook, PlantPot } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { NavBar, NavTab } from '@/components/nav-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        {/* Headless tabs, so the bar can be the custom floating pill from Figma
          rather than the system tab bar. */}
        <Tabs>
          <TabSlot />
          <TabList asChild>
            <NavBar>
              {/* Stroke widths match the Figma layers: calendar-check is drawn
                slightly thinner than the other three. */}
              <TabTrigger name="index" href="/" asChild>
                <NavTab icon={House} strokeWidth={2.08} accessibilityLabel="Home" />
              </TabTrigger>
              <TabTrigger name="plants" href="/plants" asChild>
                <NavTab icon={PlantPot} strokeWidth={2.08} accessibilityLabel="Plants" />
              </TabTrigger>
              <TabTrigger name="calendar" href="/calendar" asChild>
                <NavTab icon={CalendarCheck} strokeWidth={1.92} accessibilityLabel="Calendar" />
              </TabTrigger>
              <TabTrigger name="notebook" href="/notebook" asChild>
                <NavTab icon={Notebook} strokeWidth={2.08} accessibilityLabel="Notebook" />
              </TabTrigger>
            </NavBar>
          </TabList>
        </Tabs>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
