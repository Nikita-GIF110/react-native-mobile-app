export interface UserEntity {
  user: {
    id: number;
    email: string;
    created_at: string;
  };
  user_avatar: {
    id: number;
    name: string;
    profile_image: string;
    rate: number;
    products_created: number;
  };
  options: {
    is_can_rate: boolean;
    is_can_report: boolean;
    blocked_by_system: boolean;
    blocked_by_you: boolean;
    blocked_you: boolean;
  };
}

export interface UserChangeNameFormFields {
  new_name: string;
}

export interface UserChangAvatarFormFields {
  picture: {
    uri: string;
    name: string;
    type: string;
  }[];
}

export interface UserChangeRatingFormFields {
  rate: number;
  user_id: number;
}

export interface UserReportFormFields {
  type: "report" | "block" | "unblock";
  user_id: number;
}

export interface UserEulaEntity {
  section: {
    ru: string;
    en: string;
    sr: string;
  };
  text: {
    ru: string;
    en: string;
    sr: string;
  };
}
