<template>
  <div class="content">
    <v-app>
      <div>
        <!-- Pour ajout -->
        <a @click="fermer">
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              Le a été <strong>ajouté </strong> avec <strong> succès </strong>!
            </v-alert>
          </div>
        </a>

        <!-- Pour modification -->
        <a @click="fermer">
          <div v-if="this.$session.get('edit') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              L'élément a été <strong>modifié </strong> avec
              <strong> succès </strong>!
            </v-alert>
          </div>
        </a>

        <!-- Pour suprression -->
        <a @click="fermer">
          <div v-if="this.$session.get('delete') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              L'élément a été <strong>supprimé </strong> avec
              <strong> succès </strong>!
            </v-alert>
          </div>
        </a>

        <v-data-table
          :no-results-text="resSearch"
          :no-data-text="text"
          :headers="headers"
          :search="search"
          :items="Affectations"
          sort-by="idTicket"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5"
                >Réclamations</v-toolbar-title
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
          <template v-slot:item.nomLang="{ item }">
            <v-btn
              @click="afficherLang(item)"
              id="boutton"
              tile
              outlined
              color="#4caf50"
              ><v-icon left>mdi-eye</v-icon> Afficher</v-btn
            >
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="item.existe == false"
              @click="creer(item)"
              id="boutton"
              tile
              outlined
              color="#4caf50"
              ><v-icon left>mdi-pencil</v-icon> créer projet</v-btn
            >
            <v-btn
              v-else
              @click="VoirProjet(item)"
              id="boutton"
              tile
              outlined
              color="#4caf50"
              ><v-icon left>mdi-eye</v-icon> voir projet</v-btn
            >
          </template>
          <template v-slot:item.existe> </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            circle
            :length="pageCount"
          ></v-pagination>
        </div>
      </div>

      <!--dialog alert-->
      <v-row justify="center">
        <v-dialog v-model="dialogAlertVoirProjet" max-width="500">
          <v-card style="text-align:center">
            <v-card-title class="headline" v-model="titre">
              <center>
                Projet : {{ seeProjet.codeProjet }}<br />
                Réclamation : {{ seeProjet.idTicket }}<br />
                Equipe : {{ seeProjet.code }}<br />
                Assistant affecté : {{ seeProjet.idAss }}<br />
                Etat : {{ seeProjet.etatProjet }}<br />
                Date Debut : {{ seeProjet.dateDebutprojet }}<br />
                Date Fin : {{ seeProjet.dateFinProjet }}
              </center>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertVoirProjet = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialogAlert" max-width="500">
          <v-card style="text-align:center">
            <v-card-title class="headline" v-model="titre">
              <center>
                Code : {{ codeLang }}<br />
                Nom : {{ nomLang }}<br />
                Description : {{ descLang }}
              </center>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogAlert = false">
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    rules: [value => !!value || "Ce champ est obligatoire !"],
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    dialogAlertVoirProjet: false,
    alert: true,
    dialog: false,
    dialogAlert: false,
    text: "Un projet a été créé pour tous les tickets !",
    resSearch: "Aucun élément n'a été trouvé !",
    titre: "",
    search: "",
    codeLang: "",
    nomLang: "",
    descLang: "",
    seeProjet: [],
    headers: [
      {
        text: "Réclamation",
        align: "center",
        value: "idTicket"
      },
      {
        align: "center",
        text: "Objet réclamation",
        value: "objetTicket"
      },
      {
        align: "center",
        text: "Produit",
        value: "codePro"
      },
      {
        align: "center",
        text: "Langage développement",
        value: "nomLang"
      },

      { text: "Actions", value: "actions", sortable: false, align: "center" },
      {
        value: "existe"
      }
    ],
    Affectations: [],
    editedIndex: -1,
    editedItem: {
      code: "",
      nom: ""
    },
    defaultItem: {
      code: "",
      nom: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    VoirProjet(item) {
      axios.get("http://localhost:8083/projets").then(projet => {
        projet.data.forEach(element => {
          if (item.idTicket == element.idTicket) {
            this.seeProjet = element;
            this.seeProjet.dateDebutprojet = element.dateDebutprojet
              .toString()
              .split("T")[0];

            if (this.seeProjet.dateFinProjet != null) {
              this.seeProjet.dateFinProjet = element.dateFinProjet
                .toString()
                .split("T")[0];
            }

            if (this.seeProjet.dateFinProjet == null) {
              this.seeProjet.dateFinProjet = "-";
            }
          }
        });
        this.dialogAlertVoirProjet = true;
      });
    },
    afficherLang(item) {
      axios.get("http://localhost:8083/produits").then(prod => {
        prod.data.forEach(element => {
          if (item.codePro == element.codePro) {
            axios.get("http://localhost:8083/langageDevs").then(lang => {
              lang.data.forEach(l => {
                if (l.codeLang == element.langage) {
                  this.codeLang = l.codeLang;
                  this.nomLang = l.nomLang;
                  this.descLang = l.descriptionLang;
                  this.dialogAlert = true;
                }
              });
            });
          }
        });
      });
    },
    fermer() {
      this.$session.set("add", 0);
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },
    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    },
    creer(item) {
      this.$session.start();
      this.$session.set("idTicletProjet", item.idTicket);
      location.replace("/CreerProjet");
    }
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
    var exist = false;

    axios.get("http://localhost:8083/tickets").then(ticket => {
      axios.get("http://localhost:8083/projets").then(projet => {
        ticket.data.forEach(t => {
          exist = false;
          projet.data.forEach(p => {
            if (t.idTicket == p.idTicket) {
              exist = true;
            }
          });
          if (exist == false) {
            t.existe = false;
            this.Affectations.push(t);
          } else {
            t.existe = true;
            this.Affectations.push(t);
          }
        });
      });
    });
  },
  created() {},
  onload() {
    this.$session.start();
    this.$session.set("add", 0);
  }
};
</script>

<style>
#boutton {
  height: 27px;
}
</style>
