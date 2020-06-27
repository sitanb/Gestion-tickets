<template>
  <v-app-bar color="white" fixed class="shad">
    <v-slide-x-transition>
      <v-img
        :src="require('@/assets/FRS.png')"
        class="shrink"
        contain
        width="250"
        height="250"
      />
    </v-slide-x-transition>
    <v-spacer />

    <social-media />

    <base-btn class="ml-3" large href="/Connexion">
      Se connecter

      <v-icon right small>
        mdi-login
      </v-icon>
    </base-btn>
    <base-btn class="ml-3" large href="/Enregistrement">
      S'inscrire

      <v-icon right small>
        mdi-open-in-new
      </v-icon>
    </base-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "CoreAppBar",

  components: {
    SocialMedia: () => import("@/components/SocialMedia"),
    baseBtn: () => import("@/components/base/Btn")
  },

  data: () => ({}),

  methods: {}
};
</script>
<style>
.shad {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
