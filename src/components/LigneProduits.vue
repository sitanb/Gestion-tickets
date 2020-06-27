<template>
  <div class="content">
    <v-app>
      <div>
        <!-- Pour ajout -->
        <a @click="fermer">
          <div v-if="this.$session.get('add') == 1">
            <v-alert v-model="alert" dismissible dense text type="success">
              La ligne de produit a été <strong>ajoutée </strong> avec
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
          :items="LigneProduits"
          sort-by="code"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title style="color:#33b5e5"
                >LigneProduits</v-toolbar-title
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
              <v-dialog v-model="dialog" max-width="550px" persistent>
                <template v-slot:activator="{ on }">
                  <v-btn
                    dark
                    class="mb-2"
                    v-on="on"
                    tile
                    outlined
                    color="#33b5e5"
                    ><v-icon left>mdi-plus</v-icon> Nouvelle ligne
                    produit</v-btn
                  >
                </template>

                <v-card>
                  <v-card-text>
                    <v-form ref="form">
                      <v-container>
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
                              >veuillez ne pas modifer la raison sociale </strong
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
                              >veuillez ne pas modifer le code produit </strong
                            >!
                          </v-alert>
                        </div>
                        <v-row>
                          <v-col cols="12" sm="5">
                            <v-select
                              v-model="editedItem.codePro"
                              :disabled="cacher"
                              :rules="[rules.required]"
                              :items="items1"
                              label="Code produit *"
                            >
                            </v-select>
                          </v-col>
                          <v-col cols="12" sm="1" style="padding-top:36px">
                            <a href="/ListeProduits" style="color:green"
                              ><i class="fas fa-plus"></i
                            ></a>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <v-select
                              v-model="editedItem.raisonSoc"
                              :disabled="cacher"
                              :rules="[rules.required]"
                              :items="items2"
                              label="Raison sociale  *"
                            >
                            </v-select>
                          </v-col>

                          <v-col cols="12" sm="1" style="padding-top:36px">
                            <a href="/ListeSocietes" style="color:green"
                              ><i class="fas fa-plus"></i
                            ></a>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.quantite"
                              type="number"
                              @change="stock"
                              label="Quantité *"
                              :rules="[
                                rules.required,
                                rules.minValue,
                                rules.stockQte
                              ]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.prixUnitaire"
                              type="number"
                              label="Prix unitaire *"
                              :rules="[rules.required, rules.minValue]"
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
          <template v-slot:item.date="{ item }">
            {{
              item.date.toString().substring(0, 2) +
                "-" +
                item.date.toString().substring(2, 4) +
                "-" +
                item.date.toString().substring(4, 8) +
                " à " +
                item.date.toString().substring(8, 10) +
                ":" +
                item.date.toString().substring(10, 12) +
                ":" +
                item.date.toString().substring(12, 14)
            }}
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
        <v-dialog v-model="dialogQteStock" max-width="500">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              La quantité en stock est insuffisante !<br />
              Il ne reste que {{ quantiteStock }} en stock !.</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogQteStock = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialogAlertAdd" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Cette ligne de produit existe déjà, veuillez changer le code
              produtit ou la raison sociale !</v-card-title
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
        <v-dialog v-model="dialogAlertEdit1" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification, veuillez ne pas modifer la raison sociale
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

      <!--dialog alert-->

      <v-row justify="center">
        <v-dialog v-model="dialogAlertEdit2" max-width="900">
          <v-card>
            <v-card-title class="headline" v-model="titre" style="color:red">
              Erreur modification,veuillez ne pas modifer le code produit
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
    ancienCodePro: "",
    ancienneRaisSoc: "",
    dialogDelete: false,
    eltSupp: [],
    qteVreifier: false,
    date: "",
    items1: [],
    items2: [],
    items: [],
    dialogQteStock: false,
    fromDateMenu: false,
    dialologAlertEdit1: false,
    dialologAlertEdit2: false,
    dialologAlertAdd: false,
    fromDateVal: null,
    cacher: false,
    quantiteStock: "",
    rules: {
      minValue: value =>
        value >= 1 || "La quantité doit être supérieur ou égale à 1.",
      required: value => !!value || "ce champ est obligatoire.",
      min: v =>
        (v.length >= 8 && v.length <= 13) ||
        "Minimum 8 caractères et maximum 13 caractères",
      email: v => /.+@.+\..+/.test(v) | v || "emailDev doit être valide."
    },
    resultatEdit: 3,
    resultatDelete: 3,
    ancienQte: "",
    nouvelQte: "",
    resultatQte: 0,

    alert: true,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Code produit",
        align: "center",
        value: "codePro"
      },
      {
        align: "center",
        text: "Raison sociale",
        value: "raisonSoc"
      },
      {
        align: "center",
        text: "Quantité",
        value: "quantite"
      },
      {
        align: "center",
        text: "Date",
        value: "date"
      },
      {
        align: "center",
        text: "Prix",
        value: "prixUnitaire"
      },
      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    LigneProduits: [],
    editedIndex: -1,
    editedItem: {
      codePro: "",
      raisonSoc: "",
      quantite: "",
      date: "",
      prixUnitaire: ""
    },
    defaultItem: {
      codePro: "",
      raisonSoc: "",
      quantite: "",
      date: "",
      prixUnitaire: ""
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
    stock(stock) {
      this.qteVreifier = false;

      if (this.ancienQte > stock) {
        this.nouvelQte = this.ancienQte - stock;
        this.resultatQte = 1;
      } else {
        this.nouvelQte = stock - this.ancienQte;
        this.resultatQte = 2;
      }
      axios.get("http://localhost:8083/produits").then(res => {
        res.data.forEach(element => {
          if (element.codePro == this.editedItem.codePro) {
            this.quantiteStock = element.quantiteStock;
          }
          if (
            element.codePro == this.editedItem.codePro &&
            this.resultatQte == 2 &&
            this.nouvelQte > element.quantiteStock
          ) {
            this.qteVreifier = true;
            this.dialogQteStock = true;
          }
        });

        if (stock > this.quantiteStock) {
          this.qteVreifier = true;
          this.dialogQteStock = true;
        }
      });
    },
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
      this.ancienQte = item.quantite;
      this.date = item.date;
      this.ancienCodePro = item.codePro;
      this.ancienneRaisSoc = item.raisonSoc;
      this.editedIndex = this.LigneProduits.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.LigneProduits.indexOf(item);
      this.dialogDelete = false;
      var existe = false;
      axios.get("http://localhost:8083/tickets").then(tick => {
        tick.data.forEach(element => {
          if (
            element.raisonSoc == item.raisonSoc &&
            element.codePro == item.codePro
          ) {
            existe = true;
          }
        });
        if (existe == false) {
          axios.get("http://localhost:8083/produits").then(res => {
            res.data.forEach(element => {
              if (element.codePro == item.codePro) {
                element.quantiteStock = element.quantiteStock + item.quantite;
                axios.put(
                  "http://localhost:8083/produit/" + element.codePro,
                  element
                );
              }
            });
          });

          axios
            .delete(
              "http://localhost:8083/ligneProduits/" +
                item.codePro +
                "/" +
                item.raisonSoc +
                "/" +
                item.date
            )
            .then(Response => {
              console.log(Response);
            });
          this.LigneProduits.splice(index, 1);
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
    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    save() {
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          if (this.qteVreifier == false) {
            if (this.editedItem.raisonSoc != this.ancienneRaisSoc) {
              this.dialologAlertEdit1 = true;
            } else if (this.editedItem.codePro != this.ancienCodePro) {
              this.dialologAlertEdit2 = true;
            } else {
              //const postData={codePro:this.editedItem.codePro,raisonSoc:this.editedItem.raisonSoc,quantite:this.editedItem.quantite};
              axios
                .put(
                  "http://localhost:8083/ligneProduits/" +
                    this.editedItem.codePro +
                    "/" +
                    this.editedItem.raisonSoc +
                    "/" +
                    this.date +
                    "/" +
                    this.editedItem.quantite +
                    "/" +
                    this.editedItem.prixUnitaire
                )
                .then(() => {
                  Object.assign(
                    this.LigneProduits[this.editedIndex],
                    this.editedItem
                  );
                  this.resultatEdit = 1;
                  this.close();
                  this.$session.start();
                  this.$session.set("edit", 1);
                  location.reload();
                })
                .catch(() => {
                  this.resultatEdit = 0;
                });

              axios.get("http://localhost:8083/produits").then(res => {
                res.data.forEach(element => {
                  if (
                    element.codePro == this.editedItem.codePro &&
                    this.resultatQte == 1
                  ) {
                    element.quantiteStock =
                      element.quantiteStock + this.nouvelQte;
                    axios.put(
                      "http://localhost:8083/produit/" + element.codePro,
                      element
                    );
                  }
                  if (
                    element.codePro == this.editedItem.codePro &&
                    this.resultatQte == 2
                  ) {
                    element.quantiteStock =
                      element.quantiteStock - this.nouvelQte;
                    axios.put(
                      "http://localhost:8083/produit/" + element.codePro,
                      element
                    );
                  }
                });
              });
            }
          } else {
            this.dialogQteStock = true;
          }
        }
      } else {
        if (this.$refs.form.validate()) {
          if (this.qteVreifier == false) {
            const postData = {
              codePro: this.editedItem.codePro,
              raisonSoc: this.editedItem.raisonSoc,
              quantite: this.editedItem.quantite,
              prixUnitaire: this.editedItem.prixUnitaire,
              date: new Date()
                .toLocaleString()
                .toString()
                .replace(/\//g, "")
                .replace("à", "")
                .replace(/ /g, "")
                .replace(/:/g, "")
            };
            axios
              .post("http://localhost:8083/ligneProduit", postData)
              .then(Response => {
                if (Response.data.codePro != null) {
                  axios.get("http://localhost:8083/produits").then(res => {
                    res.data.forEach(element => {
                      if (element.codePro == Response.data.codePro) {
                        element.quantiteStock =
                          element.quantiteStock - Response.data.quantite;
                        axios.put(
                          "http://localhost:8083/produit/" + element.codePro,
                          element
                        );
                      }
                    });
                  });

                  this.resultatAdd = 1;
                  this.LigneProduits.push(this.editedItem);
                  (this.codePro = ""),
                    (this.raisonSoc = ""),
                    (this.quantite = ""),
                    (this.date = "");
                  this.close();
                  this.$session.start();
                  this.$session.set("add", 1);
                  location.reload();
                } else {
                  this.dialologAlertAdd = true;
                }
              });
          } else {
            this.dialogQteStock = true;
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
    axios.get("http://localhost:8083/ligneProduits").then(res => {
      this.LigneProduits = res.data;
    });

    axios.get("http://localhost:8083/produits").then(res => {
      console.log(res.data);
      res.data.forEach(element => {
        if (element.codePro != 0) this.items1.push(element.codePro);
      });
    });

    axios.get("http://localhost:8083/societes").then(res => {
      console.log(res.data);
      res.data.forEach(element => {
        if (element.raisonSoc != 0) this.items2.push(element.raisonSoc);
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
