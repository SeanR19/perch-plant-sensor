import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CareOverview } from '@/components/home/care-overview';
import { HealthGauge } from '@/components/home/health-gauge';
import { HomeBackground } from '@/components/home/home-background';
import { HomeHeader } from '@/components/home/home-header';
import { StatCards } from '@/components/home/stat-cards';
import { MOCK_GARDEN } from '@/lib/mock-garden';

/**
 * Home (Figma: WP-Version-Blackhawk-Mobile, 169:65). The photo backdrop stays
 * put while the content scrolls over it. Vertical gaps are the Figma ones.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const garden = MOCK_GARDEN;

  return (
    <View style={styles.root}>
      {/* White status bar over the dark photo, whatever the system scheme. */}
      <StatusBar style="light" />
      <HomeBackground />

      <ScrollView
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          // Figma's header is 12pt below a 44pt status bar.
          { paddingTop: insets.top + 12 },
        ]}
      >
        <HomeHeader />
        <View style={{ marginTop: 71 }}>
          <HealthGauge score={garden.health} />
        </View>
        <View style={{ marginTop: 51 }}>
          <StatCards plants={garden.plants} thriving={garden.thriving} needCare={garden.needCare} />
        </View>
        <CareOverview
          tasks={garden.tasks}
          // Grows to the bottom of the screen; the padding keeps its contents
          // clear of the floating tab bar.
          style={{ marginTop: 57, flexGrow: 1, paddingBottom: insets.bottom + 90 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { flexGrow: 1 },
});
