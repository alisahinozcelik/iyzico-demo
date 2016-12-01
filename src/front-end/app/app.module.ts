import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdIconRegistry } from '@angular/material';

import { SERVICES } from './.services';
import { DIRECTIVES } from './.directives';
import { PIPES } from './.pipes';

import { AppRouter, EMPTY_COMPONENTS } from './app.router';

import { AppComponent } from './app.component';
import { DASHBOARD_COMPONENTS } from './dashboard';
import { SidebarComponent } from './sidebar';
import { BarChartComponent } from './bar-chart';

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		AppRouter,
		MaterialModule.forRoot()
	],
	providers: [...SERVICES],
	declarations: [AppComponent, ...DASHBOARD_COMPONENTS, SidebarComponent, BarChartComponent, ...DIRECTIVES, ...PIPES, ...EMPTY_COMPONENTS],
	bootstrap: [AppComponent],
	exports: []
})
export class AppModule {
	constructor(icon: MdIconRegistry) {
		icon.registerFontClassAlias('fa', 'fa');
	}
}