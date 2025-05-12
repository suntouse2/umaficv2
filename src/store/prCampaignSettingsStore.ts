import {
	transformSettingsToStore,
	transformStoreToSettings,
} from '@helpers/prCampaignSettingsTransformer'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type PrStore = {
	campaignId: number | null
	settings: {
		name: string
		budget_limit: string
		channels: {
			include: {
				id: string
				value: string
			}[]
			exclude: {
				id: string
				value: string
			}[]
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
				funnel_type: 'order' | 'keyword' | 'union'
				delays: {
					order: number
					delay: {
						min: number
						max: number
					}
				}[]
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

const defaultState: PrStore = {
	campaignId: null,
	settings: {
		name: '',
		budget_limit: '24',
		channels: {
			include: [],
			exclude: [],
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
				delays: [],
				funnel_type: 'order',
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
	setSettings: (campaignId: number, settings: TPRCampaignSettings) => void
	getSettings: () => {
		campaignId: number | null
		settings: TPRCampaignSettings
	}
	resetSettings: () => void
	setName: (value: PrStore['settings']['name']) => void
	setBudgetLimit: (value: PrStore['settings']['budget_limit']) => void
	setChannel: <K extends keyof PrStore['settings']['channels']>(
		key: K,
		value: PrStore['settings']['channels'][K]
	) => void
	setGeo: <K extends keyof PrStore['settings']['geo']>(
		key: K,
		value: PrStore['settings']['geo'][K]
	) => void
	setKeyword: <K extends keyof PrStore['settings']['keywords']>(
		key: K,
		value: PrStore['settings']['keywords'][K]
	) => void
	setFunnelType: (
		value: PrStore['settings']['auto_reply']['funnel']['funnel_type']
	) => void
	setFunnelMessages: (
		value: PrStore['settings']['auto_reply']['funnel']['messages']
	) => void
	setFunnel: <K extends keyof PrStore['settings']['auto_reply']['funnel']>(
		key: K,
		value: PrStore['settings']['auto_reply']['funnel'][K]
	) => void
	setUseAssistant: (value: PrStore['settings']['auto_reply']['use_assistant']) => void
	setAssistant: <K extends keyof PrStore['settings']['auto_reply']['assistant']>(
		key: K,
		value: PrStore['settings']['auto_reply']['assistant'][K]
	) => void
	getStore: () => PrStore
	setStore: (state: PrStore) => void
}

export const usePrCampaignSettingsStore = create<PrStore & Actions>()(
	immer((set, get) => ({
		...defaultState,
		setSettings: (campaignId, settings) => {
			set(state => {
				state.campaignId = campaignId
				state.settings = transformSettingsToStore(settings)
			})
		},
		getStore: () => {
			const store: PrStore = {
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
		setGeo: (key, value) =>
			set(state => {
				state.settings.geo[key] = value
			}),
		setChannel: (key, value) =>
			set(state => {
				state.settings.channels[key] = value
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
