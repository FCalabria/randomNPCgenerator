import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NPC } from '../../classes/npc';
// import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public customNpc = new NPC();
  public cards: string[] = Object.keys(this.customNpc);
  private propertiesLocked: Map<string, boolean> = this.generatePropsLockMap();
  constructor(public translate: TranslateService) {
  }

  getCardProperties(cardName: string) {
    return Object.keys(this.customNpc[cardName]);
  }

  hasLockedProps() {
    let hasLocked = false;
    this.propertiesLocked.forEach(value => {
      if (value) hasLocked = true;
    });
    return hasLocked;
  }

  unlockAll() {
    this.propertiesLocked.forEach((value, key) => {
      if (value) return this.toogleLock(key);
    });
  }

  setRandomNpc() {
    this.customNpc = new NPC(this.customNpc, this.propertiesLocked);
  }

  toogleLock(property: string) {
    this.propertiesLocked.set(property, !this.propertiesLocked.get(property));
  }

  isPropLocked(property: string) {
    return this.propertiesLocked.get(property);
  }

  private getPropertyArray(group: string, property: string): number[] {
    const propValue: number[] | number | undefined = this.customNpc[group][property];
    return propValue === undefined 
      ? []
      : typeof propValue === 'number' ? [propValue] : propValue;
  }

  getTranslatedValue(group: string, property: string) {
    const propertyArray =  this.getPropertyArray(group, property);
    if (propertyArray.length === 0) return '---';
    return this.getPropertyArray(group, property)
      .map(number => this.translate.instant(`props.${property}.${number}`))
      .reduce((prev, current) => !prev ? current : `${prev}, ${current.toLowerCase()}`);
  }

  private generatePropsLockMap(): Map<any, any> {
    return new Map(Object.keys(this.customNpc)
      .map(propGroup => this.customNpc[propGroup])
      .reduce((prev: string[], next: {}) => prev.concat(Object.keys(next)), [])
      .map((propName:string) => [propName, false])
    );
  }

}
