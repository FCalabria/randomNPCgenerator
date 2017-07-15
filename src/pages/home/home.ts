import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NPC } from '../../classes/npc';
// import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public customNpc: NPC = new NPC();
  public cards: string[] = Object.keys(this.customNpc);
  private propertiesLocked: Map<string, boolean> = this.generatePropsLockMap();
  constructor(public translate: TranslateService) {
  }

  getCardProperties(cardName: string) {
    return Object.keys(this.customNpc[cardName]);
  }

  setRandomNpc() {
    const newNpc = new NPC();
    for (const group in newNpc) {
      for(const prop in newNpc[group]) {
        if (!this.propertiesLocked.get(prop)) {
          this.customNpc[group][prop] = newNpc[group][prop];
        }
      }
    }
  }

  toogleLock(property) {
    this.propertiesLocked.set(property, !this.propertiesLocked.get(property));
  }

  isPropLocked(property: string) {
    return this.propertiesLocked.get(property);
  }

  private getPropertyArray(group, property): number[] {
    const propValue: number[] | number = this.customNpc[group][property];
    return typeof propValue === 'number' ? [propValue] : propValue;
  }

  getTranslatedValue(group, property) {
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
