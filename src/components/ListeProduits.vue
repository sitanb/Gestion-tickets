<template>
  <div class="content">
    <v-app>
      <div>
        <a @click="fermer">
          <!-- Pour ajout -->
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              Le produit a été <strong>ajouté </strong> avec
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
          :items="produits"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          sort-by="codePro"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5">Produits</v-toolbar-title>
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
                    ><v-icon left>mdi-plus</v-icon> Nouveau produit</v-btn
                  >
                </template>

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
                              v-model="editedItem.codePro"
                              disabled="true"
                              label="Code *"
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.nomPro"
                              label="Nom *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.versionPro"
                              label="Version *"
                              :rules="[rules.required, rules.text]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.quantiteStock"
                              label="Quantité stock *"
                              type="number"
                              :rules="[rules.required, rules.minValue]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-select
                              v-model="editedItem.langage"
                              :rules="[rules.required]"
                              :items="items"
                              label="Langages *"
                            >
                            </v-select>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-select
                              v-model="editedItem.codeEquipe"
                              :rules="[rules.required]"
                              :items="itemsEquipes"
                              label="Equipe de développement *"
                            >
                            </v-select>
                          </v-col>

                          <v-col cols="12" sm="12" md="6">
                            <v-textarea
                              v-model="editedItem.descPro"
                              label="Description *"
                              :rules="[rules.required]"
                            ></v-textarea>
                          </v-col>

                          <v-col cols="12" sm="12" md="6">
                            <input type="file" @change="onFileChanged" />
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
          <template v-slot:item.image="{ item }">
            <img :src="item.image" width="100" height="50" />
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
      minValue: value =>
        value >= 1 || "La quantité doit être supérieur ou égale à 1.",
      required: value => !!value || "ce champ est obligatoire.",
      min: v =>
        (v.length >= 8 && v.length <= 13) ||
        "Minimum 8 caractères et maximum 13 caractères",
      email: v => /.+@.+\..+/.test(v) | v || "emailDev doit être valide."
    },
    nextCodePro: "",
    oldimg: null,
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    image: null,
    alert: true,
    dialog: false,
    dialogAlertEdit: false,
    dialogAlertAdd: false,
    search: "",
    cacher: false,
    items: [],
    itemsEquipes: [],
    headers: [
      {
        text: "Code",
        align: "center",
        value: "codePro"
      },
      {
        align: "center",
        text: "Nom",
        value: "nomPro"
      },
      {
        align: "center",
        text: "Version",
        value: "versionPro"
      },
      {
        align: "center",
        text: "Description",
        value: "descPro"
      },
      {
        align: "center",
        text: "Langage",
        value: "langage"
      },
      {
        align: "center",
        text: "Equipe Dev",
        value: "codeEquipe"
      },
      {
        align: "center",
        text: "Image",
        value: "image"
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "350px"
      }
    ],
    produits: [],
    editedIndex: -1,
    editedItem: {
      codePro: "",
      nomPro: "",
      versionPro: "",
      descPro: "",
      langage: "",
      quantiteStock: "",
      codeEquipe: ""
    },
    defaultItem: {
      codePro: "",
      nomPro: "",
      versionPro: "",
      descPro: "",
      langage: "",
      quantiteStock: ""
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
    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    },
    onFileChanged(event) {
      let img = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = event => {
        this.image = event.target.result;
      };
    },
    fermer() {
      this.$session.set("add", 0);
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },

    getlangages() {
      axios.get("http://localhost:8083/langageDevs").then(res => {
        console.log(res.data);
        res.data.forEach(element => {
          if (element.codeLang != 0) this.items.push(element.codeLang);
        });
      });
    },

    getlEquipeDev() {
      axios.get("http://localhost:8083/equipeDeveloppements").then(res => {
        console.log(res.data);
        res.data.forEach(element => {
          if (element.codeEquipe != 0)
            this.itemsEquipes.push(element.codeEquipe);
        });
      });
    },

    editItem(item) {
      this.cacher = true;
      this.oldimg = item.image;
      this.editedIndex = this.produits.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    deleteItem(item) {
      const index = this.produits.indexOf(item);
      this.dialogDelete = false;
      var existe = false;
      axios.get("http://localhost:8083/ligneProduits").then(lig => {
        axios.get("http://localhost:8083/tickets").then(tick => {
          lig.data.forEach(element => {
            if (element.codePro == item.codePro) {
              existe = true;
            }
          });
          tick.data.forEach(element => {
            if (element.codePro == item.codePro) {
              existe = true;
            }
          });
          if (existe == false) {
            axios
              .delete("http://localhost:8083/produit/" + item.codePro)
              .then(Response => {
                console.log(Response);
              });
            this.produits.splice(index, 1);
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
        if (this.$refs.form.validate()) {
          if (this.image == null) {
            this.postData = {
              codePro: this.editedItem.codePro,
              nomPro: this.editedItem.nomPro,
              versionPro: this.editedItem.versionPro,
              descPro: this.editedItem.descPro,
              langage: this.editedItem.langage,
              quantiteStock: this.editedItem.quantiteStock,
              image: this.oldimg,
              codeEquipe: this.editedItem.codeEquipe
            };
          } else {
            this.postData = {
              codePro: this.editedItem.codePro,
              nomPro: this.editedItem.nomPro,
              versionPro: this.editedItem.versionPro,
              descPro: this.editedItem.descPro,
              langage: this.editedItem.langage,
              quantiteStock: this.editedItem.quantiteStock,
              image: this.image,
              codeEquipe: this.editedItem.codeEquipe
            };
          }
          axios
            .put(
              "http://localhost:8083/produit/" + this.editedItem.codePro,
              this.postData
            )
            .then(Response => {
              if (Response.data.codePro != null) {
                Object.assign(this.produits[this.editedIndex], this.editedItem);
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
            codePro: this.editedItem.codePro + this.editedItem.nomPro,
            nomPro: this.editedItem.nomPro,
            versionPro: this.editedItem.versionPro,
            descPro: this.editedItem.descPro,
            langage: this.editedItem.langage,
            quantiteStock: this.editedItem.quantiteStock,
            image: this.image,
            codeEquipe: this.editedItem.codeEquipe
          };

          axios
            .post("http://localhost:8083/produit", postData)
            .then(Response => {
              if (Response.data.codePro != null) {
                console.log(Response.data);
                this.resultatAdd = 1;
                this.produits.push(this.editedItem);
                (this.codePro = ""),
                  (this.nomPro = ""),
                  (this.versionPro = ""),
                  (this.descPro = ""),
                  (this.langage = "");
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
    this.getlEquipeDev();
  },
  created() {
    axios.get("http://localhost:8083/produits").then(res => {
      this.produits = res.data;
      if (res.data.length != 0) {
        res.data.reduce((a, b) => (a.codePro > b.codePro ? 1 : -1));
        this.nextCodePro = this.produits[this.produits.length - 1].codePro;
        this.editedItem.codePro =
          "P-0" + (parseInt(this.nextCodePro.split("-")[1]) + 1) + "-";
      } else {
        this.editedItem.codePro = "P-01-";
      }
    });
    this.getlangages();
  }
};
</script>

<style>
#boutton {
  height: 27px;
}
</style>
