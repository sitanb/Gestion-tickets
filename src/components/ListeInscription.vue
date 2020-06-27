<template>
  <div class="content">
    <v-app>
      <!-- Pour modification nomutil-->
      <a @click="fermer">
        <div v-if="this.$session.get('edit') == 1">
          <v-alert v-model="alert" dismissible dense text type="success">
            L'email de confirmation a été <strong>envoyé </strong> avec
            <strong> succès </strong>!
          </v-alert>
        </div>
      </a>
      <!-- Pour annulation inscription-->
      <a @click="fermer">
        <div v-if="this.$session.get('delete') == 1">
          <v-alert v-model="alert" dismissible dense text type="success">
            L'inscription a été <strong>annulée </strong> avec
            <strong> succès </strong>!
          </v-alert>
        </div>
      </a>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="inscriptions"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        @page-count="pageCount = $event"
        sort-by="nomUtil"
        class="elevation-4"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="color:#33b5e5"
              >Inscriptions</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Rechercher"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:item.etat="{ item }">
          <div v-if="item.etat == 'non confirmée'" style="color:red">
            {{ item.etat }}
          </div>
          <div v-else style="color:#4caf50">{{ item.etat }}</div>
        </template>
        <template v-slot:item.dateInsc="{ item }">
          {{ item.dateInsc.toString().split("T")[0] }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.etat == 'non confirmée'"
            @click="confirmer(item)"
            id="boutton"
            tile
            outlined
            color="#4caf50"
            ><v-icon left>mdi-check-circle</v-icon> Confirmer</v-btn
          >
          <v-btn
            v-else
            @click="supp(item)"
            id="boutton"
            tile
            outlined
            color="red"
            ><v-icon left>mdi-close-circle</v-icon> Annuler</v-btn
          >
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" circle :length="pageCount"></v-pagination>
      </div>

      <v-row justify="center">
        <v-dialog v-model="dialogDelete" max-width="400">
          <v-card>
            <v-card-title class="headline" style="color:red"
              >Annulation
            </v-card-title>

            <v-card-text>
              Cette action est irrevocable ! <br />
              Etes-vous sûr de bien vouloir annulé cette inscription ?
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red" text @click="dialogDelete = false">
                Quitter
              </v-btn>

              <v-btn color="green darken-1" text @click="annuler(eltSupp)">
                Oui, annulé
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-app>
  </div>
</template>

<script src="./assets/smtp.js"></script>
<script>
import axios from "axios";
export default {
  data: () => ({
    eltSupp: "",
    dialogDelete: false,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    search: "",
    inscriptions: [],
    alert: true,
    headers: [
      {
        text: "Nom d'utilisateur",
        align: "center",
        value: "nomUtil"
      },
      {
        align: "center",
        text: "Nom",
        value: "nom"
      },
      {
        align: "center",
        text: "Prénom",
        value: "prenom"
      },
      {
        align: "center",
        text: "Email",
        value: "email"
      },
      {
        align: "center",
        text: "Téléphone",
        value: "telephone"
      },

      {
        align: "center",
        text: "Société",
        value: "societe"
      },
      {
        align: "center",
        text: "Date inscription",
        value: "dateInsc"
      },
      {
        align: "center",
        text: "Etat",
        value: "etat"
      },

      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ]
  }),

  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
    this.$loadScript("http://smtpjs.com/v3/smtp.js");
  },
  created() {
    axios.get("http://localhost:8083/inscriptions").then(res => {
      this.inscriptions = res.data;
    });
  },

  methods: {
    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },
    fermer() {
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },
    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    },
    annuler(item) {
      axios.delete("http://localhost:8083/userCompte/" + item.nomUtil),
        axios
          .put("http://localhost:8083/inscription/" + item.nomUtil, {
            etat: "non confirmée",
            nomUtil: item.nomUtil,
            email: item.email,
            nom: item.nom,
            prenom: item.prenom,
            telephone: item.telephone,
            societe: item.societe,
            dateInsc: item.dateInsc
          })
          .then(Response => {
            this.$session.start();
            this.$session.set("delete", 1);
            location.reload();
          });
    },
    confirmer(item) {
      var n = item.nom;
      var pre = item.prenom;
      var generator = require("generate-password");
      var password = generator.generate({
        length: 10,
        numbers: true
      });
      var corps =
        "Bonjour Mme, Mr " +
        n +
        " " +
        pre +
        " Nom d'utilisateur : " +
        item.nomUtil +
        " Mot de passe : " +
        password +
        " For Right Solutions Sfax Beb Bhar , Imm. BORJ KHALIFA B 404 – 3000 , Sfax Tél : 74 221 544 | Mobile : 52 591 855 +216 74 221 544 E-mail : contact@frsdev.com";
      const postData = {
        nomUtil: item.nomUtil,
        email: item.email,
        nom: item.nom,
        prenom: item.prenom,
        telephone: item.telephone,
        societe: item.societe,
        etat: "confirmée",
        dateInsc: item.dateInsc
      };
      var mail = item.email;
      axios
        .post(
          "http://localhost:8083/mail/" +
            mail +
            "/" +
            "frsdev2011@gmail.com" +
            "/" +
            "Votre inscription est à present confirmée" +
            "/" +
            corps
        )
        .then(() => {
          axios.post("http://localhost:8083/userCompte", {
            nomUtil: item.nomUtil,
            motpass: password,
            raisonSoc: item.societe
          }),
            axios
              .put(
                "http://localhost:8083/inscription/" + item.nomUtil,
                postData
              )
              .then(Response => {
                this.$session.start();
                this.$session.set("edit", 1);
                location.reload();
              });
        });
      /* this.$loadScript("https://smtpjs.com/v3/smtp.js")
        .then(() => {
          // Script was unloaded successfully
          var mail = item.email;
          Email.send({
            Host: "smtp.gmail.com",
            Username: "frsdev2011@gmail.com",
            Password: "Frs.dev2011app",
            To: mail,
            From: "frsdev2011@gmail.com",
            Subject: "Votre inscription est à present confirmée",
            Body: corps
          }).then(
            axios.post("http://localhost:8083/userCompte", {
              nomUtil: item.nomUtil,
              motpass: password,
              raisonSoc: item.societe
            }),
            axios
              .put(
                "http://localhost:8083/inscription/" + item.nomUtil,
                postData
              )
              .then(Response => {
                this.$session.start();
                this.$session.set("edit", 1);
                location.reload();
              })
          );
        })
        .catch(t => {
          console.log(t);
          // Script couldn't be found to unload; make sure it was loaded and that you passed the same URL
        }); */
    }
  }
};
</script>
