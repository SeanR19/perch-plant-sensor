import { NativeTabs } from 'expo-router/unstable-native-tabs';

/**
 * The system tab bar — on iOS 26 that's Apple's own Liquid Glass bar, with the
 * draggable selection bubble built in. Icon-only, per the Figma nav bar
 * (Plotted | Product Design, 90:1269).
 *
 * Icons are template images: flat single-colour silhouettes iOS tints itself,
 * so one PNG serves both states and both colour schemes. They're generated
 * from the Figma SVGs by `npm run icons:nav`.
 */
export function AppTabs() {
  return (
    // Selected icon is white, as in the Figma nav bar.
    <NativeTabs tintColor="#FFFFFF">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={require('../assets/icons/nav/house.png')}
        />
        <NativeTabs.Trigger.Label hidden>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="plants">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={require('../assets/icons/nav/plant-pot.png')}
        />
        <NativeTabs.Trigger.Label hidden>Plants</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={require('../assets/icons/nav/calendar-check.png')}
        />
        <NativeTabs.Trigger.Label hidden>Calendar</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="notebook">
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          src={require('../assets/icons/nav/notebook.png')}
        />
        <NativeTabs.Trigger.Label hidden>Notebook</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
