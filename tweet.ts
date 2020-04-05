import Twitter from 'twitter-lite';

const SCREEN_NAME = 'Switch_SNES_Bot'
const NOT_AVAILIABLE = 'Der Nintendo Switch SNES Controller ist derzeit nicht verfügbar.';
const AVAILABLE = 'Der Nintendo Switch SNES Controller ist verfügbar.';
const STORE_URL = 'https://mynintendostore.nintendo.de/super-nintendo-entertainment-system-controller-for-nintendo-switch.html';

const text = (available: boolean): string => {
  const time = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'Europe/Berlin'
  }).format(new Date());
  return available ? `${AVAILABLE} (${time}) ${STORE_URL}` : `${NOT_AVAILIABLE} (${time})`
}

export default async (available: boolean): Promise<void> => {
  const client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY ?? '',
    consumer_secret: process.env.CONSUMER_SECRET ?? '',
    access_token_key: process.env.ACCESS_TOKEN_KEY ?? '',
    access_token_secret: process.env.ACCESS_TOKEN_SECRET ?? ''
  });
  await client.get("account/verify_credentials");

  const lastTweet = (await client.get("statuses/user_timeline", {
    screen_name: SCREEN_NAME,
    count: 25,
    include_rts: true
  }))[0]?.text ?? '';

  if (lastTweet.startsWith(available ? AVAILABLE : NOT_AVAILIABLE)) {
    console.log('Already tweeted. Skipping new tweet.');
    return;
  }

  await client.post("statuses/update", {
    status: text(available)
  });
  console.log('tweeted.');
}
