import React from "react";
import * as ExpoImagePicker from "expo-image-picker";
import type { ImagePickerOptions } from "expo-image-picker";
import {
  Image as ReactNativeImage,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-paper";
// import Icon from "@expo/vector-icons/Ionicons";
import { uniqueId } from "@/src/shared/lib";
import { useAppTheme } from "../../models/theme.model";

type PickerImage = {
  id: string;
  uri: string;
  name: string;
  type: string;
  status: "noChanges" | "deleted" | "new";
};

interface ImagePickerProps {
  pickerOptions?: ImagePickerOptions;
  onChange: (images: PickerImage[]) => void;
  onFocus: () => void;
  onBlur: () => void;
  value: PickerImage[];
  children: ({
    pickImage,
    deleteImage,
    images,
  }: {
    pickImage: () => void;
    deleteImage: (deletedImageIndex: number) => void;
    images: PickerImage[];
  }) => React.ReactNode;
}

const Image = ({
  style,
  ...rest
}: React.ComponentProps<typeof ReactNativeImage>) => {
  const { colors, borderRadius } = useAppTheme();

  return (
    <TouchableWithoutFeedback>
      <ReactNativeImage
        style={[
          {
            borderRadius: borderRadius.primary,
          },
          style,
        ]}
        {...rest}
      />
    </TouchableWithoutFeedback>
  );
};
const UploadButton = ({
  onUploadImage,
  style,
  ...rest
}: {
  onUploadImage: () => void;
} & React.ComponentProps<typeof TouchableOpacity>) => {
  const { colors, borderRadius } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onUploadImage}
      activeOpacity={0.6}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: colors.primary,
          borderStyle: "dashed",
          borderRadius: borderRadius.primary,
        },
        style,
      ]}
      {...rest}
    >
      <View style={{ opacity: 0.6 }}>
        <Icon source="camera-outline" size={56} />
      </View>
    </TouchableOpacity>
  );
};

export const ImagePicker = ({
  value = [],
  pickerOptions,
  onChange,
  onFocus,
  onBlur,
  children,
}: ImagePickerProps) => {
  const limitValue = pickerOptions?.selectionLimit ?? 5;

  const pickImage = async () => {
    const imagesLength = value.filter(
      (image) => image.status !== "deleted"
    ).length;

    const selectionLimit = limitValue - imagesLength;

    if (selectionLimit === 0 && limitValue > 1) {
      return;
    }

    onFocus();

    // No permissions request is necessary for launching the image library
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
      base64: true,
      ...pickerOptions,
      selectionLimit,
    });

    if (!result.canceled) {
      const newImagesList: PickerImage[] = result.assets.map((image) => ({
        uri: `data:${image.mimeType};base64,${image.base64}`,
        name: image.fileName ?? "",
        type: image.mimeType ?? "",
        status: "new",
        id: uniqueId(),
      }));

      if (limitValue > 1) {
        onChange([...newImagesList, ...value]);
      } else {
        onChange(newImagesList);
      }
    }
    onBlur();
  };

  const deleteImage = (deletedImageIndex: number) => {
    onFocus();

    if (value[deletedImageIndex].status === "new") {
      onChange(value.filter((_image, index) => deletedImageIndex !== index));
      onBlur();
      return;
    }

    const updatedImageList: PickerImage[] = [
      ...value.slice(0, deletedImageIndex),
      { ...value[deletedImageIndex], status: "deleted" },
      ...value.slice(deletedImageIndex + 1),
    ];

    onChange(updatedImageList);
    onBlur();
  };

  return children({
    pickImage,
    deleteImage,
    images: value,
  });
};

ImagePicker.Image = Image;
ImagePicker.UploadButton = UploadButton;
