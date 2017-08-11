export class NPC {
  [key: string]: any;
  propsParams = new Map([
    ['genre', { type: 'number', max: 2, empty: 0 }],
    ['mark', { type: 'number', max: 10, empty: 0.5 }],
    ['archetype', { type: 'number', max: 12, empty: 0 }],
    ['weakness', { type: 'number', max: 10, empty: 0 }],
    ['virtue', { type: 'number', max: 10, empty: 0 }],
  ]);
  constructor() {
    const empty = {
      appearance: {
        age: 0,
        height: 0,
        constitution: 0,
        skin: 0,
        genre: 0,
        clothing: 0,
        mark: 0
      },
      personality: {
        hobbies: <number[]>[],
        weakness: 0,
        virtue: 0,
        moral: 0,
        archetype: 0,
      },
      habilities: {
        above_avg: <number[]>[],
        below_avg: <number[]>[]
      },
    }
    return this.randomizeProperties(empty);
  }

  randomNumber(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randomArrayOfNumbers(): number[] {
    const totalNumbers = this.randomNumber(4, 1);
    return Array
      .from({ length: totalNumbers }, () => this.randomNumber(10))
      // Filter repeated numbers
      .filter((n, i, a) => a.indexOf(n) === i);
  }

  customAssign(prop: string): number | number[] {
    const config = this.propsParams.get(prop);
    if (Math.random() <= config.empty) return undefined;
    switch (config.type) {
      case 'number':
        return this.randomNumber(config.max);
      case 'numsArray':
        return this.randomArrayOfNumbers();

      default:
        console.error(`Not known type ${config.type} for ${prop}`);
        return null;
    }
  }

  defaultAssign(propValue: number | number[]): number | number[] {
    switch (typeof propValue) {
      case 'number':
        return this.randomNumber(6);
      case 'object':
        return this.randomArrayOfNumbers();
    }
  }

  randomizeProperties(nestedObject: { [key: string]: any }): NPC {
    for (const mainProp in nestedObject) {
      const mainValue = nestedObject[mainProp];
      for (const prop in mainValue) {
        nestedObject[mainProp][prop] = this.propsParams.get(prop)
          ? this.customAssign(prop)
          : this.defaultAssign(mainValue[prop]);
      }
    }
    return <NPC>nestedObject;
  }
}