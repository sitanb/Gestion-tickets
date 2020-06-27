<template>
  <div>
    <a target="_blank" :href="item.name" v-for="(item, i) in items" :key="i">
      <v-btn fab class="ma-2" color="info" :small="!large">
        <v-icon dark v-text="item.icon" />
      </v-btn>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    large: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    items: [
      {
        name: "https://www.facebook.com/frsdev/",
        icon: "mdi-facebook"
      },
      {
        name: "https://www.youtube.com/channel/UCBC0KbZzqKgD_kl1Wz_Frxw",
        icon: "mdi-youtube"
      },
      {
        name: "https://www.linkedin.com/company/for-right-solutions",
        icon: "mdi-linkedin"
      },
      {
        name: "mailto:contact@frsdev.com",
        icon: "mdi-email"
      },
      {
        name: "https://wa.me/21652591855",
        icon: "mdi-whatsapp"
      }
    ]
  })
};
</script>
