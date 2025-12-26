import { useSetUserRating } from "@/src/entities/user";
import { UserChangeRatingFormFields } from "@/src/shared/api";
import { Button, RatingStar } from "@/src/shared/ui-kit";
import React from "react";
import { Field, withTypes } from "react-final-form";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

const { Form } = withTypes<UserChangeRatingFormFields>();

const STAR_SIZE = 56;

const RatingFormField = ({ name }: { name: string }) => {
  return (
    <Field name={name}>
      {({ input }) => {
        const ratingValue = Math.floor(input.value);
        const remainder = parseFloat((input.value - ratingValue).toFixed(1));
        return (
          <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
            {Array(5)
              .fill(null)
              .map((_item, index) => {
                const starIndex = index + 1;

                const fullStarCondition = starIndex <= ratingValue;
                const halfStarCondition =
                  starIndex - (1 - remainder) === input.value &&
                  remainder >= 0.3;

                return (
                  <TouchableOpacity
                    key={index}
                    onPressIn={() => input.onFocus()}
                    onPressOut={() => input.onBlur()}
                    onPress={() => input.onChange(starIndex)}
                    activeOpacity={0.8}
                  >
                    {fullStarCondition && (
                      <RatingStar variant="full" size={STAR_SIZE} />
                    )}
                    {halfStarCondition && (
                      <RatingStar variant="half" size={STAR_SIZE} />
                    )}
                    {!halfStarCondition && !fullStarCondition && (
                      <RatingStar variant="outline" size={STAR_SIZE} />
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        );
      }}
    </Field>
  );
};

export const SetUserRatingForm = ({
  userId,
  onSuccess,
}: {
  userId: number;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation("buttons");
  const { onSetUserRating, isPending: isSetUserRatingPending } =
    useSetUserRating();

  return (
    <Form
      onSubmit={(fields, form) => {
        onSetUserRating(fields, form, (error) => {
          if (error) {
            return;
          }
          typeof onSuccess === "function" && onSuccess();
        });
      }}
      initialValues={{ user_id: userId, rate: 0 }}
    >
      {({ handleSubmit }) => (
        <View style={{ alignItems: "center", flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <RatingFormField name="rate" />
          </View>

          <Button
            title={t("buttons.submit", { ns: "buttons" })}
            onPress={handleSubmit}
            disabled={isSetUserRatingPending}
            variant="surface"
            style={{ width: "100%", flex: 0 }}
          />
        </View>
      )}
    </Form>
  );
};
