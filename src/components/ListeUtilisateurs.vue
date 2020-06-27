<template>
  <div class="content">
    <v-app>
      <div>
        <!-- Pour ajout verifier code -->

        <a @click="fermer">
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              L'utilisateur a été <strong>ajouté </strong> avec
              <strong> succès </strong>!
            </v-alert>
          </div>
        </a>
        <!-- Pour modification nomutil-->
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
          :headers="headers"
          :search="search"
          :items="utilisateurs"
          sort-by="nomUtil"
          class="elevation-4"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5"
                >Utilisateurs</v-toolbar-title
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
                    dark
                    class="mb-2"
                    v-on="on"
                    tile
                    outlined
                    color="#33b5e5"
                    ><v-icon left>mdi-plus</v-icon> Nouveau Utilisateur</v-btn
                  >
                </template>

                <v-card>
                  <v-card-text>
                    <v-form ref="form">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.nom"
                              label="Nom"
                              :rules="[rules.name]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.prenom"
                              label="Prénom"
                              :rules="[rules.lastName]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6" v-if="editedItem != null">
                            <v-text-field
                              v-model="editedItem.email"
                              label="Email"
                              :rules="[rules.Email]"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            v-if="editedItem.email == null"
                          >
                            <v-text-field
                              v-model="editedItem.email"
                              label="Email"
                              :rules="[rules.Email]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.nomUtil"
                              :disabled="cacherr"
                              label="Nom d'utilisateur *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.motPass"
                              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                              :rules="[rules.required, rules.min, rules.text]"
                              :type="show3 ? 'text' : 'password'"
                              name="input-10-2"
                              label="Mot de passe *"
                              hint="Au minimum 8 caractères "
                              class="input-group--focused"
                              @click:append="show3 = !show3"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.confirm"
                              :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                              :rules="[rules.required, verifie]"
                              :type="show4 ? 'text' : 'password'"
                              name="input-10-2"
                              label="Confirmer *"
                              hint="Au minimum 8 caractères"
                              @click:append="show4 = !show4"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-select
                              v-model="editedItem.groupe"
                              :rules="[rules.required]"
                              @change="afficherVselectAssistant"
                              :items="items"
                              label="Groupe *"
                            >
                            </v-select>
                          </v-col>

                          <v-col cols="12" sm="6" :hidden="cacher">
                            <v-select
                              v-if="cacher == true"
                              v-model="editedItem.idAss"
                              :items="itemsAss"
                              label="Id assistant *"
                            >
                            </v-select>
                            <v-select
                              v-else
                              v-model="editedItem.idAss"
                              :rules="[rules.required]"
                              :items="itemsAss"
                              label="Id assistant *"
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
        <v-dialog v-model="dialogAlertAdd1" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              L'email existe déjà, veuillez choisir un email!</v-card-title
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
              Le nom d'utilisateur existe déjà, veuillez choisir un autre nom
              d'utilisateur !</v-card-title
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
        <v-dialog v-model="dialogAlertEdit1" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification,l'email saisi est déjà affecté a un
              utilisateur !</v-card-title
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
              Erreur modification,veuillez ne pas modifer le nom d'utilisateur
              !</v-card-title
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
        <v-dialog v-model="dialogAlertEdit1" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification,l'email saisi est déjà affecté a un
              utilisateur !</v-card-title
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
        <v-dialog v-model="dialogAlertAdd3" max-width="600">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Cet assistant a déjà un compte d'utilisateur !</v-card-title
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
    items: [
      "Administrateur",
      "Assistant technique",
      "Chef assistant technique",
      "Chef personnel",
      "Commercial"
    ],
    itemsAss: [],
    cacher: true,
    show3: false,
    show4: false,
    password: "",
    cacherr: false,
    dialogAlertEdit1: false,
    dialogAlertEdit2: false,
    dialogAlertAdd1: false,
    dialogAlertAdd2: false,
    dialogAlertAdd3: false,
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
      min: v => v.length >= 8 || "Minimum 8 caractères",
      Email: v => /.+@.+\..+/.test(v) | v || "Email doit être valide."
    },
    resultatAdd: 3,
    dialogDelete: false,
    eltSupp: [],
    resultatEdit: 3,
    resultatDelete: 3,
    b: false,
    c: false,
    alert: true,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Nom",
        align: "center",
        value: "nom"
      },
      {
        align: "center",
        text: "Prénom",
        value: "prenom"
      },
      {
        align: "center",
        text: "Nom d'utilisateur",
        value: "nomUtil"
      },
      {
        align: "center",
        text: "Mot de passe",
        value: "motPass"
      },

      {
        align: "center",
        text: "Groupe",
        value: "groupe"
      },
      {
        align: "center",
        text: "Id assistant",
        value: "idAss"
      },
      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    utilisateurs: [],
    editedIndex: -1,
    editedItem: {
      nom: "",
      idAss: "",
      prenom: "",
      email: "",
      nomUtil: "",
      motPass: "",
      groupe: "",
      confirm: ""
    },
    defaultItem: {
      nom: "",
      prenom: "",
      email: "",
      nomUtil: "",
      motPass: "",
      groupe: "",
      confirm: "",
      idAss: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    verifie() {
      return (
        this.editedItem.motPass === this.editedItem.confirm ||
        "Le mot de passe et la confirmation ne correspondent pas."
      );
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

    afficherVselectAssistant(item) {
      this.itemsAss = [];
      this.cacher = true;

      if (item == "Chef assistant technique") {
        axios.get("http://localhost:8083/assistantTechniques").then(res => {
          res.data.forEach(element => {
            if (
              element.chef == null &&
              this.itemsAss.toString().includes(element.idAss) == false
            ) {
              this.itemsAss.push(element.idAss);
            } else if (
              element.chef != null &&
              this.itemsAss.toString().includes(element.chef) == false
            ) {
              this.itemsAss.push(element.chef);
            }
          });
          this.cacher = false;
        });
      }

      if (item == "Assistant technique") {
        axios.get("http://localhost:8083/assistantTechniques").then(res => {
          res.data.forEach(element => {
            if (element.chef != "") {
              this.itemsAss.push(element.idAss);
            }
          });
          this.cacher = false;
        });
      }
    },

    editItem(item) {
      this.cacherr = true;
      if (
        item.groupe == "Assistant technique" ||
        item.groupe == "Chef assistant technique"
      ) {
        this.afficherVselectAssistant(item.groupe);
      }
      this.editedIndex = this.utilisateurs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.confirm = item.motPass;
      this.dialog = true;
    },

    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    deleteItem(item) {
      const index = this.utilisateurs.indexOf(item);
      this.dialogDelete = false;
      axios
        .delete("http://localhost:8083/utilisateur/" + item.nomUtil)
        .then(Response => {
          console.log(Response);
        });
      this.utilisateurs.splice(index, 1);
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
      location.reload();
    },

    save() {
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          const postData = {
            nomUtil: this.editedItem.nomUtil,
            email: this.editedItem.email,
            motPass: this.editedItem.motPass,
            nom: this.editedItem.nom,
            prenom: this.editedItem.prenom,
            groupe: this.editedItem.groupe,
            idAss: this.editedItem.idAss
          };
          axios
            .put(
              "http://localhost:8083/utilisateur/" + this.editedItem.nomUtil,
              postData
            )
            .then(Response => {
              if (Response.data.nomUtil != null) {
                console.log(Response.data.nomUtil);
                Object.assign(
                  this.utilisateurs[this.editedIndex],
                  this.editedItem
                );
                this.resultatEdit = 1;
                this.close();
                this.$session.start();
                this.$session.set("edit", 1);
                location.reload();
              } else {
                axios.get("http://localhost:8083/utilisateurs").then(res => {
                  res.data.forEach(element => {
                    if (this.editedItem.email == element.email) {
                      this.c = true;
                    }
                    if (this.editedItem.nomUtil == element.nomUtil) {
                      this.resultatEdit = 6;
                    }
                  });
                  if (this.c == true) {
                    this.dialogAlertEdit1 = true;
                  }
                  if (this.resultatEdit != 6) {
                    this.dialogAlertEdit2 = true;
                  }
                });
              }
            })
            .catch(() => {
              this.dialogAlertEdit2 = true;
            });
        }
      } else {
        this.b = false;
        axios.get("http://localhost:8083/utilisateurs").then(Response => {
          Response.data.forEach(element => {
            if (this.editedItem.email == element.email) {
              this.b = true;
            }
          });

          if (this.b == true) {
            this.dialogAlertAdd1 = true;
          } else {
            if (this.$refs.form.validate()) {
              var existe = false;

              axios
                .get("http://localhost:8083/utilisateurs")
                .then(utilisateur => {
                  utilisateur.data.forEach(element => {
                    if (
                      element.idAss == this.editedItem.idAss &&
                      this.editedItem.idAss != ""
                    ) {
                      existe = true;
                    }
                  });

                  if (existe == false) {
                    const postData = {
                      nomUtil: this.editedItem.nomUtil,
                      email: this.editedItem.email,
                      motPass: this.editedItem.motPass,
                      nom: this.editedItem.nom,
                      prenom: this.editedItem.prenom,
                      groupe: this.editedItem.groupe,
                      idAss: this.editedItem.idAss
                    };

                    axios
                      .post("http://localhost:8083/utilisateur", postData)
                      .then(Response => {
                        if (Response.data.nomUtil != null) {
                          this.resultatAdd = 1;
                          this.utilisateurs.push(this.editedItem);
                          (this.nom = ""),
                            (this.idAss = ""),
                            (this.prenom = ""),
                            (this.email = ""),
                            (this.nomUtil = ""),
                            (this.motPass = "");
                          this.groupe = "";
                          this.$session.start();
                          this.$session.set("add", 1);
                          location.reload();
                        } else {
                          this.dialogAlertAdd2 = true;
                        }
                      });
                  } else {
                    this.dialogAlertAdd3 = true;
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
    axios.get("http://localhost:8083/utilisateurs").then(res => {
      this.utilisateurs = res.data;
    });
  }
};
</script>

<style>
#boutton {
  height: 27px;
}
</style>
