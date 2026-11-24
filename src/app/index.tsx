import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CareOverviewSheet } from '@/components/home/care-overview';
import { HealthGauge } from '@/components/home/health-gauge';
import { HomeBackground } from '@/components/home/home-background';
import { HomeHeader } from '@/components/home/home-header';
import { StatCards } from '@/components/home/stat-cards';
import { MOCK_GARDEN } from '@/lib/mock-garden';

// Figma lays the frame out under a 44pt status bar, with the header 12pt
// below it. Everything below is measured from the header's top.
const HEADER_GAP = 12;
const HEADER_HEIGHT = 48;
/** Header top → sheet top at rest (Figma y 56 → 503). */
const SHEET_REST_OFFSET = 447;

/**
 * Home (Figma: WP-Version-Blackhawk-Mobile, 169:65). The photo, gauge and stat
 * cards stay put; the Care Overview sheet swipes up over them to fill the
 * screen, passing behind the header buttons and logo.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const garden = MOCK_GARDEN;
  const headerTop = insets.top + HEADER_GAP;

  return (
    <View style={styles.root}>
      {/* White status bar over the dark photo, whatever the system scheme. */}
      <StatusBar style="light" />
      <HomeBackground />

      {/* Leaves room for the header, which is drawn last (below) so the
          sheet can slide up behind it. */}
      <View style={{ paddingTop: headerTop + HEADER_HEIGHT }}>
        <View style={{ marginTop: 71 }}>
          <HealthGauge score={garden.health} />
        </View>
        <View style={{ marginTop: 51 }}>
          <StatCards plants={garden.plants} thriving={garden.thriving} needCare={garden.needCare} />
        </View>
      </View>

      <CareOverviewSheet
        tasks={garden.tasks}
        restingTop={headerTop + SHEET_REST_OFFSET}
        headerBottom={headerTop + HEADER_HEIGHT}
      />

      <View style={[styles.header, { top: headerTop }]} pointerEvents="box-none">
        <HomeHeader />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  header: { position: 'absolute', left: 0, right: 0 },
});
