<template>
  <div class="content">
    <v-app>
      <div>
        <!-- Pour ajout verifier code -->

        <a @click="fermer">
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              Le developpeur a été <strong>ajouté </strong> avec
              <strong> succès </strong>!
            </v-alert>
          </div>
        </a>

        <!-- Pour modificationdateEmbauche-->
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
          :items="developpeurs"
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
                >Développeurs</v-toolbar-title
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
                    ><v-icon left>mdi-plus</v-icon> Nouveau Développeur</v-btn
                  >
                  <v-btn
                    href="/AffecterEquipe"
                    class="mb-2"
                    tile
                    outlined
                    color="#33b5e5"
                    ><v-icon left>mdi-plus</v-icon>Affecter développeur à une
                    équipe</v-btn
                  >
                </template>

                <v-card>
                  <v-card-text>
                    <v-form ref="form">
                      <v-container>
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
                              >l'emailDev saisi est déjà affecté a un
                              developpeur </strong
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
                              v-model="editedItem.nomDev"
                              label="Nom et prénom"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.adresseDev"
                              label="Adresse"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.emailDev"
                              label="Email *"
                              :rules="[rules.required, rules.email]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateEmbauche"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="editedItem.dateEmbauche"
                                  label="Date embauche"
                                  readonly
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateEmbauche"
                                no-title
                                scrollable
                                :max="maxDate"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu = false"
                                  >Cancel</v-btn
                                >
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu.save(editedItem.dateEmbauche)
                                  "
                                  >OK</v-btn
                                >
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.specialiteDev"
                              label="Specialité *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              type="number"
                              v-model="editedItem.telephoneDev"
                              label="Téléphone *"
                              :rules="[rules.required, rules.min, rules.max]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="5">
                            <v-select
                              v-model="editedItem.roleDev"
                              :rules="[rules.required]"
                              @change="afficherIdAss"
                              :items="items1"
                              label="Rôle *"
                            >
                            </v-select>
                          </v-col>
                          <v-col cols="12" sm="6" :hidden="cacher">
                            <v-text-field
                              v-if="cacher == true"
                              v-model="editedItem.idAss"
                              :items="itemsAss"
                              label="Id assistant *"
                            >
                            </v-text-field>
                            <v-text-field
                              v-else
                              v-model="editedItem.idAss"
                              :rules="[rules.required]"
                              disabled="true"
                              :items="itemsAss"
                              label="Id assistant *"
                            >
                            </v-text-field>
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
          <template v-slot:item.dateEmbauche="{ item }">
            {{ item.dateEmbauche.toString().split("T")[0] }}
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
              Le téléphone de du développeur existe déjà, veuillez choisir un
              autre numéro de téléphone !</v-card-title
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
              L'emailDev existe déjà, veuillez choisir autre un emailDev
              !</v-card-title
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
              Erreur modification, l'emailDev saisi est déjà affecté a un
              developpeur !</v-card-title
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
              Erreur modification, le téléphone saisi est déjà affecté a un
              developpeur !</v-card-title
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
    nextCodeDev: "",
    nextCodeAssist: "",
    items: [],
    cacher: true,
    ancienRole: "",
    ancienIdAss: "",
    show3: false,
    show4: false,
    idDevAncien: "",
    idDevAncien1: "",
    dialogAlertAdd1: false,
    dialogAlertAdd2: false,
    dialogAlertEdit2: false,
    dialogAlertEdit3: false,
    items1: ["Assistant et développeur", "Développeur"],
    password: "",
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
      minValue: value =>
        value > 0 || "Le nombre d'expérience doit être supérieur à 0.",
      required: value => !!value || "ce champ est obligatoire.",
      min: v => v.length > 12 || "Minimum 13 caractères",
      max: v => v.length < 14 || "Maximum 13 caractères",
      email: v => /.+@.+\..+/.test(v) | v || "emailDev doit être valide."
    },
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    dialogDelete: false,
    eltSupp: [],
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
        value: "idDev"
      },
      {
        text: "Nom",
        align: "center",
        value: "nomDev"
      },
      {
        align: "center",
        text: "rôle",
        value: "roleDev"
      },

      {
        align: "center",
        text: "Specialité",
        value: "specialiteDev"
      },
      {
        align: "center",
        text: "Téléphone",
        value: "telephoneDev"
      },
      {
        text: "Id assistant",
        align: "center",
        value: "idAss"
      },
      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    maxDate: new Date().toISOString().substr(0, 10),
    developpeurs: [],
    editedIndex: -1,
    editedItem: {
      nomDev: "",
      adresseDev: "",
      emailDev: "",
      dateEmbauche: new Date().toISOString().substr(0, 10),
      roleDev: "",
      specialiteDev: "",
      telephoneDev: "",
      idAss: ""
    },
    defaultItem: {
      nomDev: "",
      adresseDev: "",
      emailDev: "",
      dateEmbauche: "",
      roleDev: "",
      specialiteDev: "",
      telephoneDev: ""
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
    afficherIdAss(role) {
      this.cacher = true;
      if (role == "Assistant et développeur" && this.ancienIdAss != "") {
        this.cacher = false;
        this.editedItem.idAss = this.ancienIdAss;
      } else if (role == "Assistant et développeur" && this.ancienIdAss == "") {
        this.cacher = false;
        axios.get("http://localhost:8083/assistantTechniques").then(res => {
          if (res.data.length != 0) {
            res.data.reduce((a, b) => (a.idAss > b.idAss ? 1 : -1));
            this.nextCodeAssist = res.data[res.data.length - 1].idAss;
            this.editedItem.idAss =
              "A-0" + (parseInt(this.nextCodeAssist.split("-")[1]) + 1) + "-";
          } else {
            this.editedItem.idAss = "A-01-";
          }
        });
      }

      if (role == "Assistant et développeur" && this.ancienIdAss != null) {
        this.cacher = false;
        this.editedItem.idAss = this.ancienIdAss;
      } else if (
        role == "Assistant et développeur" &&
        this.ancienIdAss == null
      ) {
        this.cacher = false;
        axios.get("http://localhost:8083/assistantTechniques").then(res => {
          if (res.data.length != 0) {
            res.data.reduce((a, b) => (a.idAss > b.idAss ? 1 : -1));
            this.nextCodeAssist = res.data[res.data.length - 1].idAss;
            this.editedItem.idAss =
              "A-0" + (parseInt(this.nextCodeAssist.split("-")[1]) + 1) + "-";
          } else {
            this.editedItem.idAss = "A-01-";
          }
        });
      }
    },
    fermer() {
      this.$session.set("add", 0);
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },

    editItem(item) {
      this.editedItem.idDev = item.idDev;
      this.cacher = false;
      this.idDevAncien = item.idDev;
      this.ancienRole = item.roleDev;
      this.ancienIdAss = item.idAss;
      this.editedItem.idAss = item.idAss;
      this.editedIndex = this.developpeurs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    },

    deleteItem(item) {
      const index = this.developpeurs.indexOf(item);
      this.dialogDelete = false;
      var existe = false;
      axios.get("http://localhost:8083/devEquipes").then(devEqui => {
        devEqui.data.forEach(element => {
          if (element.idDev == item.idDev) {
            existe = true;
          }
        });
        if (existe == false) {
          axios
            .delete("http://localhost:8083/developpeur/" + item.idDev)
            .then(Response => {
              console.log(Response);
              if (item.roleDev == "Assistant et développeur") {
                axios.delete(
                  "http://localhost:8083/assistantTechnique/" + item.idAss
                );
              }
            });
          this.developpeurs.splice(index, 1);
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
        if (this.$refs.form.validate()) {
          axios
            .get("http://localhost:8083/developpeurs")
            .then(res => {
              this.s = false;
              this.c = false;
              res.data.forEach(element => {
                if (
                  this.editedItem.emailDev == element.emailDev &&
                  this.idDevAncien != element.idDev
                ) {
                  this.c = true;
                  this.idDevAncien1 = this.idDevAncien;
                }
                if (
                  this.editedItem.telephoneDev == element.telephoneDev &&
                  this.idDevAncien != element.idDev
                ) {
                  this.s = true;
                  this.idDevAncien1 = this.idDevAncien;
                }
              });
              if (this.c == true) {
                this.idDevAncien = this.idDevAncien1;
                this.dialogAlertEdit2 = true;
              }
              if (this.s == true) {
                this.idDevAncien = this.idDevAncien1;
                this.dialogAlertEdit3 = true;
              }

              if (this.s != true && this.c != true) {
                const postData = {
                  nomDev: this.editedItem.nomDev,
                  emailDev: this.editedItem.emailDev,
                  roleDev: this.editedItem.roleDev,
                  adresseDev: this.editedItem.adresseDev,
                  telephoneDev: this.editedItem.telephoneDev,
                  dateEmbauche: this.editedItem.dateEmbauche,
                  specialiteDev: this.editedItem.specialiteDev,
                  idAss:
                    this.editedItem.idAss + this.editedItem.nomDev.split(" ")[0]
                };
                axios
                  .get("http://localhost:8083/developpeurs")
                  .then(Response => {
                    if (
                      this.ancienRole == this.editedItem.roleDev &&
                      this.ancienRole == "Assistant et développeur"
                    ) {
                      axios.put(
                        "http://localhost:8083/assistantTechnique/" +
                          this.editedItem.idAss,
                        {
                          idAss: this.editedItem.idAss,
                          adresseAss: this.editedItem.adresseDev,
                          emailAss: this.editedItem.emailDev,
                          nomAss: this.editedItem.nomDev.split(" ")[0],
                          prenomAss: this.editedItem.nomDev.split(" ")[1],
                          telAss: this.editedItem.telephoneDev
                        },
                        axios.put(
                          "http://localhost:8083/developpeur/" +
                            this.editedItem.idDev,
                          postData
                        )
                      );
                      this.ancienIdAss = "";
                    } else if (
                      this.ancienRole != this.editedItem.roleDev &&
                      this.ancienRole == "Assistant et développeur"
                    ) {
                      const postData = {
                        nomDev: this.editedItem.nomDev,
                        emailDev: this.editedItem.emailDev,
                        roleDev: this.editedItem.roleDev,
                        adresseDev: this.editedItem.adresseDev,
                        telephoneDev: this.editedItem.telephoneDev,
                        dateEmbauche: this.editedItem.dateEmbauche,
                        specialiteDev: this.editedItem.specialiteDev
                      };
                      axios.put(
                        "http://localhost:8083/developpeur/" +
                          this.editedItem.idDev,
                        postData
                      );

                      axios.delete(
                        "http://localhost:8083/assistantTechnique/" +
                          this.ancienIdAss
                      );
                      this.ancienIdAss = "";
                    } else if (
                      this.ancienRole != this.editedItem.roleDev &&
                      this.ancienRole != "Assistant et développeur"
                    ) {
                      axios.post("http://localhost:8083/assistantTechnique", {
                        idAss:
                          this.editedItem.idAss +
                          this.editedItem.nomDev.split(" ")[0],
                        adresseAss: this.editedItem.adresseDev,
                        emailAss: this.editedItem.emailDev,
                        nomAss: this.editedItem.nomDev.split(" ")[0],
                        prenomAss: this.editedItem.nomDev.split(" ")[1],
                        telAss: this.editedItem.telephoneDev
                      });
                      axios.put(
                        "http://localhost:8083/developpeur/" +
                          this.editedItem.idDev,
                        postData
                      );
                      this.ancienIdAss = "";
                    }
                    console.log(Response.data.idDev);
                    Object.assign(
                      this.developpeurs[this.editedIndex],
                      this.editedItem
                    );
                    this.resultatEdit = 1;
                    this.close();
                    this.$session.start();
                    this.$session.set("edit", 1);
                    location.reload();
                  });
              }
            })
            .catch(() => {
              this.resultatEdit = 0;
            });
        }
      } else {
        axios.get("http://localhost:8083/developpeurs").then(Response => {
          this.b = false;
          this.s = false;
          Response.data.forEach(element => {
            if (this.editedItem.emailDev == element.emailDev) {
              this.b = true;
            }
            if (this.editedItem.telephoneDev == element.telephoneDev) {
              this.s = true;
            }
          });

          if (this.b == true) {
            this.dialogAlertAdd2 = true;
          } else if (this.s == true) {
            this.dialogAlertAdd1 = true;
          } else {
            var postData = {};

            if (this.$refs.form.validate()) {
              if (this.editedItem.roleDev == "Assistant et développeur") {
                postData = {
                  idDev:
                    this.nextCodeDev + this.editedItem.nomDev.split(" ")[0],
                  nomDev: this.editedItem.nomDev,
                  emailDev: this.editedItem.emailDev,
                  roleDev: this.editedItem.roleDev,
                  adresseDev: this.editedItem.adresseDev,
                  telephoneDev: this.editedItem.telephoneDev,
                  dateEmbauche: this.editedItem.dateEmbauche,
                  specialiteDev: this.editedItem.specialiteDev,
                  idAss:
                    this.editedItem.idAss + this.editedItem.nomDev.split(" ")[0]
                };
              } else {
                postData = {
                  idDev:
                    this.nextCodeDev + this.editedItem.nomDev.split(" ")[0],
                  nomDev: this.editedItem.nomDev,
                  emailDev: this.editedItem.emailDev,
                  roleDev: this.editedItem.roleDev,
                  adresseDev: this.editedItem.adresseDev,
                  telephoneDev: this.editedItem.telephoneDev,
                  dateEmbauche: this.editedItem.dateEmbauche,
                  specialiteDev: this.editedItem.specialiteDev
                };
              }
              if (this.editedItem.roleDev == "Assistant et développeur") {
                axios
                  .post("http://localhost:8083/assistantTechnique", {
                    idAss:
                      this.editedItem.idAss +
                      this.editedItem.nomDev.split(" ")[0],
                    adresseAss: this.editedItem.adresseDev,
                    emailAss: this.editedItem.emailDev,
                    nomAss: this.editedItem.nomDev.split(" ")[0],
                    prenomAss: this.editedItem.nomDev.split(" ")[1],
                    telAss: this.editedItem.telephoneDev
                  })
                  .then(Response => {
                    if (Response.data.idAss != null) {
                      axios.post("http://localhost:8083/developpeur", postData);
                      this.resultatAdd = 1;
                      this.developpeurs.push(this.editedItem);
                      (this.nomDev = ""),
                        (this.adresseDev = ""),
                        (this.emailDev = ""),
                        (this.telephoneDev = ""),
                        (this.roleDev = ""),
                        (this.specialiteDev = ""),
                        (this.dateEmbauche = ""),
                        this.close();
                      this.$session.start();
                      this.$session.set("add", 1);
                      location.reload();
                    } else {
                      this.resultatAdd = 0;
                    }
                  });
              } else {
                axios
                  .post("http://localhost:8083/developpeur", postData)
                  .then(Response => {
                    if (Response.data.nomDev != null) {
                      this.resultatAdd = 1;
                      this.developpeurs.push(this.editedItem);
                      (this.nomDev = ""),
                        (this.adresseDev = ""),
                        (this.emailDev = ""),
                        (this.telephoneDev = ""),
                        (this.roleDev = ""),
                        (this.specialiteDev = ""),
                        (this.dateEmbauche = ""),
                        this.close();
                      this.$session.start();
                      this.$session.set("add", 1);
                      location.reload();
                    } else {
                      this.resultatAdd = 0;
                    }
                  });
              }
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
    axios.get("http://localhost:8083/developpeurs").then(res => {
      this.developpeurs = res.data;
      if (res.data.length != 0) {
        res.data.reduce((a, b) => (a.idDev > b.idDev ? 1 : -1));
        this.nextCodeDev = res.data[res.data.length - 1].idDev;
        this.nextCodeDev =
          "Dev-0" + (parseInt(this.nextCodeDev.split("-")[1]) + 1) + "-";
      } else {
        this.nextCodeDev = "Dev-01-";
      }
    });

    axios.get("http://localhost:8083/assistantTechniques").then(res => {
      if (res.data.length != 0) {
        res.data.reduce((a, b) => (a.idAss > b.idAss ? 1 : -1));
        this.nextCodeAssist = res.data[res.data.length - 1].idAss;
        this.editedItem.idAss =
          "A-0" + (parseInt(this.nextCodeAssist.split("-")[1]) + 1) + "-";
      } else {
        this.editedItem.idAss = "A-01-";
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
