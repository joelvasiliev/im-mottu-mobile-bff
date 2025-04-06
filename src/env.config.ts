export default () => ({
  CAT_API_URL:
    process.env.CAT_API_URL || 'https://api.thecatapi.com/v1/images/search',
  RICK_AND_MORTY_API_URL:
    process.env.RICK_AND_MORTY_API_URL ||
    'https://rickandmortyapi.com/api/character/',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
});
