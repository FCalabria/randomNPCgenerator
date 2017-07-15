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
  constructor(public translate: TranslateService) {
  }

  /**
   * getCardItems
   */
  getCardItems(cardName: string) {
    return Object.keys(this.customNpc[cardName]);
  }

  setRandomNpc() {
    this.customNpc = new NPC();
  }

  getPropertyArray(group, property): number[] {
    const propValue: number[] | number = this.customNpc[group][property];
    return typeof propValue === 'number' ? [propValue] : propValue;
  }

  getTranslatedValue(group, property) {
    return this.getPropertyArray(group, property)
      .map(number => this.translate.instant(`props.${property}.${number}`))
      .reduce((prev, current) => !prev ? current : `${prev}, ${current.toLowerCase()}`);
  }

}
