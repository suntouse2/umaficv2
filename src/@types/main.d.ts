type TAuth = {
	access_token: string
}
type TUser = {
	id: number
	username: string
	first_name: string
	last_name: string
	is_superuser: boolean
	is_operator: boolean
	balance: string
	created_at: Date
}
type TMessageContent = {
	message: string
	media: {
		filepath: string
		type: TMediaTypes
	} | null
}
type TMediaTypes = 'auto' | 'voice' | 'round' | 'document'

type TCampaign = {
	id: number
	name: string
	type: 'search' | 'watch' | 'direct'
	state: 'pending' | 'preparing' | 'active' | 'inactive'
	last_active_at: string
	last_stop_at: string
	created_at: string
}
interface TDirectCampaign extends TCampaign {
	is_moderated: boolean
	budget_limit: number
	numeric_statistics: TDirectCampaignNumericStatistics
}
type TDirectCampaignNumericStatistics = {
	directs: number
	directs_by_day: number
	directs_open: number
	directs_favorite: number
	directs_interacted: number
	directs_interacted_by_day: number
	incoming_messages: number
	incoming_messages_by_day: number
	incoming_messages_unread: number
	outgoing_auto_reply_messages: number
	outgoing_auto_reply_messages_by_day: number
	spending: string
	spending_by_day: string
	repayment: string
	repayment_by_day: string
}
type TDirectCampaignSettings = {
	name: string
	settings: {
		target: TDirectCampaignSettingsTarget
		auto_reply: {
			funnel: TDirectCampaignSettingsFunnel
			assistant: TDirectCampaignSettingsAI
			use_assistant: boolean
		}
		profile: TDirectCampaignSettingsProfile
	}
	budget_limit: string
}
type TDirectCampaignSettingsTarget = {
	geo: TDirectCampaignSettingsTargetGEO
	search: TDirectCampaignSettingsTargetSearch
}
type TDirectCampaignSettingsTargetGEO = {
	language: string[]
	country: string[]
	region: string[]
	city: string[]
}
type TDirectCampaignSettingsTargetSearch = {
	include: string[]
	exclude: string[]
}

type TDirectCampaignSettingsFunnel = {
	order: TDirectCampaignSettingsFunnelOrder[]
	keyword: TDirectCampaignSettingsFunnelKeyword[]
	funnel_type: 'order' | 'keyword'
}
type TDirectCampaignSettingsFunnelOrder = {
	messages: TFunnelMessage[]
	order: number
}
type TDirectCampaignSettingsFunnelKeyword = {
	messages: TFunnelMessage[]
	keywords: string[]
}
type TFunnelMessage = TMessageContent
//for control funnel
type TFunnelItem = {
	order?: number
	keywords?: string[]
	messages: TFunnelMessage[]
}
type TFunnelMessageChangePayload = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	funnelFilter: any
	message: TFunnelMessage
	messageIndex: number
}
type TDirectCampaignSettingsAI = {
	role: 'marketer' | 'user'
	gender: 'female' | 'male'
	description: string
} | null

type TDirectCampaignSettingsProfile = {
	first_name: string
	last_name: string
	about: string
	photo: null | string
}

type TDirectCampaignSettingsCheckMessages = {
	id: number
	content: TMessageContent
	date: string
	user: User
	channel: Channel
	link: string
}
type TDirectCampaignSettingsCheckStatistics = {
	unique_users: number
	messages: number
	average_unique_users_per_day: number
	recommended_daily_budget_limit: number
	recommended_weekly_budget_limit: number
}

