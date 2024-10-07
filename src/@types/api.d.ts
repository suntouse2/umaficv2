type TCampaign = {
  id: number;
  name: string;
  type: 'search' | 'watch' | 'direct';
  state: 'pending' | 'preparing' | 'active' | 'inactive';
  last_active_at: string;
  last_stop_at: string;
  created_at: string;
};

type TDirectCampaignNumericStatistics = {
  directs: number;
  directs_by_day: number;
  directs_open: number;
  directs_favorite: number;
  directs_interacted: number;
  directs_interacted_by_day: number;
  incoming_messages: number;
  incoming_messages_by_day: number;
  incoming_messages_unread: number;
  outgoing_auto_reply_messages: number;
  outgoing_auto_reply_messages_by_day: number;
  spending: string;
  spending_by_day: string;
  repayment: string;
  repayment_by_day: string;
};
type TDirectCampaign = TCampaign & {
  is_moderated: boolean;
  budget_limit: number;
  numeric_statistics: TDirectCampaignNumericStatistics;
};

type TCampaignSettingsTargetGEO = {
  language: string[];
  country: string[];
  region: string[];
  city: string[];
};
type TCampaignSettingsTargetSearch = {
  include: string[];
  exclude: string[];
};

type TMessageContent = {
  message: string;
  media: {
    filepath: string;
    type: TMediaTypes;
  } | null;
};

type TMediaTypes = 'auto' | 'voice' | 'round' | 'document';

type TFunnelMessage = {
  message: string;
  media: {
    filepath: string;
    type: TMediaTypes;
  } | null;
};

type TCampaignSettingsFunnelOrder = {
  messages: TFunnelMessage[];
  order: number;
};
type TCampaignSettingsFunnelKeyword = {
  messages: TFunnelMessage[];
  keywords: string[];
};

type TCampaignSettingsFunnel = {
  order: TCampaignSettingsFunnelOrder[];
  keyword: TCampaignSettingsFunnelKeyword[];
  funnel_type: 'order' | 'keyword';
};

type TCampaignSettingsProfile = {
  first_name: string;
  last_name: string;
  about: string;
  photo: null | string;
};

type TCampaignSettingsTarget = {
  geo: TCampaignSettingsTargetGEO;
  search: TCampaignSettingsTargetSearch;
};

type TDirectCampaignSettings = {
  name: string;
  settings: {
    target: TCampaignSettingsTarget;
    auto_reply: {
      funnel: TCampaignSettingsFunnel;
      ai: null;
    };
    profile: TCampaignSettingsProfile;
  };
  budget_limit: string;
};

type TChatDirect = {
  id: number;
  bot: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    photo: string;
    link: string;
  };
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    link: string;
  };
  is_open: boolean;
  is_favorite: boolean;
  is_interacted: boolean;
  is_archived: boolean;
  last_message: {
    id: number;
    content: TMessageContent;
    date: string;
    is_self: boolean;
    is_read: boolean;
    is_auto_reply: boolean;
    forwarded_message: {
      id: number;
      content: TMessageContent;
      date: string;
      user: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        phone: string;
        link: string;
      } | null;
      channel: {
        id: number;
        title: string;
        username: string;
        about: string;
        participants_count: number;
        spam_score: number;
        language: string;
        country: string;
        region: string;
        link: string;
      };
    };
    reply_to: number | null;
  };
  unread_count: number;
  created_at: string;
};
type TChatMessage = {
  id: number;
  content: TMessageContent;
  date: string;
  is_self: boolean;
  is_read: boolean;
  is_auto_reply: boolean;
  forwarded_message: {
    id: number;
    content: TMessageContent;
    date: string;
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      phone: string;
      link: string;
    };
    channel: {
      id: number;
      title: string;
      username: string;
      about: string;
      participants_count: number;
      spam_score: number;
      language: string;
      country: string;
      region: string;
      link: string;
    };
  };
  catch_slug: string;
  reply_to: number;
};
type TChatSendMessage = {
  content: TMessageContent;
  reply_to: number | null;
};
type TChatDirectStatusUpdate = {
  is_open?: boolean;
  is_favorite?: boolean;
};
type TChatDirectsStatusUpdate = {
  dto: {
    is_open: boolean;
    is_favorite: boolean;
  };
  ids: array<number>;
  min_id: number;
  max_id: number;
};
type TChatMessagesStatusUpdate = {
  dto: {
    is_read: boolean;
  };
  ids: array<number>;
  min_id: number;
  max_id: number;
};

//responses

type TAuthResponse = {
  access_token: string;
};

type TUserResponse = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_operator: boolean;
  balance: string;
  created_at: Date;
};

type TDirectCampaignResponse = TDirectCampaign;
type TDirectCampaignsResponse = TDirectCampaign[];
type TDirectCampaignSettingsResponse = TDirectCampaignSettings;

type TMediaUploadResponse = {
  filename: string;
};

type TSettingsLanguageResponse = { [key: string]: string };
type TSettingsCountriesResponse = { [key: string]: string };
type TSettingsRegionsResponse = { [key: string]: string };
type TSettingsCitiesResponse = { [key: string]: string };

type TCampaignSettingsCheckFoundMessagesResponse = {
  id: number;
  content: TMessageContent;
  date: string;
  user: User;
  channel: Channel;
  link: string;
}[];
type TCampaignSettingsCheckStatisticsResponse = {
  unique_users: number;
  average_unique_users_per_day: number;
  recommended_daily_budget_limit: number;
  recommended_weekly_budget_limit: number;
};

type TPartialDirectCampaignSettings = Omit<TDirectCampaignSettings, 'settings' | 'budget_limit' | 'name'> & Partial<Pick<TDirectCampaignSettings, 'settings' | 'budget_limit' | 'name'>>;

type TChatDirectResponse = TChatDirect;
type TChatDirectsResponse = TChatDirect[];
type TChatDirectMessagesResponse = TChatMessage[];

type TPaymentResponse = {
  id: number;
  campaign_id: number;
  detail: string;
  amount: number;
  status: string;
  acquiring_type: string;
  acquiring_url: string;
  created_at: Date;
};
