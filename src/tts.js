const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

// Google Cloud TTS 클라이언트 생성
const client = new textToSpeech.TextToSpeechClient({
    keyFilename: path.join(__dirname, 'config', 'project-tts-433810-c08f02942439.json'),
  });
  

// 텍스트를 음성으로 변환하는 함수
async function convertTextToSpeech(text) {
  const request = {
    input: { text: text },
    voice: { languageCode: 'ko-KR', ssmlGender: 'MALE' },
    audioConfig: { audioEncoding: 'MP3' },
  };


  try {
    // TTS API 호출
    const [response] = await client.synthesizeSpeech(request);
    // 음성 데이터를 바로 반환 (파일 저장하지 않음)
    return response.audioContent;
  } catch (err) {
    console.error('ERROR:', err);
    throw err;
  }
}

module.exports = { convertTextToSpeech };
