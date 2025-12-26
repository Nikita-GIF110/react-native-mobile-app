import React from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import MapView, {
  UrlTile,
  Marker,
  LatLng,
  MapMarkerProps,
  MarkerDragStartEndEvent,
} from "react-native-maps";
import { location } from "@/src/shared/api/location";
import type { LocationEntity } from "@/src/shared/api/location";
import {
  Button,
  IconButton,
  useAppTheme,
  ContentPlaceholder,
  LoadingPlaceholder,
  Fade,
  TextInput,
  FlatList,
  BackActionButton,
  OSMAttribution,
  useDrawer,
  Drawer,
  Appbar,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { Text } from "react-native-paper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/src/shared/lib";
import { useTranslation } from "react-i18next";

interface SelectedLocation {
  place_id: LocationEntity["place_id"];
  country: LocationEntity["address"]["country"];
  house_number: LocationEntity["address"]["house_number"];
  road: LocationEntity["address"]["road"];
  suburb: LocationEntity["address"]["suburb"];
  neighbourhood: LocationEntity["address"]["neighbourhood"];
  lat: LocationEntity["lat"];
  lon: LocationEntity["lon"];
  display_name: LocationEntity["display_name"];
  city: LocationEntity["address"]["city"];
}

type MapControls = "zoom" | "focusOnPoint";
type MapStepperSteps = "intro" | "location-list" | "map";

const selectSelectedLocation = (location: LocationEntity) => ({
  place_id: location.place_id,
  country: location.address?.country ?? "",
  house_number: location.address?.house_number ?? "",
  road: location.address?.road ?? "",
  suburb: location.address?.suburb ?? "",
  neighbourhood: location.address?.neighbourhood ?? "",
  lat: location.lat,
  lon: location.lon,
  display_name: location.display_name,
  city: location.address?.city ?? "",
});

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width;
const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
  },
  drawerStep: {
    position: "absolute",
    width: "100%",
    height: "100%",
    paddingHorizontal: 8,
    gap: 8,
  },
});

export const MapField = ({
  onFocus,
  onChange,
  onBlur,
  coordinates,
  markerOptions,
  controls = { zoom: true },
}: {
  onFocus?: () => void;
  onChange?: (locationData: SelectedLocation) => void;
  onBlur?: () => void;
  coordinates: LatLng;
  markerOptions?: Partial<MapMarkerProps>;
  controls?: Partial<Record<MapControls, boolean>>;
}) => {
  const mapRef = React.useRef<MapView | null>(null);
  const { borderRadius } = useAppTheme();

  const onSearchPlaceByCoordinate = async (coordinate: LatLng) => {
    try {
      const { latitude, longitude } = coordinate;
      const response = await location.searchLocationByCoordinate({
        latitude,
        longitude,
      });

      return response.data;
    } catch (error) {
      handelErrorDetail(error);
    }
  };

  const mapZoom = (zoomFactor: number) => {
    mapRef?.current?.getCamera().then((camera) => {
      if (!camera.altitude) {
        return;
      }

      const altitude = camera.altitude * zoomFactor;

      mapRef?.current?.animateCamera({
        ...camera,
        altitude,
      });
    });
  };

  const handleMarkerDragEnd = async (event: MarkerDragStartEndEvent) => {
    if (typeof onFocus === "function") {
      onFocus();
    }

    const coordinate = event.nativeEvent.coordinate;
    const location = await onSearchPlaceByCoordinate(coordinate);

    if (typeof onChange === "function" && location) {
      onChange(selectSelectedLocation(location));
    }

    const camera = await mapRef.current?.getCamera();
    if (camera) {
      mapRef.current?.animateCamera({
        ...camera,
        center: coordinate,
      });
    }

    if (typeof onBlur === "function") {
      onBlur();
    }
  };

  const centeredForPlace = () => {
    mapRef.current?.getCamera().then((camera) => {
      if (!camera.altitude) {
        return;
      }

      mapRef.current?.animateCamera({
        ...camera,
        center: coordinates,
        altitude: 6223.541743395271,
      });
    });
  };

  centeredForPlace();

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        showsCompass={false}
        showsBuildings={false}
        zoomEnabled
        initialRegion={{
          ...coordinates,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsPointsOfInterest={false}
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        <Marker
          {...markerOptions}
          coordinate={coordinates}
          onDragEnd={handleMarkerDragEnd}
        />
      </MapView>

      <View
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: [{ translateY: "-50%" }],
          borderRadius: borderRadius.secondary,
        }}
      >
        {controls?.zoom && (
          <View style={{ gap: 8, marginBottom: 16 }}>
            <IconButton icon="plus" onPress={() => mapZoom(0.5)} />
            <IconButton icon="minus" onPress={() => mapZoom(2)} />
          </View>
        )}

        {controls?.focusOnPoint && (
          <IconButton icon="compass-rose" onPress={centeredForPlace} />
        )}
      </View>
    </View>
  );
};

