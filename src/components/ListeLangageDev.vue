<template>
  <div class="content">
    <v-app>
      <div>
        <a @click="fermer">
          <!-- Pour ajout -->
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              Le langage de développement a été <strong>ajouté </strong> avec
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
          :items="Langages"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          sort-by="codeLang"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5"
                >Langages de développement</v-toolbar-title
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
              <v-dialog v-model="dialog" max-width="600px" persistent>
                <template v-slot:activator="{ on }">
                  <v-btn
                    dark
                    class="mb-2"
                    v-on="on"
                    tile
                    outlined
                    color="#33b5e5"
                    ><v-icon left>mdi-plus</v-icon> Nouveau Langage de
                    développement</v-btn
                  >
                </template>

                <v-card>
                  <v-card-text>
                    <v-form ref="form">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.codeLang"
                              disabled="true"
                              label="Code *"
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.nomLang"
                              label="Nom  *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-textarea
                              v-model="editedItem.descriptionLang"
                              label="Description *"
                              :rules="[rules.required]"
                            ></v-textarea>
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
              >Erreur modification, veuillez ne pas modifer le
              code!</v-card-title
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
    nextCodeLang: "",
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
    dialogAlertEdit: false,
    dialogDelete: false,
    eltSupp: [],
    dialogAlertAdd: false,
    resultatEdit: 3,
    resultatDelete: 3,
    alert: true,
    cacher: false,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Code",
        align: "center",
        value: "codeLang"
      },
      {
        align: "center",
        text: "Description",
        value: "descriptionLang"
      },
      {
        align: "center",
        text: "Nom",
        value: "nomLang"
      },

      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    Langages: [],
    editedIndex: -1,
    editedItem: {
      codeLang: "",
      descriptionLang: "",
      nomLang: ""
    },
    defaultItem: {
      codeLang: "",
      descriptionLang: "",
      nomLang: ""
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

    editItem(item) {
      this.cacher = true;
      this.editedIndex = this.Langages.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    },
    deleteItem(item) {
      const index = this.Langages.indexOf(item);
      this.dialogDelete = false;
      var existe = false;
      axios.get("http://localhost:8083/produits").then(res => {
        res.data.forEach(element => {
          if (item.codeLang == element.langage) {
            existe = true;
          }
        });
        if (existe == false) {
          axios
            .delete("http://localhost:8083/langageDev/" + item.codeLang)
            .then(Response => {
              console.log(Response);
            });
          this.Langages.splice(index, 1);
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
          const postData = {
            codeLang: this.editedItem.codeLang,
            descriptionLang: this.editedItem.descriptionLang,
            nomLang: this.editedItem.nomLang
          };
          axios
            .put(
              "http://localhost:8083/langageDev/" + this.editedItem.codeLang,
              postData
            )
            .then(Response => {
              if (Response.data.codeLang != null) {
                Object.assign(this.Langages[this.editedIndex], this.editedItem);
                this.resultatEdit = 1;
                this.close();
                this.$session.start();
                this.$session.set("edit", 1);
                location.reload();
              } else {
                this.dialogAlertEdit = true;
              }
            });
        }
      } else {
        if (this.$refs.form.validate()) {
          const postData = {
            codeLang: this.editedItem.codeLang + this.editedItem.nomLang,
            descriptionLang: this.editedItem.descriptionLang,
            nomLang: this.editedItem.nomLang
          };
          axios
            .post("http://localhost:8083/langageDev", postData)
            .then(Response => {
              if (Response.data.codeLang != null) {
                this.resultatAdd = 1;
                this.Langages.push(this.editedItem);
                (this.codeLang = ""),
                  (this.descriptionLang = ""),
                  (this.nomLang = "");

                this.close();
                this.$session.start();
                this.$session.set("add", 1);
                location.reload();
              } else {
                this.dialogAlertAdd = true;
              }
            });
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
    axios.get("http://localhost:8083/langageDevs").then(res => {
      this.Langages = res.data;
      if (res.data.length != 0) {
        res.data.reduce((a, b) => (a.codeLang > b.codeLang ? 1 : -1));
        this.nextCodeLang = res.data[res.data.length - 1].codeLang;
        this.editedItem.codeLang =
          "L-0" + (parseInt(this.nextCodeLang.split("-")[1]) + 1) + "-";
      } else {
        this.editedItem.codeLang = "L-01-";
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
