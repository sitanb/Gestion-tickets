<template>
  <section id="welcome" style="padding-top:63px">
    <v-row no-gutters>
      <v-col class="hidden-sm-and-down" md="6">
        <v-img :src="require('@/assets/welcome.png')" height="110vh" />
      </v-col>
      <v-col class="align-content-space-between layout wrap" cols="12" md="6">
        <base-bubble-1 style="transform: rotate(180deg) translateY(25%)" />
        <v-row align="center" justify="center">
          <v-col cols="10" md="10" style="padding-left:45px">
            <h1>
              Bienvenue au service client de For Right Solutions !
            </h1>
          </v-col>
          <v-col cols="10" md="10">
            <base-text>
              Du support technique au service client complet, nous nous soucions
              de vos besoins professionnels et individuels. <br />
              Nous sommes à votre disposition à tout moment et où que vous
              soyez. <br />
              Découvrez notre site web et services digitaux vous permettant
              d'être plus autonome au quotidien!
            </base-text>
          </v-col>
        </v-row>

        <base-bubble-2
          style="transform: rotate(180deg) translate(-200px, -15%)"
        />
      </v-col>
    </v-row>
  </section>
</template>
<script>
export default {
  components: {
    baseBubble1: () => import("@/components/base/Bubble1"),
    baseBubble2: () => import("@/components/base/Bubble2"),
    baseText: () => import("@/components/base/Text")
  }
};
</script>
