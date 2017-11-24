interface customProp extends Object {
  type: string,
  max: number,
  empty: number,
  maxValues: number
}
type prop = 'genre' | 'mark' | 'archetype' | 'weakness' | 'virtue' | 'above_avg' | 'below_avg';
export class NPC {
  [key: string]: any;
  propsParams: Map<prop, customProp> = new Map([
    [<prop>'genre', { type: 'number', max: 2, empty: 0, maxValues: 0 }],
    [<prop>'mark', { type: 'number', max: 10, empty: 0.5, maxValues: 0 }],
    [<prop>'archetype', { type: 'number', max: 12, empty: 0, maxValues: 0 }],
    [<prop>'weakness', { type: 'number', max: 10, empty: 0, maxValues: 0 }],
    [<prop>'virtue', { type: 'number', max: 10, empty: 0, maxValues: 0 }],
    [<prop>'above_avg', { type: 'numsArray', max: 17, empty: 0, maxValues: 4 }],
    [<prop>'below_avg', { type: 'numsArray', max: 17, empty: 0, maxValues: 4 }],
  ]);
  constructor(private currentNPC?: NPC, private locked_properties: Map<string, boolean> = new Map([['none', false]])) {
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

  randomArrayOfNumbers({ maxValues, biggerValue } = { maxValues: 0, biggerValue: 0 }): number[] {
    const totalNumbers = maxValues || this.randomNumber(4, 1);
    return Array
      .from({ length: totalNumbers }, () => this.randomNumber(biggerValue || 10))
      // Filter repeated numbers
      .filter((n, i, a) => a.indexOf(n) === i);
  }

  customAssign(prop: prop): number | number[] | undefined {
    const config = this.propsParams.get(prop);
    if (!config) {
      console.error(`Not known property ${prop}`);
      return undefined;
    }
    if (Math.random() <= config.empty) return undefined;
    switch (config.type) {
      case 'number':
        return this.randomNumber(config.max);
      case 'numsArray':
        return this.randomArrayOfNumbers({ maxValues: config.maxValues, biggerValue: config.max });

      default:
        console.error(`Not known type ${config.type} for ${prop}`);
        return undefined;
    }
  }

  defaultAssign(propValue: number | number[]): number | number[] | undefined {
    switch (typeof propValue) {
      case 'number':
        return this.randomNumber(6);
      case 'object':
        return this.randomArrayOfNumbers();
    }
  }

  modifyRepeatedHab(value: number, i: number, npc: NPC,
    unblockedProp: 'below_avg' | 'above_avg',
    theOtherProp: 'below_avg' | 'above_avg') {
    while (
      npc.abilities[theOtherProp].includes(value)
      || (npc.abilities[unblockedProp].indexOf(value) !== -1 && npc.abilities[unblockedProp].indexOf(value) < i)
    ) {
      const propConfig = this.propsParams.get(theOtherProp);
      if (propConfig) value = this.randomNumber(propConfig.max);
    }
    return value;
  }

  dontRepeatAbilities(npc: NPC): NPC {
    if (!this.locked_properties.get('above_avg') && !this.locked_properties.get('below_avg')) {
      const unblockedProp = this.locked_properties.get('above_avg') ? 'below_avg' : 'above_avg';
      const theOtherProp = !this.locked_properties.get('above_avg') ? 'below_avg' : 'above_avg';
      npc.abilities[unblockedProp] = npc.abilities[unblockedProp].map((value: number, i: number) => this.modifyRepeatedHab(value, i, npc, unblockedProp, theOtherProp));
    }
    return npc;
  }

  randomizeProperties(nestedObject: { [key: string]: any }): NPC {
    for (const mainProp in nestedObject) {
      const mainValue = nestedObject[mainProp];
      for (const prop in mainValue) {
        if (!this.locked_properties || !this.locked_properties.get(prop)) {
          nestedObject[mainProp][prop] = this.propsParams.get(<prop>prop)
            ? this.customAssign(<prop>prop)
            : this.defaultAssign(mainValue[prop]);
        } else {
          nestedObject[mainProp][prop] = this.currentNPC && this.currentNPC[mainProp][prop];
        }
      }
    }
    return <NPC>nestedObject;
  }
}
