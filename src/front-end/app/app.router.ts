import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard';
import { AppsComponent } from './apps';
import { ComponentsComponent } from './components';
import { DocumentComponent } from './document';
import { EmailComponent } from './email';
import { SettingsComponent } from './settings';

export const EMPTY_COMPONENTS = [
	AppsComponent,
	ComponentsComponent,
	DocumentComponent,
	EmailComponent,
	SettingsComponent
];

@NgModule({
	imports: [
		RouterModule.forRoot([
			{path: '', redirectTo: '/dashboard', pathMatch: 'full'},
			{path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'}},
			{path: 'apps', component: AppsComponent, data: {title: 'Apps'}},
			{path: 'components', component: ComponentsComponent, data: {title: 'Components'}},
			{path: 'document', component: DocumentComponent, data: {title: 'Document'}},
			{path: 'email', component: EmailComponent, data: {title: 'Email'}},
			{path: 'settings', component: SettingsComponent, data: {title: 'Settings'}},
		], {useHash: false})
	],
	exports: [RouterModule]
})
export class AppRouter {}