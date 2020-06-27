// =========================================================
// * Vue Material Dashboard - v1.4.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/vue-material-dashboard/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebookSquare,
  faYoutube,
  faLinkedin,
  faUber
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vuetify from "vuetify";
import VueSession from "vue-session";
import LoadScript from "vue-plugin-load-script";
import Chat from "vue-beautiful-chat";
import VueChatScroll from "vue-chat-scroll";
Vue.use(VueChatScroll);
Vue.use(Chat);
Vue.use(LoadScript);
Vue.use(VueSession);
Vue.use(Vuetify);
import VueFusionCharts from "vue-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);

import "vuetify/dist/vuetify.min.css";
import "./AuthClient/vendor/jquery/jquery-3.2.1.min.js";
// Add the specific imported icons
library.add(faFacebookSquare);
library.add(faYoutube);
library.add(faLinkedin, faUber);

// Enable the FontAwesomeIcon component globally
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(VueRouter, BootstrapVue);
Vue.component("icon", Icon);

// configure router
const router = new VueRouter({
  mode: "history",
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          secondary: "#BFADA5",
          accent: "#D8EBF1",
          info: "#5B5C79"
        }
      }
    }
  }),
  data: {
    Chartist: Chartist
  }
});
