export function decodeWaveform(encoded5bit: Uint8Array): number[] {
	const bitsCount = encoded5bit.length * 8
	const valuesCount = Math.floor(bitsCount / 5)
	if (!valuesCount) {
		return []
	}
	const result: number[] = Array(valuesCount)
	const bitsData = encoded5bit
	for (let i = 0, l = valuesCount - 1; i !== l; ++i) {
		const byteIndex = Math.floor((i * 5) / 8)
		const bitShift = Math.floor((i * 5) % 8)
		const value = bitsData[byteIndex] + (bitsData[byteIndex + 1] << 8)
		result[i] = (value >> bitShift) & 0x1f
	}
	const lastByteIndex = Math.floor(((valuesCount - 1) * 5) / 8)
	const lastBitShift = Math.floor(((valuesCount - 1) * 5) % 8)
	const lastValue = bitsData[lastByteIndex] + (bitsData[lastByteIndex + 1] << 8)
	result[valuesCount - 1] = (lastValue >> lastBitShift) & 0x1f

	return result
}

export function interpolateArray(
	data: number[],
	fitCount: number
): { data: number[]; peak: number } {
	let peak = 0
	const newData: number[] = new Array(fitCount)
	const springFactor = data.length / fitCount
	const leftFiller = data[0]
	const rightFiller = data[data.length - 1]
	for (let i = 0; i < fitCount; i++) {
		const idx = Math.floor(i * springFactor)
		const val =
			((data[idx - 1] ?? leftFiller) +
				(data[idx] ?? leftFiller) +
				(data[idx + 1] ?? rightFiller)) /
			3
		newData[i] = val
		if (peak < val) {
			peak = val
		}
	}
	return { data: newData, peak }
}

function readAudioFile(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as ArrayBuffer)
		reader.onerror = reject
		reader.readAsArrayBuffer(file)
	})
}

function decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
	const audioContext = new (window.AudioContext || window.AudioContext)()
	return new Promise((resolve, reject) => {
		audioContext.decodeAudioData(
			arrayBuffer,
			buffer => resolve(buffer),
			error => reject(error)
		)
	})
}
function extractChannelData(decodedAudio: AudioBuffer): Float32Array {
	return decodedAudio.getChannelData(0)
}

export async function processAudioFile(
	file: File
): Promise<{ data: number[]; peak: number } | undefined> {
	try {
		const arrayBuffer = await readAudioFile(file)
		const decodedAudio = await decodeAudioData(arrayBuffer)

		const channelData = extractChannelData(decodedAudio)

		// Пример интерполяции аудиоданных, если нужно изменить размер массива данных
		const fitCount = 100 // Количество точек, до которого интерполируем данные
		const interpolatedData = interpolateArray(Array.from(channelData), fitCount)

		return interpolatedData
	} catch (error) {
		console.error('Ошибка при обработке аудиофайла:', error)
		return undefined
	}
}
