import {
	transformSettingsToStore,
	transformStoreToSettings,
} from '@helpers/directCampaignSettingsTransformer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type Store = {
	campaignId: number | null
	settings: {
		name: string
		budget_limit: string
		profile: {
			first_name: string
			last_name: string
			about: string
			photo: string | null
		}
		geo: {
			language: string[]
			country: string[]
			region: string[]
			city: string[]
		}
		keywords: {
			include: {
				id: string
				value: string
			}[]
			exclude: {
				id: string
				value: string
			}[]
		}
		auto_reply: {
			funnel: {
				funnel_type: 'order' | 'keyword'
				messages: {
					id: string
					type: 'order' | 'keyword' | 'any' | 'first'
					filter: { id: string; value: string }[] | number | null
					message: TMessageContent
				}[]
			}
			use_assistant: boolean
			assistant: {
				role: 'marketer' | 'user'
				gender: 'female' | 'male'
				description: string
			}
		}
	}
}

const defaultState: Store = {
	campaignId: null,
	settings: {
		name: '',
		budget_limit: '24',
		profile: {
			first_name: '',
			last_name: '',
			about: '',
			photo: null,
		},
		geo: {
			language: [],
			country: [],
			region: [],
			city: [],
		},
		keywords: {
			include: [],
			exclude: [],
		},
		auto_reply: {
			funnel: {
				funnel_type: 'keyword',
				messages: [],
			},
			use_assistant: false,
			assistant: {
				role: 'marketer',
				gender: 'female',
				description: '',
			},
		},
	},
}

type Actions = {
	setSettings: (campaignId: number, settings: TDirectCampaignSettings) => void
	getSettings: () => { campaignId: number | null; settings: TDirectCampaignSettings }
	resetSettings: () => void
	setName: (value: Store['settings']['name']) => void
	setBudgetLimit: (value: Store['settings']['budget_limit']) => void
	setProfile: <K extends keyof Store['settings']['profile']>(
		key: K,
		value: Store['settings']['profile'][K]
	) => void
	setGeo: <K extends keyof Store['settings']['geo']>(
		key: K,
		value: Store['settings']['geo'][K]
	) => void
	setKeyword: <K extends keyof Store['settings']['keywords']>(
		key: K,
		value: Store['settings']['keywords'][K]
	) => void
	setFunnelType: (value: Store['settings']['auto_reply']['funnel']['funnel_type']) => void
	setFunnelMessages: (
		value: Store['settings']['auto_reply']['funnel']['messages']
	) => void
	setFunnel: <K extends keyof Store['settings']['auto_reply']['funnel']>(
		key: K,
		value: Store['settings']['auto_reply']['funnel'][K]
	) => void
	setUseAssistant: (value: Store['settings']['auto_reply']['use_assistant']) => void
	setAssistant: <K extends keyof Store['settings']['auto_reply']['assistant']>(
		key: K,
		value: Store['settings']['auto_reply']['assistant'][K]
	) => void
	getStore: () => Store
	setStore: (state: Store) => void
}

export const useDirectCampaignSettingsStore = create<Store & Actions>()(
	immer((set, get) => ({
		...defaultState,
		setSettings: (campaignId, settings) => {
			set(state => {
				state.campaignId = campaignId
				state.settings = transformSettingsToStore(settings)
			})
		},
		getStore: () => {
			const store: Store = {
				campaignId: get().campaignId,
				settings: get().settings,
			}
			return store
		},
		setStore: initialState => {
			set(state => {
				state.campaignId = initialState.campaignId
				state.settings = initialState.settings
			})
		},
		getSettings: () => {
			const state = get()
			return {
				campaignId: state.campaignId,
				settings: transformStoreToSettings(state),
			}
		},
		resetSettings: () => {
			set(() => defaultState)
		},
		setName: value =>
			set(state => {
				state.settings.name = value
			}),
		setBudgetLimit: value =>
			set(state => {
				state.settings.budget_limit = value
			}),
		setProfile: (key, value) =>
			set(state => {
				state.settings.profile[key] = value
			}),
		setGeo: (key, value) =>
			set(state => {
				state.settings.geo[key] = value
			}),
		setKeyword: (key, value) =>
			set(state => {
				state.settings.keywords[key] = value
			}),
		setFunnelType: value =>
			set(state => {
				state.settings.auto_reply.funnel.funnel_type = value
			}),
		setFunnelMessages: value =>
			set(state => {
				state.settings.auto_reply.funnel.messages = value
			}),
		setFunnel: (key, value) =>
			set(state => {
				state.settings.auto_reply.funnel[key] = value
			}),
		setUseAssistant: value =>
			set(state => {
				state.settings.auto_reply.use_assistant = value
			}),
		setAssistant: (key, value) =>
			set(state => {
				state.settings.auto_reply.assistant[key] = value
			}),
	}))
)
