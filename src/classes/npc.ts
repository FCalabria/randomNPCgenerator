export class NPC{
  [key:string]: any;
  constructor() {
    const empty = {
      appearance: {
        age: 0,
        height: 0,
        constitution: 0,
        skin: 0,
      },
      personality: {
        hobbies: <number[]>[],
        weakness: 0,
        virtue: 0,
        moral: 0,
      },
      habilities: {
        above_avg: <number[]>[],
        below_avg: <number[]>[]
      },
    }
    return this.randomizeProperties(empty);
  }

  randomNumber(max:number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randomArrayOfNumbers(): number[] {
    const totalNumbers = this.randomNumber(4, 1);
    return Array
    .from({length: totalNumbers}, () => this.randomNumber(10))
    // Filter repeated numbers
    .filter((n, i, a) => a.indexOf(n) === i);
  }

  randomizeProperties(nestedObject: {[key:string]: any }): NPC {
    for (const mainProp in nestedObject) {
      const mainValue = nestedObject[mainProp];
      for (const prop in mainValue) {
        switch (typeof mainValue[prop]) {
          case 'number':
            nestedObject[mainProp][prop] = this.randomNumber(6);
            break;
          case 'object':
            nestedObject[mainProp][prop] = this.randomArrayOfNumbers();
          break;
        }
      }
    }
    return <NPC>nestedObject;
  }
}