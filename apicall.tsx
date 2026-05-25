Here are two premium ways to render this tabular dasha data in React Native, depending on the theme direction of your app (a Modern Light Theme or a Horizontal Scrolling Grid):

Alternative 1: Premium Light Mode Design (Harmonious Cream & Gold Theme)
If your app uses a light theme, Astro-portals usually look exceptionally premium with warm cream, gold, and soft grey colors rather than cold whites:

tsx
import React from 'react';
import { StyleSheet, Text, View, FlatList, Platform } from 'react-native';
export const LightDashaTable = ({ dashas }) => {
  const getDateRange = (item) => {
    const start = item.start_date_bs || item.start_date_ad || '';
    const end = item.end_date_bs || item.end_date_ad || '';
    return { start, end };
  };
  const renderRow = ({ item, index }) => {
    const { start, end } = getDateRange(item);
    return (
      <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
        <View style={[styles.col, styles.colMain]}>
          <Text style={styles.textNp}>{item.dasha}</Text>
          <Text style={styles.textEn}>{item.dasha_en}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.textDate}>{start}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.textDate}>{end}</Text>
        </View>
        <View style={[styles.col, styles.colRight]}>
          <Text style={styles.textAge}>{item.start_age}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.colMain]}>दशा (Dasha)</Text>
        <Text style={styles.headerText}>सुरु (Start)</Text>
        <Text style={styles.headerText}>समाप्ति (End)</Text>
        <Text style={[styles.headerText, styles.colRight]}>उमेर (Age)</Text>
      </View>
      <FlatList
        data={dashas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF8F5', // Soft warm cream
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFECE6',
    overflow: 'hidden',
    shadowColor: '#5C4E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#F3EDE2', // Soft golden tint
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E6DCBF',
  },
  headerText: {
    flex: 1,
    color: '#8A7A5F', // Muted golden-brown
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EDE2',
  },
  rowEven: {
    backgroundColor: '#FAF8F5',
  },
  rowOdd: {
    backgroundColor: '#FDFDFD',
  },
  col: {
    flex: 1,
  },
  colMain: {
    flex: 1.2,
  },
  colRight: {
    alignItems: 'flex-end',
  },
  textNp: {
    color: '#3E3427', // Rich warm charcoal
    fontSize: 16,
    fontWeight: '600',
  },
  textEn: {
    color: '#8A7A5F',
    fontSize: 12,
    marginTop: 1,
  },
  textDate: {
    color: '#5C5449',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  textAge: {
    color: '#B38B34', // Elegant gold accent
    fontSize: 13,
    fontWeight: '700',
  },
});
3 Key Rules for Astro-App Table UIs
When styling tables in React Native with standard components, always keep these things in mind to prevent layout breaks:

Monospacing for Dates: Always use a monospace font (Courier on iOS, monospace on Android) for start/end dates. This ensures numbers align vertically in columns perfectly instead of jumping left or right due to differing character widths.
Devanagari Font Padding: Devanagari characters (like केतु, शुक्र) have vertical top lines and vowel marks that can clip on older Android engines. Always specify a slightly larger lineHeight or vertical padding on Nepali labels to ensure they render perfectly.
Flex Ratios: Always set corresponding flex rates on the table headers and body columns (e.g. colMain having flex: 1.2 in both headers and items) to keep the layout synchronized perfectly.
