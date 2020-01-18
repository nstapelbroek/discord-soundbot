import ConfigInterface from './ConfigInterface';

const DEFAULT_CONFIG: ConfigInterface = {
  clientId: '',
  token: '',

  language: 'en',
  prefix: '!',
  acceptedExtensions: ['.wav', '.mp3', '.aac', '.flac', '.m4a', '.webm', '.ogg'],
  maximumFileSize: 1000000,
  volume: 1.0,
  deleteMessages: false,
  stayInChannel: false,
  deafen: false,
  game: 'sounds'
};

export default DEFAULT_CONFIG;
