import { Component,ViewChild, ElementRef } from '@angular/core';
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('themeSettingsPopover') themeSettingsPopover!: ElementRef;

  constructor() {}
  
  handleThemeChange(event:any) {
		setTheme(event.detail.selectedItems[0].getAttribute('data-theme'));
		this.themeSettingsPopover.nativeElement.close();
	}
}
