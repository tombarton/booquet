import { asyncForEach } from '../asyncForEach';

const waitFor = async (time = 200) =>
  await new Promise((res) => setTimeout(res, time));

describe('asyncForEach', () => {
  it('executes async tasks sequentially', async () => {
    const testValues = [1, 2, 3, 4, 5];
    const results: number[] = [];

    await asyncForEach<number>(testValues, async (value) => {
      waitFor(Math.random() * (500 - 100) + 100);
      results.push(value);
    });

    expect(results).toEqual(testValues);
  });
});
