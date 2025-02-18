import { resetDatabase } from './dbReset';

beforeEach(async () => {
  await resetDatabase();
});