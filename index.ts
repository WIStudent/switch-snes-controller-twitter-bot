import isAvailable from './isAvailable';
import tweet from './tweet';

(async () => {
  const available = await isAvailable();
  console.log(`available: ${available}`);
  await tweet(available);
})()
  .catch((e) => {
    console.warn(e);
    process.exit(1)
  });