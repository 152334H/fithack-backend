import {spawn} from 'child_process';
import {Router} from 'express';
import {readFile, writeFile, rm} from 'fs/promises'

const runCommand = (sp) => {
	return new Promise((res,rej) => {
		sp.on('close', (code, signal) => {
			if (code !== 0) {
				rej({code, signal})
			}
			res()
		})
	})
}

const whisperRouter = Router()

whisperRouter.post('/stt', async (req,res) => {
	const {audio} = req.body
	if (typeof audio !== 'string') {
		return res.status(400).send({
			error: 'missing audio'
		})
	}

	const audioBuf = Buffer.from(audio, "base64")
	const webmFile = '/home/princess/ML/whisper.cpp/test.webm'
	const audioFile = '/home/princess/ML/whisper.cpp/test.wav'
	await writeFile(webmFile, audioBuf)

	await rm(audioFile).catch(() => 0)
	await runCommand(spawn(
		"ffmpeg", ["-i", webmFile, '-vn', '-ar', '16000', audioFile]
	))

	const subprocess = spawn('./main', ['-t', '10', '--translate', '-l', 'zh', '-m', 'models/ggml-medium.bin', '-f', 'test.wav', '-otxt'], {
		cwd: '/home/princess/ML/whisper.cpp/',
	});
	const p = new Promise((res,rej) => {
		subprocess.on('close', (code, signal) => {
			if (code !== 0) {
				rej({code, signal})
			}
			res()
		})
	})
	
	try {
		await p
	} catch (e) {
		return res.status(400).send({
			error: e
		})
	}

	const buf = await readFile(audioFile+'.txt')
	return res.status(200).send({
		txt: buf.toString()
	})

})


export default whisperRouter
