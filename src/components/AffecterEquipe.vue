<template>
  <div class="content">
    <v-app>
      <div>
        <div>
          <!-- Pour ajout -->
          <a @click="fermer">
            <div v-if="this.$session.get('add') == 1">
              <v-alert v-model="alert" dismissible dense text type="success">
                L'affectation a été <strong>ajoutée </strong> avec
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

          <v-data-table
            :headers="headers"
            :search="search"
            :items="Affectations"
            sort-by="codeEquipe"
            class="elevation-4"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title style="color:#33b5e5"
                  >Affectations</v-toolbar-title
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
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      dark
                      class="mb-2"
                      v-on="on"
                      tile
                      outlined
                      color="#33b5e5"
                      ><v-icon left>mdi-plus</v-icon> Nouvelle
                      affectation</v-btn
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
                              Cette affectation
                              <strong>existe déjà, </strong> veuillez changer
                              <strong>
                                le code equipe ou l'identifiant du développeur </strong
                              >!
                            </v-alert>
                          </div>

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
                                >veuillez ne pas modifer l'identifiant du
                                développeur </strong
                              >!
                            </v-alert>
                          </div>
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
                                >veuillez ne pas modifer le code de l'équipe </strong
                              >!
                            </v-alert>
                          </div>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-select
                                v-model="editedItem.codeEquipe"
                                :rules="[rules.required]"
                                :items="items1"
                                label="Code equipe *"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select
                                v-model="editedItem.idDev"
                                :rules="[rules.required]"
                                :items="items2"
                                label="Id développeur  *"
                              >
                              </v-select>
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
      </div>

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
    dialogDelete: false,
    eltSupp: [],
    items1: [],
    items2: [],
    items: [],
    fromDateMenu: false,
    fromDateVal: null,
    rules: {
      minValue: value =>
        value >= 1 || "La quantité doit être supérieur ou égale à 1.",
      required: value => !!value || "ce champ est obligatoire.",
      min: v =>
        (v.length >= 8 && v.length <= 13) ||
        "Minimum 8 caractères et maximum 13 caractères",
      email: v => /.+@.+\..+/.test(v) | v || "emailDev doit être valide."
    },
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    alert: true,
    existe: false,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Code équipe",
        align: "center",
        value: "codeEquipe"
      },
      {
        align: "center",
        text: "Id développeur",
        value: "idDev"
      },

      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    Affectations: [],
    editedIndex: -1,
    editedItem: {
      codeEquipe: "",
      idDev: ""
    },
    defaultItem: {
      codeEquipe: "",
      idDev: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },

    fromDateDisp() {
      return this.fromDateVal;
      // format/do something with date
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },
    fermer() {
      this.$session.set("add", 0);
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },
    editItem(item) {
      this.editedIndex = this.Affectations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.Affectations.indexOf(item);
      this.dialogDelete = false;
      axios
        .delete(
          "http://localhost:8083/devequipes/" +
            item.codeEquipe +
            "/" +
            item.idDev
        )
        .then(Response => {
          console.log(Response);
        });
      this.Affectations.splice(index, 1);
      this.resultatDelete = 1;
      this.$session.start();
      this.$session.set("delete", 1);
      location.reload();
    },

    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
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
          if (this.editedItem.idDev != this.ancienneId) {
            this.resultatEdit = 5;
          } else if (this.editedItem.codePro != this.ancienCodePro) {
            this.resultatEdit = 4;
          }
        }
      } else {
        if (this.$refs.form.validate()) {
          axios.get("http://localhost:8083/devEquipes").then(res => {
            this.existe = false;
            res.data.forEach(element => {
              if (
                this.editedItem.codeEquipe == element.codeEquipe &&
                this.editedItem.idDev == element.idDev
              ) {
                this.existe = true;
              }
            });

            if (this.existe == false) {
              const postData = {
                codeEquipe: this.editedItem.codeEquipe,
                idDev: this.editedItem.idDev
              };
              axios
                .post("http://localhost:8083/devEquipe", postData)

                .then(Response => {
                  if (Response.data.codeEquipe != null) {
                    this.resultatAdd = 1;
                    this.Affectations.push(this.editedItem);
                    (this.codeEquipe = ""), (this.idDev = ""), this.close();
                    this.$session.start();
                    this.$session.set("add", 1);
                    location.reload();
                  }
                });
            } else {
              this.resultatAdd = 0;
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
    axios.get("http://localhost:8083/devEquipes").then(res => {
      this.Affectations = res.data;
    });

    axios.get("http://localhost:8083/equipeDeveloppements").then(res => {
      console.log(res.data);
      res.data.forEach(element => {
        if (element.codeEquipe != 0) this.items1.push(element.codeEquipe);
      });
    });

    axios.get("http://localhost:8083/developpeurs").then(res => {
      console.log(res.data);
      res.data.forEach(element => {
        if (element.idDev != 0) this.items2.push(element.idDev);
      });
    });
  },

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
