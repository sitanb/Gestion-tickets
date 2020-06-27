<template>
  <div class="content">
    <v-app>
      <div>
        <div>
          <!-- Pour modification -->
          <a @click="fermer">
            <div v-if="this.$session.get('edit') == 1">
              <v-alert v-model="alert" dismissible dense text type="success">
                Le compte rendu a été <strong>modifié </strong> avec
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
            :headers="headers"
            :search="search"
            :items="compteRendus"
            sort-by="idCompteRendu"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-4"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title style="color:#33b5e5"
                  >Comptes rendu</v-toolbar-title
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
                <v-dialog v-model="dialog" max-width="600px">
                  <v-card>
                    <v-card-text>
                      <v-form ref="form">
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="editedItem.objetCompteRendu"
                                label="ObjetCompteRendu *"
                                :rules="[rules.required, rules.text]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="editedItem.auteur"
                                label="Auteur *"
                                :rules="[rules.required, rules.lastName]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-textarea
                                v-model="editedItem.libelle"
                                label="Libelle *"
                                :rules="[rules.required]"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                      <i style="color:red"
                        >Les champs avec * sont obligatoires</i
                      >
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" text @click="dialog = false"
                        >Annuler</v-btn
                      >
                      <v-btn color="success" text @click="Modifier"
                        >Enregistrer</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>

            <template v-slot:item.date="{ item }">
              {{ item.date.toString().split("T")[0] }}
            </template>

            <template v-slot:item.actions="{ item }">
              <table>
                <tr>
                  <td style="width:160px">
                    <v-btn
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
      </div>
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
    dialogDelete: false,
    eltSupp: [],
    rules: {
      name: value =>
        /[A-Z][a-z]{2,30}/.test(value) | !value ||
        "Ce champ n'accepte que des lettres. Exemple: Bamba",
      lastName: value =>
        /[A-Z][a-z]{2,30}([ ][A-Z][a-z]{2,30})*/.test(value) | !value ||
        "Ce champ n'accepte que des lettres. Exemple: Sitan | Sitan Idrissa",
      text: value =>
        /[a-zA-Z0-9 ]{0,}[a-zA-Z]{2}[ -_.]?[ a-zA-Z0-9]+/.test(value) |
          !value || "Ce champ n'accepte que des noms significatifs.",
      required: value => !!value || "ce champ est obligatoire.",
      min: v => v.length > 12 || "Minimum 13 caractères",
      max: v => v.length < 14 || "Maximum 13 caractères",
      Email: v => /.+@.+\..+/.test(v) | v || "Email doit être valide."
    },
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    datedebut: null,
    ancienCodeProjet: "",
    alert: true,
    dialog: false,
    dialogAlertEdit: false,
    dialogAlertAdd: false,
    search: "",
    items: [],
    headers: [
      {
        text: "id",
        align: "center",
        value: "idCompteRendu"
      },
      {
        align: "center",
        text: "Auteur",
        value: "auteur"
      },
      {
        align: "center",
        text: "Objet",
        value: "objetCompteRendu"
      },
      {
        align: "center",
        text: "Libelle",
        value: "libelle"
      },
      {
        align: "center",
        text: "Date",
        value: "date"
      },
      {
        align: "center",
        text: "Projet",
        value: "codeProjet"
      },

      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    compteRendus: [],
    editedIndex: -1,
    editedItem: {
      objetCompteRendu: "",
      libelle: "",
      auteur: ""
    },
    ancienCompteRendu: [],
    defaultItem: {
      objetCompteRendu: "",
      libelle: "",
      auteur: ""
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
    Modifier() {
      this.ancienCompteRendu.objetCompteRendu = this.editedItem.objetCompteRendu;
      this.ancienCompteRendu.libelle = this.editedItem.libelle;
      this.ancienCompteRendu.auteur = this.editedItem.auteur;
      axios.put(
        "http://localhost:8083/compteRendu/" +
          this.ancienCompteRendu.idCompteRendu,
        this.ancienCompteRendu
      );
      this.$session.start();
      this.$session.set("edit", 1);
      location.reload();
    },

    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    editItem(item) {
      this.ancienCompteRendu = item;
      this.editedIndex = this.compteRendus.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.compteRendus.indexOf(item);
      this.dialogDelete = false;

      axios
        .delete("http://localhost:8083/compteRendu/" + item.idCompteRendu)
        .then(Response => {
          console.log(Response);
        });
      this.compteRendus.splice(index, 1);
      this.resultatDelete = 1;
      this.$session.start();
      this.$session.set("delete", 1);
      location.reload();
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/

    axios.get("http://localhost:8083/projets").then(res => {
      axios.get("http://localhost:8083/compteRendus").then(cpt => {
        res.data.forEach(element => {
          if (element.idAss == this.$session.get("idAssCnx")) {
            cpt.data.forEach(crendu => {
              if (element.codeProjet == crendu.codeProjet) {
                this.compteRendus.push(crendu);
              }
            });
          }
        });
        axios.get("http://localhost:8083/equipeMaintenances").then(eq => {
          eq.data.forEach(el => {
            res.data.forEach(element => {
              if (
                el.code == element.code &&
                el.chef == this.$session.get("idAssCnx")
              ) {
                cpt.data.forEach(crendu => {
                  if (element.codeProjet == crendu.codeProjet) {
                    this.compteRendus.push(crendu);
                  }
                });
              }
            });
          });
        });
      });
    });
  },
  created() {}
};
</script>

<style>
#boutton {
  height: 27px;
}
</style>