export const ListLocationsField = ({
  onChange,
  onBlur,
  onFocus,
  value = "",
  headerRightComponent,
}: {
  onChange: (selectedLocationData: SelectedLocation) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  headerRightComponent?: React.ReactNode;
}) => {
  const [name, setName] = React.useState<string>(() => value);
  const debouncedName = useDebounce(name, 1000);
  const { t } = useTranslation(["forms", "common"]);
  const qieryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["location-list", debouncedName],
    queryFn: ({ signal }) =>
      location.fetchLocationByName(debouncedName, {
        signal,
      }),
  });

  React.useEffect(() => {
    setName(value);
  }, [value]);

  const list = query.data?.data ?? [];

  return (
    <>
      <Appbar>
        {headerRightComponent}
        <TextInput
          placeholder={t("forms.input_location", { ns: "forms" })}
          onChangeText={setName}
          onBlur={onBlur}
          onFocus={onFocus}
          value={name}
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
          importantForAutofill="no"
          keyboardType="web-search"
          containerStyle={{ flex: 1 }}
          style={{ flex: 0 }}
          disabled
        />
      </Appbar>

      <FlatList
        data={list}
        isListLoaded={!query.isLoading}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListLoadingComponent={<LoadingPlaceholder />}
        ListEmptyComponent={
          <ContentPlaceholder
            subHeader={t("common.empty_list_text", { ns: "common" })}
          />
        }
        renderItem={({ item }) => (
          <Button
            title={item.display_name}
            variant="surface"
            onPress={() => {
              onChange(selectSelectedLocation(item));
            }}
          />
        )}
        onRefresh={() => {
          qieryClient.refetchQueries({
            queryKey: ["location-list", debouncedName],
          });
        }}
        refreshing={query.isRefetching}
      />

      <View style={{ alignItems: "center", marginVertical: 4 }}>
        <OSMAttribution />
      </View>
    </>
  );
};

