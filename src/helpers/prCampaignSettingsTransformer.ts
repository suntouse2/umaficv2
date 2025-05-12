import { nanoid } from 'nanoid'
import { PrStore } from '../store/prCampaignSettingsStore'

type Store = PrStore

export function transformSettingsToStore(settings: TPRCampaignSettings) {
	const storeSettings: Store['settings'] = {
		name: settings.name,
		budget_limit: settings.budget_limit,
		channels: {
			include: settings.settings.target.channels.include.map(ch => ({
				id: nanoid(),
				value: ch,
			})),
			exclude: settings.settings.target.channels.exclude.map(ch => ({
				id: nanoid(),
				value: ch,
			})),
		},
		geo: settings.settings.target.geo,
		keywords: {
			include: settings.settings.target.search.include.map(kw => ({
				id: nanoid(),
				value: kw,
			})),
			exclude: settings.settings.target.search.exclude.map(kw => ({
				id: nanoid(),
				value: kw,
			})),
		},
		auto_reply: {
			funnel: {
				funnel_type: settings.settings.auto_reply.funnel.funnel_type,
				delays: settings.settings.auto_reply.funnel.order.map(i => ({
					order: i.order,
					delay: i.delay
						? i.delay
						: {
								min: 0,
								max: 0,
						  },
				})),
				messages: [],
			},
			use_assistant: settings.settings.auto_reply.use_assistant,
			assistant:
				settings.settings.auto_reply.assistant !== null
					? {
							description: settings.settings.auto_reply.assistant.description ?? '',
							role: settings.settings.auto_reply.assistant.role,
							gender: settings.settings.auto_reply.assistant.gender,
					  }
					: {
							description: '',
							role: 'marketer',
							gender: 'female',
					  },
		},
	}

	settings.settings.auto_reply.funnel.order.forEach(o =>
		o.messages.forEach(m => {
			storeSettings.auto_reply.funnel.messages.push({
				id: nanoid(),
				filter: o.order,
				type: 'any',
				message: m,
			})
		})
	)

	settings.settings.auto_reply.funnel.keyword.forEach(o =>
		o.messages.forEach(m => {
			storeSettings.auto_reply.funnel.messages.push({
				id: nanoid(),
				filter: o.keywords.map(kw => ({
					id: nanoid(),
					value: kw,
				})),
				type: 'keyword',
				message: m,
			})
		})
	)

	return storeSettings
}

export function transformStoreToSettings(state: Store): TPRCampaignSettings {
	const funnelMessages = state.settings.auto_reply.funnel.messages
	const orderMap = new Map<number, TMessageContent[]>()
	funnelMessages.forEach(msg => {
		const orderNumber = msg.filter as number
		if (!orderMap.has(orderNumber)) {
			orderMap.set(orderNumber, [])
		}
		orderMap.get(orderNumber)!.push(msg.message)
	})

	const keywordMessages = funnelMessages.filter(m => m.type === 'keyword')
	const keywordMap = new Map<string, TMessageContent[]>()
	keywordMessages.forEach(msg => {
		const filters = (msg.filter as { id: string; value: string }[])
			.map(f => f.value)
			.sort()
		const key = filters.join('|')
		if (!keywordMap.has(key)) {
			keywordMap.set(key, [])
		}
		keywordMap.get(key)!.push(msg.message)
	})

	const settings: TPRCampaignSettings = {
		name: state.settings.name,
		budget_limit: state.settings.budget_limit,
		settings: {
			target: {
				channels: {
					include: state.settings.channels.include.map(ch => ch.value),
					exclude: state.settings.channels.exclude.map(ch => ch.value),
				},
				geo: {
					language: state.settings.geo.language,
					country: state.settings.geo.country,
					region: state.settings.geo.region,
					city: state.settings.geo.city,
				},
				search: {
					include: state.settings.keywords.include.map(kw => kw.value),
					exclude: state.settings.keywords.exclude.map(kw => kw.value),
				},
			},
			auto_reply: {
				funnel: {
					funnel_type: state.settings.auto_reply.funnel.funnel_type,
					order: Array.from(orderMap.entries()).map(([order, messages]) => ({
						delay: state.settings.auto_reply.funnel.delays.find(i => i.order == order)
							?.delay ?? {
							min: 0,
							max: 1,
						},
						order,
						messages,
					})),
					keyword: Array.from(keywordMap.entries()).map(([key, messages]) => ({
						keywords: key.split('|'),
						messages,
					})),
				},
				use_assistant: state.settings.auto_reply.use_assistant,
				assistant:
					state.settings.auto_reply.assistant !== null
						? {
								role: state.settings.auto_reply.assistant.role,
								gender: state.settings.auto_reply.assistant.gender,
								description: state.settings.auto_reply.assistant.description,
						  }
						: null,
			},
		},
	}

	return settings
}
