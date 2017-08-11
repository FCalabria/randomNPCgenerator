interface customProp extends Object {
  type: string,
  max: number,
  empty: number,
  maxValues: number
}
export class NPC {
  [key: string]: any;
  propsParams: Map<string, customProp> = new Map([
    ['genre', { type: 'number', max: 2, empty: 0, maxValues: null }],
    ['mark', { type: 'number', max: 10, empty: 0.5, maxValues: null }],
    ['archetype', { type: 'number', max: 12, empty: 0, maxValues: null }],
    ['weakness', { type: 'number', max: 10, empty: 0, maxValues: null }],
    ['virtue', { type: 'number', max: 10, empty: 0, maxValues: null }],
    ['above_avg', { type: 'numsArray', max: 17, empty: 0, maxValues: 4 }],
    ['below_avg', { type: 'numsArray', max: 17, empty: 0, maxValues: 4 }],
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
      abilities: {
        above_avg: <number[]>[],
        below_avg: <number[]>[]
      },
    }
    return this.dontRepeatAbilities(this.randomizeProperties(empty));
  }

  randomNumber(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randomArrayOfNumbers({maxValues, biggerValue} = {maxValues: 0, biggerValue: 0}): number[] {
    const totalNumbers = maxValues || this.randomNumber(4, 1);
    return Array
      .from({ length: totalNumbers }, () => this.randomNumber(biggerValue || 10))
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
        return this.randomArrayOfNumbers({maxValues: config.maxValues, biggerValue: config.max});

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

  dontRepeatAbilities(npc: NPC): NPC {
    const aboveavg: number[] = npc.abilities.above_avg;
    const belowavg = npc.abilities.below_avg;
    npc.abilities.above_avg = aboveavg.map((value, i) => {
      while (belowavg.includes(value) || (aboveavg.indexOf(value) !== -1 && aboveavg.indexOf(value) < i)) {
        value = this.randomNumber(this.propsParams.get('below_avg').max);
      }
      return value;
    });
    return npc;
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