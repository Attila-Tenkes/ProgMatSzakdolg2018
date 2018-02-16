import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
require("modules/jquery-ui-dist/jquery-ui.min.css");
if (process.env.ENV === 'production') {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
