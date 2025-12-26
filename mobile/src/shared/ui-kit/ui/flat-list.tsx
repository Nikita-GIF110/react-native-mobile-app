import React from "react";
import {
  FlatList as ReactNativeFlatList,
  FlatListProps as ReactNativeFlatListProps,
  RefreshControl,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

export interface FlatListProps<Item> extends ReactNativeFlatListProps<Item> {
  isListLoaded?: boolean;
  ListLoadingComponent?: React.ReactElement;
}
export interface InfiniteQueryFlatListProps<Item> extends FlatListProps<Item> {
  isLoadingMore?: boolean;
  isListLoaded: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
}

export const FlatList = React.forwardRef<
  ReactNativeFlatList<Item>,
  FlatListProps<Item>
>(function FlatList<Item>(
  {
    renderItem,
    contentContainerStyle,
    isListLoaded,
    ListLoadingComponent,
    ListEmptyComponent,
    ...rest
  }: FlatListProps<Item>,
  ref
) {
  return (
    <ReactNativeFlatList
      ref={ref}
      contentContainerStyle={[{ gap: 8, flexGrow: 1 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      ListEmptyComponent={
        isListLoaded ? ListEmptyComponent : ListLoadingComponent
      }
      renderItem={renderItem}
      {...rest}
    />
  );
});

export const InfiniteQueryFlatList = <Item,>({
  isLoadingMore,
  isListLoaded,
  data,
  refreshing,
  onRefresh,
  onLoadMore,
  ...rest
}: InfiniteQueryFlatListProps<Item> & {}) => {
  return (
    <FlatList
      {...rest}
      data={data}
      isListLoaded={isListLoaded}
      onEndReachedThreshold={0.1} // Когда остаётся 10% списка до конца
      onEndReached={() => {
        if (typeof onLoadMore !== "function") {
          return;
        }

        const length = data?.length ?? 0;
        const canLoadMore = !isLoadingMore && isListLoaded && length >= 2;
        if (canLoadMore) {
          onLoadMore();
        }
      }}
      ListFooterComponent={
        isLoadingMore ? <ActivityIndicator animating /> : undefined
      }
      refreshControl={
        <RefreshControl
          refreshing={!!refreshing && isListLoaded}
          onRefresh={onRefresh}
        />
      }
    />
  );
};
