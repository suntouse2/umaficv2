import DirectService from '@api/http/services/DirectService'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type Store = {
	campaignId: number
	directs: TChatDirect[]
	directsPage: number
	direct: TChatDirect | null
	directsFilter: 'all' | 'favorite'
	hasNextDirects: boolean
	hasNextMessages: boolean
	isMessagesFetching: boolean
	isDirectsFetching: boolean
	messages: TChatMessage[]
	messagesPage: number
	messagesQueue: Array<TChatMessage & { direct_id: number }>
}
type Actions = {
	setCampaignId: (campaignId: number) => void
	fetchDirects: () => Promise<void>
	setDirectsFilter: (directsFilter: 'all' | 'favorite') => void
	fetchDirect: (directId: number) => Promise<void>
	updateDirect: (directId: number) => Promise<void>
	fetchMessages: () => Promise<void>
	sendMessage: (message: TChatSendMessage) => Promise<void>
	updateMessage: (payload: TWSIncomingMessage) => void
	readMessage: (messageId: number) => Promise<void>
	favoriteDirect: (directId: number, favorite: boolean) => Promise<void>
}

const defaultState: Store = {
	campaignId: 0,
	directs: [],
	directsPage: 1,
	direct: null,
	directsFilter: 'all',
	isMessagesFetching: false,
	messages: [],
	messagesPage: 1,
	hasNextDirects: true,
	hasNextMessages: true,
	isDirectsFetching: false,
	messagesQueue: [],
}

export const useChatStore = create<Store & Actions>()(
	immer((set, get) => ({
		...defaultState,
		setCampaignId: campaignId => {
			set(() => ({ ...defaultState, campaignId: campaignId }))
			get().fetchDirects()
		},
		//directs
		fetchDirects: async () => {
			const state = get()
			if (state.hasNextDirects == false) return
			if (state.isDirectsFetching == true) return
			set(state => {
				state.isDirectsFetching = true
			})
			const campaignId = state.campaignId
			const directPage = state.directsPage
			const { data } = await DirectService.getDirects(campaignId, directPage, {
				is_favorite: state.directsFilter == 'favorite' ? true : undefined,
			})
			set(state => {
				const newPage = state.directsPage + 1
				state.directs.push(...data)
				state.directsPage = newPage
				state.hasNextDirects = Boolean(data.length)
				state.isDirectsFetching = false
			})
		},
		setDirectsFilter: filter => {
			set(state => {
				state.directs = []
				state.directsFilter = filter
				state.directsPage = 1
				state.hasNextDirects = true
			})
			get().fetchDirects()
		},
		fetchDirect: async directId => {
			if (directId == get().direct?.id) return
			const { data } = await DirectService.getDirect(directId)
			set(state => {
				state.messages = []
				state.messagesPage = 1
				state.direct = data
				state.hasNextMessages = true
				state.isMessagesFetching = false
			})
			get().updateDirect(directId)
			get().fetchMessages()
		},
		updateDirect: async directId => {
			const { data } = await DirectService.getDirect(directId)
			if (get().direct?.id == directId) {
				set(state => {
					state.direct = data
				})
			}
			set(state => {
				const index = state.directs.findIndex(direct => direct.id == data.id)
				state.directs[index] = data
			})
		},
		//messages
		fetchMessages: async () => {
			if (get().hasNextMessages == false) return
			if (get().isMessagesFetching == true) return
			set(state => {
				state.isMessagesFetching = true
			})
			const direct = get().direct
			const messagesPage = get().messagesPage
			if (direct == null) return
			const { data } = await DirectService.getDirectMessages(direct.id, messagesPage)
			set(state => {
				state.isMessagesFetching = false
				state.messages.unshift(...data.reverse())
				state.messagesPage = state.messagesPage + 1
				state.hasNextMessages = Boolean(data.length)
			})
		},
		sendMessage: async message => {
			const direct = get().direct
			if (direct == null) return
			const { data } = await DirectService.sendMessage(direct.id, message)
			const slug = data.catch_slug
			set(state => {
				state.messagesQueue.push({
					id: Date.now() + Math.floor(Math.random() * 10000000),
					date: new Date(Date.now()).toISOString(),
					is_self: true,
					is_read: true,
					is_auto_reply: false,
					forwarded_message: null,
					catch_slug: slug,
					...message,
					direct_id: direct.id,
				})
			})
		},
		updateMessage: payload => {
			const { catch_slug, ...rest } = payload
			//updating messages
			set(state => {
				state.messagesQueue = state.messagesQueue.filter(
					msg => msg.catch_slug !== catch_slug
				)
			})
			if (payload.direct_id == get().direct?.id) {
				set(state => {
					state.messages.push(rest)
				})
			}
		},
		readMessage: async messageId => {
			const directId = get().direct?.id
			if (!directId) return
			await DirectService.readMessage(directId, messageId)
			get().updateDirect(directId)
		},
		favoriteDirect: async (directId, favorite) => {
			await DirectService.updateDirect(directId, {
				is_favorite: favorite,
			})
			get().updateDirect(directId)
		},
	}))
)