export const MapStepper = ({
  onChange,
  onBlur,
  onFocus,
  value,
  error,
  helperText,
}: {
  onChange: (location: SelectedLocation) => void;
  onBlur: () => void;
  onFocus: () => void;
  value: SelectedLocation;
  error?: boolean;
  helperText?: string;
}) => {
  const { t } = useTranslation(["buttons", "forms"]);
  const [activeStep, setActiveStep] = React.useState<MapStepperSteps>("intro");
  const { visible, onToggle } = useDrawer();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Button
        title={
          value?.display_name ?? t("buttons.choose_city", { ns: "buttons" })
        }
        variant="surface"
        onPress={() => {
          setActiveStep(value ? "map" : "location-list");
          onToggle();
        }}
      />

      <Drawer visible={visible}>
        {/* Location list */}
        <Fade
          visible={activeStep === "location-list"}
          style={[
            styles.drawerStep,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingHorizontal: 0,
            },
          ]}
        >
          <ListLocationsField
            key={value?.place_id}
            onChange={(location) => {
              onChange(location);
              setActiveStep("map");
            }}
            onBlur={onBlur}
            onFocus={onFocus}
            value={value?.display_name}
            headerRightComponent={<BackActionButton onPress={onToggle} />}
          />
        </Fade>

        {/* Map */}
        <Fade
          visible={activeStep === "map"}
          style={[styles.drawerStep, { paddingHorizontal: 0 }]}
        >
          {value && (
            <MapField
              coordinates={{
                latitude: parseFloat(value.lat),
                longitude: parseFloat(value.lon),
              }}
              onBlur={onBlur}
              onFocus={onFocus}
              onChange={onChange}
              markerOptions={{ draggable: true }}
              controls={{ focusOnPoint: true, zoom: true }}
            />
          )}

          <Appbar
            style={{
              position: "absolute",
              top: insets.top,
              left: 0,
            }}
          >
            <BackActionButton onPress={() => setActiveStep("location-list")} />
            <TextInput
              placeholder={t("forms.input_location", { ns: "forms" })}
              onPress={() => setActiveStep("location-list")}
              disabled
              value={value?.display_name}
              containerStyle={{ flex: 1 }}
            />
          </Appbar>

          <View
            style={{
              position: "absolute",
              width: "100%",
              left: 0,
              bottom: insets.bottom + 30,
              paddingHorizontal: 16,
            }}
          >
            <Button
              title={t("buttons.apply", { ns: "buttons" })}
              onPress={() => {
                onToggle();
                setActiveStep("location-list");
                onChange(value);
              }}
            />

            <View style={{ alignItems: "center", marginVertical: 4 }}>
              <OSMAttribution />
            </View>
          </View>
        </Fade>
      </Drawer>
    </>
  );
};

export const LocationOverview = ({
  location,
}: {
  location: SelectedLocation;
}) => {
  const { colors, borderRadius } = useAppTheme();
  const { visible, onToggle } = useDrawer();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("buttons");

  return (
    <>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.secondary,
          padding: 8,
        }}
      >
        <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
          <Text style={{ color: colors.onSurface }} variant="titleMedium">
            {`${location?.city}, ${location?.suburb}`}
          </Text>
          <Text
            style={{ color: colors.onSurface, marginBottom: 4 }}
            variant="titleSmall"
            numberOfLines={2}
          >
            {location?.display_name}
          </Text>
          <Text style={{ color: colors.secondary }} variant="titleSmall">
            {t("buttons.show_in_the_map", { ns: "buttons" })}
          </Text>
        </TouchableOpacity>
      </View>

      <Drawer visible={visible}>
        {location?.lat && location.lon && (
          <MapField
            markerOptions={{ draggable: false }}
            controls={{ focusOnPoint: true, zoom: true }}
            coordinates={{
              latitude: location.lat,
              longitude: location.lon,
            }}
          />
        )}

        <Appbar
          style={{
            position: "absolute",
            top: insets.top,
            width: "100%",
            left: 0,
          }}
        >
          <IconButton icon="chevron-left" onPress={onToggle} size="md" />
        </Appbar>

        <View
          style={{
            padding: 12,
            paddingBottom: insets.bottom,
            backgroundColor: colors.surface,
            gap: 12,
            borderTopRightRadius: borderRadius.primary,
            borderTopLeftRadius: borderRadius.primary,
            shadowColor: colors.elevation.level5,
            shadowOffset: {
              height: 0,
              width: 0,
            },
            elevation: 8,
          }}
        >
          <View>
            <Text style={{ color: colors.onSurface }} variant="titleMedium">
              {`${location?.city}, ${location?.suburb}`}
            </Text>
            <Text style={{ color: colors.onSurface }} variant="titleSmall">
              {location?.display_name}
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <OSMAttribution />
          </View>
        </View>
      </Drawer>
    </>
  );
};
