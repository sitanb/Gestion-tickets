<template>
  <div class="content">
    <v-app id="inspire">
      <div>
        <!-- Pour ajout -->
        <a @click="fermer">
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              L'équipe de maintenance a été <strong>ajoutée </strong> avec
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
          :items="maintenances"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          sort-by="codeEquipeMain"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5"
                >Equipes de maintenances</v-toolbar-title
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
                    ><v-icon left>mdi-plus</v-icon> Nouvelle équipe</v-btn
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
                            Cette équipe <strong>existe déjà, </strong> veuillez
                            changer <strong> le code de l'equipe </strong>!
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
                              >veuillez ne pas modifer le code de l'équipe </strong
                            >!
                          </v-alert>
                        </div>

                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.code"
                              disabled="true"
                              label="code Equipe *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.nomEquipeMain"
                              label="nom Equipe *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-select
                              v-model="editedItem.chef"
                              :rules="[rules.required]"
                              no-data-text="Tous les chefs sont déjà affectés à une équipe"
                              :items="items"
                              label="Chef Equipe *"
                            >
                            </v-select>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateConstitution"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="editedItem.dateConstitution"
                                  label="Date de constitution"
                                  readonly
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateConstitution"
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
                                    $refs.menu.save(editedItem.dateConstitution)
                                  "
                                  >OK</v-btn
                                >
                              </v-date-picker>
                            </v-menu>
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

          <template v-slot:item.dateConstitution="{ item }">
            <p>{{ item.dateConstitution.toString().split("T")[0] }}</p>
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
              Cette équipe existe déjà, veuillez changer le code de l'equipe
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
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification, veuillez ne pas modifer le code de
              l'équipe!</v-card-title
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
    nextCodeEquipMain: "",
    menu: false,
    code: "",
    dialogDelete: false,
    eltSupp: [],
    maxDate: new Date().toISOString().substr(0, 10),
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
    alert: true,
    cacher: false,
    items: [],
    dialogAlertEdit: false,
    dialogAlertAdd: false,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Code Equipe",
        align: "center",
        value: "code"
      },
      {
        align: "center",
        text: "Nom Equipe",
        value: "nomEquipeMain"
      },
      {
        align: "center",
        text: "Chef Equipe",
        value: "chef"
      },

      {
        align: "center",
        text: "Date de constitution",
        value: "dateConstitution"
      },

      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    maintenances: [],
    editedIndex: -1,
    editedItem: {
      code: "",
      nomEquipeMain: "",
      chef: "",
      dateConstitution: new Date().toISOString().substr(0, 10)
    },
    defaultItem: {
      code: "",
      nomEquipeMain: "",
      chef: "",
      dateConstitution: new Date().toISOString().substr(0, 10)
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
      var affecter = false;
      axios.get("http://localhost:8083/assistantTechniques").then(assis => {
        axios.get("http://localhost:8083/equipeMaintenances").then(equip => {
          assis.data.forEach(ass => {
            affecter = false;
            equip.data.forEach(equi => {
              if (ass.chef == equi.chef && item.chef != ass.chef) {
                affecter = true;
              }
            });

            if (affecter == false && ass.chef != null) {
              this.items.push(ass.chef);
            }
          });
        });
      });
      item.dateConstitution = item.dateConstitution.toString().split("T")[0];
      this.editedIndex = this.maintenances.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    deleteItem(item) {
      const index = this.maintenances.indexOf(item);
      this.dialogDelete = false;
      var existe = false;
      axios.get("http://localhost:8083/projets").then(proj => {
        proj.data.forEach(element => {
          if (element.code == item.code) {
            existe = true;
          }
        });
        if (existe == false) {
          axios
            .delete("http://localhost:8083/equipeMaintenance/" + item.code)
            .then(Response => {
              console.log(Response);
            });
          this.maintenances.splice(index, 1);
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
            code: this.editedItem.code,
            nomEquipeMain: this.editedItem.nomEquipeMain,
            dateConstitution: this.editedItem.dateConstitution,
            chef: this.editedItem.chef
          };
          axios
            .put(
              "http://localhost:8083/equipeMaintenance/" + this.editedItem.code,
              postData
            )
            .then(Response => {
              if (Response.data.code != null) {
                Object.assign(
                  this.maintenances[this.editedIndex],
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
        }
      } else {
        if (this.$refs.form.validate()) {
          const postData = {
            code: this.editedItem.code + this.editedItem.nomEquipeMain,
            nomEquipeMain: this.editedItem.nomEquipeMain,
            dateConstitution: this.editedItem.dateConstitution,
            chef: this.editedItem.chef
          };

          axios
            .post("http://localhost:8083/equipeMaintenance", postData)
            .then(Response => {
              if (Response.data.code != null) {
                this.resultatAdd = 1;
                this.maintenances.push(this.editedItem);
                (this.code = ""),
                  (this.nomEquipeMain = ""),
                  (this.chef = ""),
                  (this.dateConstitution = "");
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
    axios.get("http://localhost:8083/equipeMaintenances").then(res => {
      this.maintenances = res.data;
      if (res.data.length != 0) {
        res.data.reduce((a, b) => (a.code > b.code ? 1 : -1));
        this.nextCodeEquipMain = res.data[res.data.length - 1].code;
        this.editedItem.code =
          "EM-0" + (parseInt(this.nextCodeEquipMain.split("-")[1]) + 1) + "-";
      } else {
        this.editedItem.code = "EM-01-";
      }
    });

    var affecter = false;
    axios.get("http://localhost:8083/assistantTechniques").then(assis => {
      axios.get("http://localhost:8083/equipeMaintenances").then(equip => {
        assis.data.forEach(ass => {
          affecter = false;
          equip.data.forEach(equi => {
            if (ass.chef == equi.chef) {
              affecter = true;
            }
          });

          if (affecter == false && ass.chef != null) {
            this.items.push(ass.chef);
          }
        });
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
