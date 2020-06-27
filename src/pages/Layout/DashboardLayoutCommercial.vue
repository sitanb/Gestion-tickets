<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <sidebar-link to="/AccueilCommercial">
        <md-icon>dashboard</md-icon>
        <p>Accueil Commercial</p>
      </sidebar-link>
      <sidebar-link to="/ListeProduits">
        <i style="color:whitesmoke" class="fab fa-microsoft"></i>
        <p>produits</p>
      </sidebar-link>

      <sidebar-link to="/ListeSocietes">
        <i style="color:whitesmoke" class="fa fa-home"></i>
        <p>sociétés</p>
      </sidebar-link>

      <sidebar-link to="/LigneProduits">
        <md-icon>content_paste</md-icon>
        <p>Lignes produits</p>
      </sidebar-link>

      <a href="#" style="margin-left:36px;margin-top:20px">
        <sidebar @click="deconnexion">
          <i style="color:whitesmoke" class="fas fa-sign-out-alt"></i>
          <p style="color:white">Déconnexion</p>
        </sidebar>
      </a>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <fixed-plugin
        :color.sync="sidebarBackground"
        :image.sync="sidebarBackgroundImage"
      >
      </fixed-plugin>

      <dashboard-content> </dashboard-content>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import FixedPlugin from "./Extra/FixedPlugin.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    FixedPlugin
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg")
    };
  },
  methods: {
    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    }
  }
};
</script>
