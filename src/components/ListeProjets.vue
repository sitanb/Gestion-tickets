<template>
  <div class="content">
    <v-app>
      <div>
        <a @click="fermer">
          <!-- Pour ajout -->
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              Le projet a été <strong>crée </strong> avec
              <strong> succès </strong>!
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
        <a @click="fermer">
          <div v-if="this.$session.get('delete') == 'erreur'">
            <v-alert v-model="alert" dismissible dense text type="error">
              Suppression interdite par contrainte d'intégrité référencielle !
            </v-alert>
          </div>
        </a>

        <v-data-table
          :headers="headers"
          :search="search"
          :items="projets"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          sort-by="codeProjet"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5">Projets</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Rechercher"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="600px">
                <v-card>
                  <v-card-text>
                    <v-form ref="form">
                      <v-container>
                        <div v-if="resultatEdit == 0">
                          <v-alert
                            v-model="alert"
                            dismissible
                            dense
                            text
                            type="error"
                          >
                            Erreur modification,
                            <strong>veuillez ne pas modifer le code </strong>!
                          </v-alert>
                        </div>

                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.codeProjet"
                              :disabled="cacher"
                              label="Code projet *"
                              :rules="rules"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-select
                              v-model="editedItem.code"
                              :rules="[rules.required]"
                              :items="items"
                              label="Equipe Maintenance *"
                            >
                            </v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                    <i style="color:red">Les champs avec * sont obligatoires</i>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="close">Annuler</v-btn>
                    <v-btn color="success" text @click="save"
                      >Enregistrer</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:item.dateDebutprojet="{ item }">
            <div>{{ item.dateDebutprojet.toString().split("T")[0] }}</div>
          </template>
          <template v-slot:item.dateFinProjet="{ item }">
            <div v-if="item.dateFinProjet">
              {{ item.dateFinProjet.toString().split("T")[0] }}
            </div>
            <div v-if="!item.dateFinProjet">-</div>
          </template>
          <template v-slot:item.actions="{ item }">
            <table>
              <tr>
                <td style="width:160px">
                  <v-btn
                    v-if="item.etatProjet == 'en cours'"
                    @click="editItem(item)"
                    id="boutton"
                    tile
                    outlined
                    color="#4caf50"
                    ><v-icon left>mdi-pencil</v-icon> Modifier</v-btn
                  >
                </td>
                <td style="width:160px">
                  <v-btn
                    @click="supp(item)"
                    id="boutton"
                    tile
                    outlined
                    color="red"
                    ><v-icon left>mdi-delete</v-icon> Supprimer</v-btn
                  >
                </td>
              </tr>
            </table>
          </template>
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
        <v-dialog v-model="dialogAlertAdd" max-width="700">
          <v-card style="text-align:center">
            <v-card-title class="headline" v-model="titre" style="color:red">
              Le Code existe déjà, veuillez choisir un autre code
              !</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertAdd = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialogAlertEdit" max-width="700">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red"
              >Erreur modification, veuillez ne pas modifer le code
              !</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertEdit = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialogDelete" max-width="400">
          <v-card>
            <v-card-title class="headline" style="color:red"
              >Suppression
            </v-card-title>

            <v-card-text>
              Cette action est irrevocable ! <br />
              Etes-vous sûr de bien vouloir supprimé cet élément ?
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red" text @click="dialogDelete = false">
                Annuler
              </v-btn>

              <v-btn color="green darken-1" text @click="deleteItem(eltSupp)">
                Oui, supprimé
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
    postData: null,
    rules: [value => !!value || "Ce champ est obligatoire !"],

    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    dialogDelete: false,
    eltSupp: [],
    datedebut: null,
    ancienCodeProjet: "",
    alert: true,
    dialog: false,
    dialogAlertEdit: false,
    dialogAlertAdd: false,
    search: "",
    cacher: false,
    items: [],
    headers: [
      {
        text: "Code",
        align: "center",
        value: "codeProjet"
      },

      {
        align: "center",
        text: "Date Debut Projet",
        value: "dateDebutprojet"
      },
      {
        align: "center",
        text: "Etat Projet",
        value: "etatProjet"
      },
      {
        align: "center",
        text: "Date Fin Projet",
        value: "dateFinProjet"
      },
      {
        align: "center",
        text: "Réclamation",
        value: "idTicket"
      },

      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    projets: [],
    editedIndex: -1,
    editedItem: {
      codeProjet: "",
      descriptionProjet: "",
      dateDebutprojet: "",
      dateFinProjet: ""
    },
    defaultItem: {
      codeProjet: "",
      descriptionProjet: ""
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
    fermer() {
      this.$session.set("add", 0);
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },

    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    },

    editItem(item) {
      this.cacher = true;
      this.ancienCodeProjet = item.codeProjet;
      this.datedebut = item.dateDebutprojet;
      this.editedIndex = this.projets.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    affecter(item) {
      this.$session.start();
      this.$session.set("projet", item.codeProjet);
      location.replace("/AffecterTickets");
    },

    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },
    deleteItem(item) {
      const index = this.projets.indexOf(item);
      this.dialogDelete = false;
      var existe = false;
      axios.get("http://localhost:8083/surAffectations").then(surf => {
        axios.get("http://localhost:8083/compteRendus").then(cpt => {
          surf.data.forEach(element => {
            if (element.codeProjet == item.codeProjet) {
              existe = true;
            }
          });
          cpt.data.forEach(element => {
            if (element.codeProjet == item.codeProjet) {
              existe = true;
            }
          });
          if (existe == false) {
            axios
              .delete("http://localhost:8083/projet/" + item.codeProjet)
              .then(Response => {
                console.log(Response);
              });
            this.projets.splice(index, 1);
            this.resultatDelete = 1;
            this.$session.start();
            this.$session.set("delete", 1);
            location.reload();
          } else {
            this.$session.start();
            this.$session.set("delete", "erreur");
            location.reload();
          }
        });
      });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          if (this.ancienCodeProjet == this.editedItem.codeProjet) {
            this.postData = {
              codeProjet: this.editedItem.codeProjet,
              etatProjet: "en cours",
              dateDebutprojet: this.datedebut
            };

            axios
              .put(
                "http://localhost:8083/projet/" + this.editedItem.codeProjet,
                this.postData
              )
              .then(Response => {
                if (Response.data.codeProjet != null) {
                  Object.assign(
                    this.projets[this.editedIndex],
                    this.editedItem
                  );
                  this.resultatEdit = 1;
                  this.close();
                  this.$session.start();
                  this.$session.set("edit", 1);
                  location.reload();
                } else {
                  this.dialogAlertEdit = true;
                }
              });
          } else {
            this.dialogAlertEdit = true;
          }
        }
      }

      //location.reload()
    }
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
  },
  created() {
    axios.get("http://localhost:8083/projets").then(res => {
      this.projets = res.data;
    });

    axios.get("http://localhost:8083/equipeMaintenances").then(res => {
      res.data.forEach(element => {
        this.items.push(element.code);
      });
    });
  }
};
</script>

<style>
#boutton {
  height: 27px;
}
</style>
