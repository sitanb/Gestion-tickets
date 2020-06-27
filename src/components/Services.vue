<template>
  <section id="services" class="overflow-hidden">
    <v-row class="accent" no-gutters>
      <v-col class="hidden-sm-and-down" md="6">
        <v-img :src="require('@/assets/services.png')" height="100%" />
      </v-col>

      <v-col class="text-center pa-5" cols="12" md="6">
        <v-row class="fill-height" align="center" justify="center">
          <v-col cols="12">
            <base-bubble-2 style="transform: translateX(55%)" />
            <base-heading class="info--text">
              Services
            </base-heading>
          </v-col>

          <v-col
            v-for="(service, i) in services"
            :key="i"
            class="text-center mb-3"
            md="6"
          >
            <v-avatar class="elevation-6 mb-2" color="#69A1BB" size="64" tile>
              <v-icon dark size="52" v-text="service.icon" />
            </v-avatar>
            <div class="mb-2" v-text="service.name" />
            <div
              style="text-align:justify;padding-left:35px"
              v-html="service.blurb"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </section>
</template>

<script>
export default {
  name: "Services",
  components: {
    baseHeading: () => import("@/components/base/Heading")
  },

  data: () => ({
    services: [
      {
        name: "RÉGIE DÉLOCALISÉE",
        icon: "mdi-laptop-chromebook",
        blurb:
          "FRS propose la mise à disposition des<br>compétences de ses collaborateurs à<br>distance. Les collaborateurs travaillent en<br>mode remote grâce aux nouveaux moyens<br>de communication. Nous disposons de<br>lignes téléphoniques IP qui permettent un<br>échange rapide à coût presque nul, ainsi<br>que de connexions VPN pour assurer la<br>sécurité de vos données. "
      },
      {
        name: "FORFAIT",
        icon: "mdi-chart-line",
        blurb:
          "Sous-traitez au forfait la réalisation, la<br>migration ou l’évolution de vos projets<br>informatiques. Pour répondre à ces besoins<br>FRS vous propose :<br>Une mobilisation des compétences<br>adéquates garantissant la réussite de votre<br>projet;<br>Migrations technologiques;<br>Développement logiciel;<br>Testing et maintenance."
      },
      {
        name: "CENTRE D'ASSISTANCE",
        icon: "mdi-settings-outline",
        blurb:
          "Nous vous accompagnons jusqu’à la phase<br>de support ,FRS s’engage à offrir à vos<br>clients un service d’assistance nearshore de<br>qualité (Hotline et Helpdesk).<br>Avec les ressources et la plateforme<br>dédiées à ce service, les requêtes client<br>seront traitées dans les délais convenus,<br>tout en assurant la meilleure visibilité<br>durant la résolution."
      }
    ]
  })
};
</script>
