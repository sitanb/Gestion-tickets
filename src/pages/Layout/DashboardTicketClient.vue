<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <div style="padding-left:80px">
        <a href="/AcceuilClient">
          <i
            style="color:blue;font-size: 18px !important"
            class="fas fa-home   "
          ></i>
        </a>

        <a href="#" @click="deconnexion">
          <i
            style="color:red;font-size: 18px !important"
            class="fas fa-sign-out-alt"
          ></i>
        </a>
      </div>
      <sidebar-link to="/StatsReclamation">
        <md-icon>dashboard</md-icon>
        <p>Mes réclamations</p>
      </sidebar-link>

      <sidebar-link
        :to="'/CommentaireClient' + '?' + tick.idTicket"
        v-for="tick in tickets"
        :key="tick.objet"
      >
        <div @click="afficherCommentaires(tick)" style="width:400px">
          <md-icon>content_paste</md-icon>
          <p>{{ tick.objetTicket }}</p>
        </div>
      </sidebar-link>
      <br />
      <br />
      <br />
      <br />
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
import axios from "axios";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    FixedPlugin
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
      tickets: []
    };
  },

  created() {
    axios.get("http://localhost:8083/tickets").then(Response => {
      Response.data.forEach(element => {
        if (
          this.$session.get("prodId") == element.codePro &&
          element.raisonSoc == this.$session.get("raisonSocPro")
        ) {
          this.tickets.push(element);
        }
      });
    });
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
  },
  methods: {
    afficherCommentaires(item) {
      this.$session.start();
      this.$session.set("objetTicket", item.objetTicket);
      this.$session.set("idTicket", item.idTicket);
      this.$session.set("tickEdit", item);
    },

    deconnexion() {
      this.$session.destroy();
      location.replace("/Connexion");
    }
  }
};
</script>
