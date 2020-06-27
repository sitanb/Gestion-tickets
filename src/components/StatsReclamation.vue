<template>
  <div class="content">
    <center><h2>QUALITÉ</h2></center>
    <hr />
    <br /><br />
    <md-card class="md-card-profile " style="width:350px">
      <div class="md-card-avatar rotate">
        <img class="img" :src="cardUserImage1" />
      </div>

      <md-card-content>
        <h4 class="card-title">Agile Developpement</h4>
        <p class="card-description">
          Satisfaction client en priorité <br />
          Accueillir les demandes de changement <br />
          Livraison des versions opérationnelles <br />
          Coopération entre le client etl’équipe <br />
          Avancement à un rythme soutenable
        </p>
      </md-card-content>
    </md-card>

    <md-card class="md-card-profile" style="width:350px;margin-left:70px">
      <div class="md-card-avatar rotate">
        <img class="img" :src="cardUserImage2" />
      </div>

      <md-card-content>
        <h4 class="card-title">Multi Plateforme</h4>
        <p class="card-description">
          Respensive web/app <br />
          Native mobile app <br />
          Native Desktop Application <br />
          Restful <br />
          Intégration des Système Hétérogène <br />
        </p>
      </md-card-content>
    </md-card>

    <md-card class="md-card-profile" style="width:350px;margin-left:70px">
      <div class="md-card-avatar rotate">
        <img class="img" :src="cardUserImage3" />
      </div>

      <md-card-content>
        <h4 class="card-title">Devops Automatisation</h4>
        <p class="card-description">
          Intégration continue <br />
          Gestion de la configuration <br />
          Déploiement en continu <br />
          Livraison en continue <br />
          Apprentissage en continu <br />
        </p>
      </md-card-content>
    </md-card>
    <br /><br />

    <center><h2>NOS CARACTÉRISTIQUES PRINCIPALES</h2></center>
    <hr />
    <br /><br />
    <md-card class="md-card-profile " style="width:350px">
      <div class="md-card-avatar rotate">
        <img class="img" :src="cardUserImage4" />
      </div>

      <md-card-content>
        <h4 class="card-title">LE CONSEIL</h4>
        <p class="card-description">
          Conseil en organisation <br />
          Conseil en processus métier <br />
          Conseil en conduite du changement <br />
          Conseil technique et R&D externalisé<br />
          <br />
          <br />
        </p>
      </md-card-content>
    </md-card>

    <md-card class="md-card-profile " style="width:350px;margin-left:70px">
      <div class="md-card-avatar rotate">
        <img class="img" :src="cardUserImage5" />
      </div>

      <md-card-content>
        <h4 class="card-title">L'INTÉGRATION DE SYSTÈMES</h4>
        <p class="card-description">
          Architecture des systèmes d’informations (conception, choix
          techniques…) <br />
          Développement d’applications/ingénierie logicielle <br />
          Mise en place de PGI/ERP
        </p>
      </md-card-content>
    </md-card>

    <md-card class="md-card-profile" style="width:350px;margin-left:70px">
      <div class="md-card-avatar rotate">
        <img class="img" :src="cardUserImage6" />
      </div>

      <md-card-content>
        <h4 class="card-title">L'INFOGÉRANCE</h4>
        <p class="card-description">
          Externalisation et Outsourcing <br />
          Tierce maintenance applicative (TMA) <br />
          Tierce recette applicative (TRA) et testing <br />
          Formation, assistance aux utilisateurs <br />
          <br />
          <br />
        </p>
      </md-card-content>
    </md-card>
  </div>
</template>
<script>
export default {
  name: "user-card",
  props: {
    cardUserImage1: {
      type: String,
      default: require("../assets/AgileDeveloppement.jpg")
    },
    cardUserImage2: {
      type: String,
      default: require("../assets/Multiplateform.jpg")
    },
    cardUserImage3: {
      type: String,
      default: require("../assets/Devops.jpg")
    },
    cardUserImage4: {
      type: String,
      default: require("../assets/organi.jpg")
    },
    cardUserImage5: {
      type: String,
      default: require("../assets/balise.jpg")
    },
    cardUserImage6: {
      type: String,
      default: require("../assets/check.png")
    }
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>
<style>
.rotate {
  animation-name: cf3FadeInOut;
  -webkit-animation: swing 1s ease;
  animation: swing 1s ease;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: infinite;
  animation-duration: 3s;
}
</style>
