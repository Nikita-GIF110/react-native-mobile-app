import React from "react";
import { Dimensions, FlatList, View } from "react-native";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const SwipeableTabView = <TabTitem,>({
  tabslist,
  renderTab,
  renderTabContent,
}: {
  tabslist: TabTitem[];
  renderTab: (
    item: TabTitem,
    isActive: boolean,
    index: number,
    handleTabPress: (index: number) => void
  ) => React.ReactNode;
  renderTabContent: (activeTabIndex: number) => React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);

  const handleTabPress = (index: number) => {
    if (index >= 0 && index < tabslist.length) {
      setActiveTab(index);
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const onMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Calculate active index based on scroll position
    const newIndex = Math.floor(contentOffset.x / viewSize.width);
    if (newIndex !== activeTab) {
      setActiveTab(newIndex);
    }
  };

  return (
    <View style={{ gap: 8, flex: 1 }}>
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16 }}>
        {tabslist.map((tab, index) =>
          renderTab(tab, activeTab === index, index, handleTabPress)
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={tabslist}
        keyExtractor={(_, index) => `tab-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollToIndexFailed={(info) => {
          // Fallback for scroll to index
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }
          }, 100);
        }}
        renderItem={({ index }) => (
          <View style={{ width: WINDOW_WIDTH, flex: 1 }}>
            {renderTabContent(index)}
          </View>
        )}
        getItemLayout={(_, index) => ({
          length: WINDOW_WIDTH,
          offset: WINDOW_WIDTH * index,
          index,
        })}
      />
    </View>
  );
};
