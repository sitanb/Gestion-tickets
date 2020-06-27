<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <sidebar-link to="/AccueilChefPers">
        <md-icon>dashboard</md-icon>
        <p>Accueil Chef personnel</p>
      </sidebar-link>
      <sidebar-link to="/ListeEquipeMain">
        <i style="color:white" class="fas fa-users-cog"></i>
        <p>Equipes de maintenance</p>
      </sidebar-link>

      <sidebar-link to="/ListeAssistants">
        <i style="color:white" class="fas fa-wrench"></i>
        <p>Assistants techniques</p>
      </sidebar-link>
      <sidebar-link to="/ListeEquipeDev">
        <i style="color:white" class="fas fa-compact-disc"></i>
        <p>Equipes de développement</p>
      </sidebar-link>
      <sidebar-link to="/ListeDeveloppeurs">
        <md-icon>person</md-icon>
        <p>Développeurs</p>
      </sidebar-link>
      <sidebar-link to="/AffecterProjets">
        <md-icon>book</md-icon>
        <p>Réclamations</p>
      </sidebar-link>
      <sidebar-link to="/ListeLangageDev">
        <md-icon>settings</md-icon>
        <p>Langages développements</p>
      </sidebar-link>
      <sidebar-link to="/ListeProjets">
        <md-icon>edit</md-icon>
        <p>Projets</p>
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
