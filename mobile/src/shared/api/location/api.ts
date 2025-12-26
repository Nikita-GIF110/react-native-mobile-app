import { instance } from "../instance";
import { LocationEntity } from "./entities";
import { AxiosRequestConfig } from "axios";

export const location = {
  fetchLocationByName: async (
    name: string,
    config?: AxiosRequestConfig<LocationEntity>
  ) => {
    return instance().get<LocationEntity[]>(
      `https://nominatim.openstreetmap.org/search.php?format=json&q=${name}&accept-language=en&addressdetails=1`,
      config
    );
  },
  searchLocationByCoordinate: (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    const { latitude, longitude } = coordinate;
    return instance().get<LocationEntity>(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
    );
  },
};
