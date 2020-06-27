<template>
  <section id="recent-projects" class="overflow-hidden">
    <v-row no-gutters>
      <v-col
        style="background-color:#D3C3BC"
        class="text-center pa-5 white--text"
        cols="12"
        md="12"
      >
        <base-bubble-1 style="transform: rotate(180deg) translateX(25%)" />

        <base-heading>
          Logiciels
        </base-heading>

        <v-card>
          <v-container>
            <v-carousel
              interval="4000"
              cycle
              hide-delimiter-background
              show-arrows-on-hover
              light="true"
            >
              <v-carousel-item v-for="(item, i) in images" :key="i">
                <v-img :src="item"></v-img>
              </v-carousel-item>
            </v-carousel>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: "RecentProjects",
  components: {
    baseHeading: () => import("@/components/base/Heading")
  },

  data: () => ({
    images: []
  }),
  mounted() {
    axios.get("http://localhost:8083/produits").then(res => {
      res.data.forEach(element => {
        if (element.image != null) {
          this.images.push(element.image);
        }
      });
    });
  }
};
</script>
