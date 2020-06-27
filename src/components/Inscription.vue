<template>
  <v-app>
    <core-app-bar />

    <core-view />

    <!-- Footer -->
    <footer
      class="page-footer font-small mdb-color pt-4"
      style="background-color:rgba(69, 82, 110, 0.44)"
    >
      <!-- Footer Links -->
      <div class="container text-center text-md-left">
        <!-- Footer links -->
        <div class="row text-center text-md-left mt-3 pb-3">
          <!-- Grid column -->
          <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 class="text-uppercase mb-4 font-weight-bold">
              © For Right Solutions 2019
            </h6>
            <p>
              Fondée en 2011, For Right Solutions « FRS » est une Société de
              Services et d’Ingénierie Informatique qui évolue dans les domaines
              de développement de solutions de gestion d’entreprises. FRS
              propose aux entreprises des solutions couvrant l’ensemble de leurs
              besoins fonctionnels. Sa devise est la qualité de service et la
              satisfaction de ses clients en privilégiant une relation de
              confiance, de complémentarité et de durabilité avec eux.
            </p>
          </div>
          <!-- Grid column -->

          <hr class="w-100 clearfix d-md-none" />

          <!-- Grid column -->
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 class="text-uppercase mb-4 font-weight-bold">LOGICIELS</h6>
            <p>
              SUPERCOUPE
            </p>
            <p>
              SUPERCAD 3D
            </p>
            <p>
              OPTIMA PRINT
            </p>
            <p>
              CADENCE
            </p>
          </div>
          <!-- Grid column -->

          <hr class="w-100 clearfix d-md-none" />

          <!-- Grid column -->
          <hr class="w-100 clearfix d-md-none" />

          <!-- Grid column -->
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 class="text-uppercase mb-4 font-weight-bold">Contact</h6>
            <p>
              <i class="fas fa-home mr-3"></i> Beb Bhar , Imm. BORJ KHALIFA B
              404 – 3000 , Sfax
            </p>
            <p><i class="fas fa-envelope mr-3"></i> contact@frsdev.com</p>
            <p><i class="fas fa-phone mr-3"></i> +216 52 591 855</p>
            <p><i class="fas fa-print mr-3"></i> +216 74 221 544</p>
          </div>
          <!-- Grid column -->
        </div>
        <!-- Footer links -->

        <!-- Grid row -->
        <div class="row d-flex align-items-center"></div>
        <!-- Grid row -->
      </div>
      <!-- Footer Links -->
    </footer>
    <!-- Footer -->
  </v-app>
</template>
<script>
export default {
  components: {
    CoreAppBar: () => import("@/components/core/AppBar"),
    CoreView: () => import("@/components/core/View")
  }
};
</script>
