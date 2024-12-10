import { nanoid } from 'nanoid'

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
export function transformSettingsToStore(settings: TDirectCampaignSettings) {
	const storeSettings: Store['settings'] = {
		name: settings.name,
		budget_limit: settings.budget_limit,
		profile: settings.settings.profile,
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
				messages: [],
			},
			use_assistant: settings.settings.auto_reply.use_assistant,
			assistant: {
				description: settings.settings.auto_reply.assistant.description,
				role: settings.settings.auto_reply.assistant.role,
				gender: settings.settings.auto_reply.assistant.gender,
			},
		},
	}

	// Трансформация для order
	settings.settings.auto_reply.funnel.order.forEach(o =>
		o.messages.forEach(m => {
			storeSettings.auto_reply.funnel.messages.push({
				id: nanoid(),
				filter: o.order,
				type: o.order == 1 ? 'first' : o.order == 99 ? 'any' : 'order',
				message: m,
			})
		})
	)

	// Трансформация для keyword
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

export function transformStoreToSettings(state: Store): TDirectCampaignSettings {
	const funnelMessages = state.settings.auto_reply.funnel.messages
	const orderMessages = funnelMessages.filter(
		m => m.type === 'first' || m.type === 'any' || m.type === 'order'
	)
	const orderMap = new Map<number, TMessageContent[]>()
	orderMessages.forEach(msg => {
		const orderNumber =
			msg.type === 'first' ? 1 : msg.type === 'any' ? 99 : (msg.filter as number)
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

	const settings: TDirectCampaignSettings = {
		name: state.settings.name,
		budget_limit: state.settings.budget_limit,
		settings: {
			profile: {
				first_name: state.settings.profile.first_name,
				last_name: state.settings.profile.last_name,
				about: state.settings.profile.about,
				photo: state.settings.profile.photo,
			},
			target: {
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
						order,
						messages,
					})),
					keyword: Array.from(keywordMap.entries()).map(([key, messages]) => ({
						keywords: key.split('|'),
						messages,
					})),
				},
				use_assistant: state.settings.auto_reply.use_assistant,
				assistant: {
					role: state.settings.auto_reply.assistant.role,
					gender: state.settings.auto_reply.assistant.gender,
					description: state.settings.auto_reply.assistant.description,
				},
			},
		},
	}

	return settings
}