type TChatDirect = {
	id: number
	bot: {
		id: number
		username: string
		first_name: string
		last_name: string
		phone: string
		photo: string
		link: string
	}
	user: {
		id: number
		username: string
		first_name: string
		last_name: string
		phone: string
		link: string
	}
	is_open: boolean
	is_favorite: boolean
	is_interacted: boolean
	is_archived: boolean
	last_message: {
		id: number
		content: TMessageContent
		date: string
		is_self: boolean
		is_read: boolean
		is_auto_reply: boolean
		forwarded_message: {
			id: number
			content: TMessageContent
			date: string
			user: {
				id: number
				username: string
				first_name: string
				last_name: string
				phone: string
				link: string
			} | null
			channel: {
				id: number
				title: string
				username: string
				about: string
				participants_count: number
				spam_score: number
				language: string
				country: string
				region: string
				link: string
			}
		} | null
		reply_to: number | null
	}
	unread_count: number
	created_at: string
}
type TChatMessage = {
	id: number
	content: TMessageContent
	date: string
	is_self: boolean
	is_read: boolean
	is_auto_reply: boolean
	forwarded_message: {
		id: number
		content: TMessageContent
		date: string
		user: {
			id: number
			username: string
			first_name: string
			last_name: string
			phone: string
			link: string
		}
		channel: {
			id: number
			title: string
			username: string
			about: string
			participants_count: number
			spam_score: number
			language: string
			country: string
			region: string
			link: string
		}
	} | null
	catch_slug?: string
	reply_to: number | null
}
type TChatSendMessage = {
	content: TMessageContent
	reply_to: number | null
}
type TChatDirectStatusUpdate = {
	is_open?: boolean
	is_favorite?: boolean
}
type TChatDirectsStatusUpdate = {
	dto: {
		is_open: boolean
		is_favorite: boolean
	}
	ids: array<number>
	min_id: number
	max_id: number
}
type TChatMessagesStatusUpdate = {
	dto: {
		is_read: boolean
	}
	ids: array<number>
	min_id: number
	max_id: number
}

type TPayment = {
	id: number
	campaign_id: number
	detail: string
	amount: number
	status: string
	acquiring_type: string
	acquiring_url: string
	created_at: Date
}
type TCreatePaymentForm = {
	email?: string
	phone?: string
	amount: number
}
type TAddChannelForm = {
	usernames: string[]
	default_geo?: {
		language: string | null
		country: string | null
		region: string | null
		city: string | null
	}
}

type TChatDirect = {
	id: number
	bot: {
		id: number
		username: string
		first_name: string
		last_name: string
		phone: string
		photo: string
		link: string
	}
	user: {
		id: number
		username: string
		first_name: string
		last_name: string
		phone: string
		link: string
	}
	is_open: boolean
	is_favorite: boolean
	is_interacted: boolean
	is_archived: boolean
	last_message: {
		id: number
		content: TMessageContent
		date: string
		is_self: boolean
		is_read: boolean
		is_auto_reply: boolean
		forwarded_message: {
			id: number
			content: TMessageContent
			date: string
			user: {
				id: number
				username: string
				first_name: string
				last_name: string
				phone: string
				link: string
			} | null
			channel: {
				id: number
				title: string
				username: string
				about: string
				participants_count: number
				spam_score: number
				language: string
				country: string
				region: string
				link: string
			}
		} | null
		reply_to: number | null
	}
	unread_count: number
	created_at: string
}
type TChatMessage = {
	id: number
	content: TMessageContent
	date: string
	is_self: boolean
	is_read: boolean
	is_auto_reply: boolean
	forwarded_message: {
		id: number
		content: TMessageContent
		date: string
		user: {
			id: number
			username: string
			first_name: string
			last_name: string
			phone: string
			link: string
		}
		channel: {
			id: number
			title: string
			username: string
			about: string
			participants_count: number
			spam_score: number
			language: string
			country: string
			region: string
			link: string
		}
	} | null
	catch_slug: string
	reply_to: number | null
}

type TWSIncomingMessage = TChatMessage & {
	direct_id: number
}

type TChatSendMessage = {
	content: TMessageContent
	reply_to: number | null
}
type TChatDirectStatusUpdate = {
	is_open?: boolean
	is_favorite?: boolean
}
type TChatDirectsStatusUpdate = {
	dto: {
		is_open: boolean
		is_favorite: boolean
	}
	ids: array<number>
	min_id: number
	max_id: number
}
type TChatMessagesStatusUpdate = {
	dto: {
		is_read: boolean
	}
	ids: array<number>
	min_id: number
	max_id: number
}
