<template>
  <div class="content">
    <v-app id="inspire">
      <div>
        <!-- Pour ajout -->
        <a @click="fermer">
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              La société a été <strong>ajoutée </strong> avec
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
          :items="societes"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          sort-by="raisonSoc"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5">Sociétés</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Rechercher"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="600px" persistent>
                <template v-slot:activator="{ on }">
                  <v-btn
                    style="margin-left:10px"
                    dark
                    class="mb-2"
                    v-on="on"
                    tile
                    outlined
                    color="#33b5e5"
                    ><v-icon left>mdi-plus</v-icon> Nouvelle société</v-btn
                  >
                </template>

                <v-card>
                  <v-card-text>
                    <v-form ref="form">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.raisonSoc"
                              :disabled="cacher"
                              label="Raison sociale *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.nomRes"
                              label="Responsable *"
                              :rules="[rules.required, rules.lastName]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.emailSoc"
                              label="Email *"
                              :rules="[rules.required, rules.Email]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.telephoneSoc"
                              type="number"
                              label="Téléphone *"
                              :rules="[rules.required, rules.min, rules.max]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.adresseSoc"
                              label="Adresse *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
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
          <template v-slot:item.actions="{ item }">
            <v-btn
              @click="editItem(item)"
              id="boutton"
              tile
              outlined
              color="#4caf50"
              ><v-icon left>mdi-pencil</v-icon> Modifier</v-btn
            >
            <v-btn
              @click="supp(item)"
              id="boutton"
              style="margin-left:20px"
              tile
              outlined
              color="red"
              ><v-icon left>mdi-delete</v-icon> Supprimer</v-btn
            >
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
        <v-dialog v-model="dialogAlertAdd1" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              La raison sociale existe déjà, veuillez choisir une autre raison
              sociale !</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertAdd1 = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialogAlertAdd2" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              L'email saisi appartient déjà à une société veuillez choisir un
              autre email !</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertAdd2 = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialogAlertAdd3" max-width="1250">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Le numéro de téléphone saisi appartient déjà à une société
              veuillez choisir un autre numéro de téléphone !</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertAdd3 = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <!--dialog alert-->

      <v-row justify="center">
        <v-dialog v-model="dialogAlertEdit1" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification,veuillez ne pas modifer la raison sociale
              !</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertEdit1 = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogAlertEdit2" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification,l'émail appartient à une autre
              société!</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertEdit2 = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialogAlertEdit3" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification,ce numéro de téléphone appartient déjà à une
              autre société !</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogAlertEdit3 = false"
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
      min: v =>
        v.length > 12 ||
        "le numéro de téléphone doit avoir une longueur minimum de 13 chiffres",
      max: v => v.length < 14 || "Maximum 13 caractères",
      Email: v => /.+@.+\..+/.test(v) | v || "Email doit être valide."
    },
    resultatAdd: 3,
    dialogDelete: false,
    eltSupp: [],
    resultatEdit: 3,
    resultatDelete: 3,
    bE: false,
    bT: false,
    cacher: false,
    ancienneRaisSoc: "",
    dialogAlertAdd1: false,
    dialogAlertAdd2: false,
    dialogAlertAdd3: false,
    dialogAlertEdit1: false,
    dialogAlertEdit2: false,
    dialogAlertEdit3: false,
    alert: true,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Raison sociale",
        align: "center",
        value: "raisonSoc"
      },
      {
        align: "center",
        text: "Responsable",
        value: "nomRes"
      },
      {
        align: "center",
        text: "Email",
        value: "emailSoc"
      },
      {
        align: "center",
        text: "Téléphone",
        value: "telephoneSoc"
      },
      {
        align: "center",
        text: "Adresse",
        value: "adresseSoc"
      },
      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    societes: [],
    editedIndex: -1,
    editedItem: {
      raisonSoc: "",
      nomRes: "",
      emailSoc: "",
      telephoneSoc: "",
      adresseSoc: ""
    },
    defaultItem: {
      raisonSoc: "",
      nomRes: "",
      emailSoc: "",
      telephoneSoc: "",
      adresseSoc: ""
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
      this.ancienneRaisSoc = item.raisonSoc;
      this.editedIndex = this.societes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    deleteItem(item) {
      const index = this.societes.indexOf(item);
      this.dialogDelete = false;
      var existe = false;
      axios.get("http://localhost:8083/ligneProduits").then(lig => {
        axios.get("http://localhost:8083/tickets").then(tick => {
          lig.data.forEach(element => {
            if (element.raisonSoc == item.raisonSoc) {
              existe = true;
            }
          });
          tick.data.forEach(element => {
            if (element.raisonSoc == item.raisonSoc) {
              existe = true;
            }
          });
          if (existe == false) {
            axios
              .delete("http://localhost:8083/societe/" + item.raisonSoc)
              .then(Response => {
                console.log(Response);
              });
            this.societes.splice(index, 1);
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
      location.reload();
    },

    save() {
      if (this.editedIndex > -1) {
        this.bE = false;
        this.bT = false;
        if (this.ancienneRaisSoc == this.editedItem.raisonSoc) {
          axios.get("http://localhost:8083/societes").then(res => {
            res.data.forEach(element => {
              if (
                this.editedItem.emailSoc == element.emailSoc &&
                this.editedItem.raisonSoc != element.raisonSoc
              ) {
                (this.bE = true), (this.dialogAlertEdit2 = true);
              }

              if (
                this.editedItem.telephoneSoc == element.telephoneSoc &&
                this.editedItem.raisonSoc != element.raisonSoc
              ) {
                (this.bT = true), (this.dialogAlertEdit3 = true);
              }

              if (this.bE != true && this.bT != true) {
                if (this.$refs.form.validate()) {
                  const postData = {
                    raisonSoc: this.editedItem.raisonSoc,
                    nomRes: this.editedItem.nomRes,
                    emailSoc: this.editedItem.emailSoc,
                    telephoneSoc: this.editedItem.telephoneSoc,
                    adresseSoc: this.editedItem.adresseSoc
                  };
                  axios
                    .put(
                      "http://localhost:8083/societe/" +
                        this.editedItem.raisonSoc,
                      postData
                    )
                    .then(Response => {
                      if (Response.data.raisonSoc != null) {
                        Object.assign(
                          this.societes[this.editedIndex],
                          this.editedItem
                        );
                        this.resultatEdit = 1;
                        this.$session.start();
                        this.$session.set("edit", 1);
                        location.reload();
                        this.close();
                      } else {
                        this.dialogAlertEdit1 = true;
                      }
                    });
                }
              }
            });
          });
        } else {
          this.dialogAlertEdit1 = true;
        }
      } else {
        this.bE = false;

        this.bT = false;
        axios.get("http://localhost:8083/societes").then(res => {
          res.data.forEach(element => {
            if (this.editedItem.raisonSoc == element.raisonSoc) {
              this.dialogAlertAdd1 = true;
            }
            if (this.editedItem.emailSoc == element.emailSoc) {
              (this.bE = true), (this.dialogAlertAdd2 = true);
            }

            if (this.editedItem.telephoneSoc == element.telephoneSoc) {
              (this.bT = true), (this.dialogAlertAdd3 = true);
            }
          });

          if (this.bE != true) {
            if (this.bT != true) {
              if (this.$refs.form.validate()) {
                const postData = {
                  raisonSoc: this.editedItem.raisonSoc,
                  nomRes: this.editedItem.nomRes,
                  emailSoc: this.editedItem.emailSoc,
                  telephoneSoc: this.editedItem.telephoneSoc,
                  adresseSoc: this.editedItem.adresseSoc
                };

                axios
                  .post("http://localhost:8083/societe", postData)
                  .then(Response => {
                    if (Response.data.raisonSoc != null) {
                      this.resultatAdd = 1;
                      this.societes.push(this.editedItem);
                      (this.raisonSoc = ""),
                        (this.nomRes = ""),
                        (this.emailSoc = ""),
                        (this.telephoneSoc = ""),
                        (this.adresseSoc = "");
                      this.$session.start();
                      this.$session.set("add", 1);
                      location.reload();
                    } else {
                      this.dialogAlertAdd1 = true;
                    }
                  });
              }
            }
          }
        });
      }

      //location.reload()
    }
  },

  created() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
    axios.get("http://localhost:8083/societes").then(res => {
      this.societes = res.data;
    });
  }
};
</script>

<style>
#boutton {
  height: 27px;
}
</style>
