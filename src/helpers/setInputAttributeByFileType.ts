export default function InputAcceptByMediaType(type: TMediaTypes): string {
	switch (type) {
		case 'auto':
			return 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx'
		case 'document':
			return 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx'

		case 'round':
			return 'video/*'

		case 'voice':
			return 'audio/*'
	}
}
