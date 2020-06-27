<template>
  <div class="content">
    <v-app id="inspire">
      <div>
        <!-- Pour ajout verifier code -->

        <a @click="fermer">
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              L'assistant technique a été <strong>ajouté </strong> avec
              <strong> succès </strong>!
            </v-alert>
          </div>
        </a>

        <!-- Pour modificationexperienceDev-->
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
          :items="assistants"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          sort-by="idAss"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5"
                >Assistants Techniques</v-toolbar-title
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
              <v-dialog v-model="dialog" max-width="500px" persistent>
                <template v-slot:activator="{ on }">
                  <v-btn
                    style="margin-left:10px"
                    dark
                    class="mb-2"
                    v-on="on"
                    tile
                    outlined
                    color="#33b5e5"
                    ><v-icon left>mdi-plus</v-icon> Nouveau Assistant
                    Technique</v-btn
                  >
                </template>

                <v-card>
                  <v-card-text>
                    <v-form ref="form">
                      <v-container>
                        <div v-if="resultatAdd == 0">
                          <v-alert
                            v-model="alert"
                            dismissible
                            dense
                            text
                            type="error"
                          >
                            Le nom de l'assistant
                            <strong>existe déjà, </strong> veuillez choisir
                            <strong> un autre nom d'assistant </strong>!
                          </v-alert>
                        </div>
                        <!-- Pour ajout verifier emailDev -->
                        <div v-if="resultatAdd == 4">
                          <v-alert
                            v-model="alert"
                            dismissible
                            dense
                            text
                            type="error"
                          >
                            L'email de l'assistant
                            <strong>existe déjà, </strong> veuillez choisir
                            <strong>autre un email d'assistant </strong>!
                          </v-alert>
                        </div>
                        <!-- Pour modification emailDev -->
                        <div v-if="resultatEdit == 4">
                          <v-alert
                            v-model="alert"
                            dismissible
                            dense
                            text
                            type="error"
                          >
                            Erreur modification,
                            <strong
                              >l'email assistant saisi est déjà affecté a un
                              assistant </strong
                            >!
                          </v-alert>
                        </div>

                        <!-- Pour modification emailDev -->
                        <div v-if="resultatEdit == 5">
                          <v-alert
                            v-model="alert"
                            dismissible
                            dense
                            text
                            type="error"
                          >
                            Erreur modification,
                            <strong
                              >le téléphone assistant saisi est déjà affecté a
                              un assistant </strong
                            >!
                          </v-alert>
                        </div>

                        <div v-if="resultatEdit == 0">
                          <v-alert
                            v-model="alert"
                            dismissible
                            dense
                            text
                            type="error"
                          >
                            Erreur modification,
                            <strong
                              >veuillez ne pas modifer le nom d'developpeur </strong
                            >!
                          </v-alert>
                        </div>

                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.nomAss"
                              label="Nom *"
                              :rules="[rules.required, rules.name]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.prenomAss"
                              label="Prenom *"
                              :rules="[rules.required, rules.lastName]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.emailAss"
                              label="Email"
                              :rules="[rules.required, rules.email]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.adresseAss"
                              label="Adresse "
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field
                              type="number"
                              v-model="editedItem.telAss"
                              label="Téléphone *"
                              :rules="[rules.required, rules.min, rules.max]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="5">
                            <v-select
                              v-model="editedItem.chef"
                              :items="items1"
                              label="Chef "
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
        <v-dialog v-model="dialogAlertAdd1" max-width="1100">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Le numéro de téléphone de l'assistant existe déjà, veuillez
              choisir un autre numéro de téléphone !</v-card-title
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
              L'email de l'assistant existe déjà, veuillez choisir autre un
              email d'assistant !</v-card-title
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

      <!--dialog alert-->

      <v-row justify="center">
        <v-dialog v-model="dialogAlertEdit2" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification, l'email assistant modifié est déjà affecté à
              un assistant !</v-card-title
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
              Erreur modification,le numéro de téléphone modifié est déjà
              affecté a un assistant !</v-card-title
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
    nextCodeAssist: "",
    items: [],
    show3: false,
    show4: false,
    dialogDelete: false,
    eltSupp: [],
    ancienid: "",
    dialogAlertEdit1: false,
    dialogAlertEdit2: false,
    dialogAlertEdit3: false,
    dialogAlertAdd1: false,
    dialogAlertAdd2: false,
    items1: [],
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
      email: v => /.+@.+\..+/.test(v) | v || "emailDev doit être valide."
    },
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    bE: false,
    bT: false,
    b: false,
    c: false,
    s: false,
    alert: true,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Id",
        align: "center",
        value: "idAss"
      },
      {
        text: "Adresse",
        align: "center",
        value: "adresseAss"
      },

      {
        align: "center",
        text: "Email",
        value: "emailAss"
      },
      {
        align: "center",
        text: "Nom",
        value: "nomAss"
      },
      {
        align: "center",
        text: "Prénom",
        value: "prenomAss"
      },

      {
        align: "center",
        text: "Téléphone",
        value: "telAss"
      },
      {
        align: "center",
        text: "Chef",
        value: "chef"
      },

      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "350px"
      }
    ],
    assistants: [],
    editedIndex: -1,
    editedItem: {
      idAss: "",
      adresseAss: "",
      emailAss: "",
      nomAss: "",
      prenomAss: "",
      telAss: "",
      chef: ""
    },
    defaultItem: {
      idAss: "",
      adresseAss: "",
      emailAss: "",
      nomAss: "",
      prenomAss: "",
      telAss: "",
      chef: ""
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
      this.ancienid = item.idAss;
      this.editedItem.idAss = item.idAss;
      this.editedItem.chef = item.chef;
      this.editedIndex = this.assistants.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.assistants.indexOf(item);
      this.dialogDelete = false;
      var existe = false;
      axios.get("http://localhost:8083/assistantTechniques").then(ass => {
        axios.get("http://localhost:8083/developpeurs").then(dev => {
          axios
            .get("http://localhost:8083/equipeMaintenances")
            .then(equipMain => {
              axios.get("http://localhost:8083/projets").then(proj => {
                axios
                  .get("http://localhost:8083/surAffectations")
                  .then(surf => {
                    ass.data.forEach(element => {
                      if (element.chef == item.idAss) {
                        existe = true;
                      }
                    });
                    dev.data.forEach(element => {
                      if (element.idAss == item.idAss) {
                        existe = true;
                      }
                    });
                    equipMain.data.forEach(element => {
                      if (element.chef == item.idAss) {
                        existe = true;
                      }
                    });
                    proj.data.forEach(element => {
                      if (element.idAss == item.idAss) {
                        existe = true;
                      }
                    });
                    surf.data.forEach(element => {
                      if (element.idAss == item.idAss) {
                        existe = true;
                      }
                    });
                    if (existe == false) {
                      axios
                        .delete(
                          "http://localhost:8083/assistantTechnique/" +
                            item.idAss
                        )
                        .then(Response => {
                          console.log(Response);
                        });
                      this.assistants.splice(index, 1);
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
            });
        });
      });
    },
    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
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
        axios.get("http://localhost:8083/assistantTechniques").then(res => {
          res.data.forEach(element => {
            if (
              this.editedItem.emailAss == element.emailAss &&
              this.editedItem.idAss != element.idAss
            ) {
              (this.bE = true), (this.dialogAlertEdit2 = true);
            }

            if (
              this.editedItem.telAss == element.telAss &&
              this.editedItem.idAss != element.idAss
            ) {
              (this.bT = true), (this.dialogAlertEdit3 = true);
            }
          });

          if (this.bE != true && this.bT != true) {
            if (this.$refs.form.validate()) {
              var postData = null;
              if (this.editedItem.chef == "") {
                postData = {
                  adresseAss: this.editedItem.adresseAss,
                  emailAss: this.editedItem.emailAss,
                  nomAss: this.editedItem.nomAss,
                  prenomAss: this.editedItem.prenomAss,
                  telAss: this.editedItem.telAss
                };
              } else {
                postData = {
                  adresseAss: this.editedItem.adresseAss,
                  emailAss: this.editedItem.emailAss,
                  nomAss: this.editedItem.nomAss,
                  prenomAss: this.editedItem.prenomAss,
                  telAss: this.editedItem.telAss,
                  chef: this.editedItem.chef
                };
              }

              axios
                .put(
                  "http://localhost:8083/assistantTechnique/" +
                    this.editedItem.idAss,
                  postData
                )
                .then(Response => {
                  if (Response.data.idAss != null) {
                    console.log(Response.data.nomUtil);
                    Object.assign(
                      this.assistants[this.editedIndex],
                      this.editedItem
                    );
                    this.resultatEdit = 1;
                    this.close();
                    this.$session.start();
                    this.$session.set("edit", 1);
                    location.reload();
                  } else {
                    this.dialogAlertEdit1 = true;
                  }
                });
            }
          }
        });
      } else {
        axios
          .get("http://localhost:8083/assistantTechniques")
          .then(Response => {
            this.b = false;
            this.s = false;
            Response.data.forEach(element => {
              if (this.editedItem.emailAss == element.emailAss) {
                this.b = true;
              }
              if (this.editedItem.telAss == element.telAss) {
                this.s = true;
              }
            });

            if (this.b == true) {
              this.dialogAlertAdd2 = true;
            } else if (this.s == true) {
              this.dialogAlertAdd1 = true;
            } else {
              if (this.$refs.form.validate()) {
                var postData = null;
                if (this.editedItem.chef == "") {
                  postData = {
                    idAss: this.nextCodeAssist + this.editedItem.nomAss,
                    adresseAss: this.editedItem.adresseAss,
                    emailAss: this.editedItem.emailAss,
                    nomAss: this.editedItem.nomAss,
                    prenomAss: this.editedItem.prenomAss,
                    telAss: this.editedItem.telAss
                  };
                } else {
                  postData = {
                    idAss: this.nextCodeAssist + this.editedItem.nomAss,
                    adresseAss: this.editedItem.adresseAss,
                    emailAss: this.editedItem.emailAss,
                    nomAss: this.editedItem.nomAss,
                    prenomAss: this.editedItem.prenomAss,
                    telAss: this.editedItem.telAss,
                    chef: this.editedItem.chef
                  };
                }

                axios
                  .post("http://localhost:8083/assistantTechnique", postData)
                  .then(Response => {
                    if (Response.data.idAss != null) {
                      this.resultatAdd = 1;
                      this.assistants.push(this.editedItem);
                      (this.adresseAss = ""),
                        (this.emailAss = ""),
                        (this.chef = ""),
                        (this.nomAss = ""),
                        (this.prenomAss = ""),
                        (this.telAss = ""),
                        this.close();
                      this.$session.start();
                      this.$session.set("add", 1);
                      location.reload();
                    } else {
                      this.dialogAlertAdd1 = true;
                    }
                  });
              }
            }
          });
      }
    }
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
  },
  created() {
    axios.get("http://localhost:8083/assistantTechniques").then(res => {
      this.assistants = res.data;
      res.data.forEach(element => {
        this.items1.push(element.idAss);
      });
      if (this.assistants.length != 0) {
        res.data.reduce((a, b) => (a.idAss > b.idAss ? 1 : -1));
        this.nextCodeAssist = this.assistants[this.assistants.length - 1].idAss;
        this.nextCodeAssist =
          "A-0" + (parseInt(this.nextCodeAssist.split("-")[1]) + 1) + "-";
      } else {
        this.nextCodeAssist = "A-01-";
      }
    });
  }
};
</script>

<style>
#boutton {
  height: 27px;
}
</style>
