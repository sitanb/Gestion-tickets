<template>
  <div class="content">
    <v-app>
      <div>
        <div>
          <!-- Pour ajout -->
          <a @click="fermer">
            <div v-if="this.$session.get('add') == 1">
              <v-alert v-model="alert" dismissible dense text type="success">
                L'assistant a été affecté(e) au projet avec succès. Voir projet
                pour vérifier !
              </v-alert>
            </div>
          </a>

          <a @click="fermer">
            <div v-if="this.$session.get('add') == 2">
              <v-alert v-model="alert" dismissible dense text type="success">
                Le compte rendu a été crée avec succès !
              </v-alert>
            </div>
          </a>

          <a @click="fermer">
            <div v-if="this.$session.get('deselectionner') == 0">
              <v-alert v-model="alert" dismissible dense text type="success">
                L'assistant a été désaffecté avec succès. Voir projet pour
                consulter !
              </v-alert>
            </div>
          </a>

          <!-- Pour modification -->
          <a @click="fermer">
            <div v-if="$session.get('edit') == 1">
              <v-alert v-model="alert" dismissible dense text type="success">
                Le projet a été <strong>finalisé </strong> avec
                <strong> succès </strong>!
              </v-alert>
            </div>
          </a>

          <!-- Pour suprression -->
          <a @click="fermer">
            <div v-if="this.$session.get('delete') == 1">
              <v-alert v-model="alert" dismissible dense text type="success">
                L'assistant a été <strong>désaffecté(e) </strong> avec
                <strong> succès </strong>!
              </v-alert>
            </div>
          </a>

          <v-data-table
            :no-results-text="resSearch"
            :no-data-text="text"
            :headers="headers"
            :search="search"
            :items="Affectations"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            sort-by="idTicket"
            class="elevation-4"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title style="color:#33b5e5"
                  >Mes réclamations</v-toolbar-title
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
                            <v-col cols="12" sm="12">
                              <h4 style="color:#4caf50">
                                Nouveau compte rendu
                              </h4>
                              <br />
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="editedItem.objetCompteRendu"
                                label="ObjetCompteRendu *"
                                :rules="rules"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="editedItem.auteur"
                                label="Auteur *"
                                :rules="rules"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-textarea
                                v-model="editedItem.libelle"
                                label="Libelle *"
                                :rules="rules"
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
                      <v-btn color="success" text @click="EnregistrerCpteRendu"
                        >Enregistrer</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.nomLang="{ item }">
              <v-btn
                @click="afficherLang(item)"
                id="boutton"
                tile
                outlined
                color="#4caf50"
                ><v-icon left>mdi-eye</v-icon> Afficher</v-btn
              >
            </template>
            <template v-slot:item.dejaFinaliser="{}"> </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                style="margin-right:20px"
                @click="VoirProjet(item)"
                id="boutton"
                tile
                outlined
                color="#4caf50"
                ><v-icon left>mdi-eye</v-icon> voir projet</v-btn
              >
              <v-btn
                style="margin-right:20px"
                @click="afficherCommentaires(item)"
                id="boutton"
                tile
                outlined
                color="#4caf50"
                ><v-icon left>mdi-eye</v-icon> Commentaires</v-btn
              >
              <v-btn
                @click="voirAssistant(item)"
                id="boutton"
                style="margin-right:20px"
                tile
                outlined
                color="#4caf50"
                ><v-icon left>mdi-eye</v-icon> Affecter</v-btn
              >
              <v-btn
                v-if="item.dejaFinaliser == null"
                @click="finaliser(item)"
                id="boutton"
                tile
                outlined
                color="#33b5e5"
              >
                Finaliser</v-btn
              >
              <v-btn
                v-else-if="item.dejaFinaliser == 'compteRendudejaCreer'"
                @click="voirCpteRendu(item)"
                id="boutton"
                tile
                outlined
                color="#33b5e5"
              >
                Voir compte rendu</v-btn
              >
              <v-btn
                v-else
                @click="creerCpteRendu(item)"
                id="boutton"
                tile
                outlined
                color="#33b5e5"
              >
                Créer compte rendu</v-btn
              >
            </template>
            <template v-slot:item.existe> </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination
              v-model="page"
              circle
              :length="pageCount"
            ></v-pagination>
          </div>
          <div v-if="this.nombreSurTicket != 0">
            <br /><br />
            <h3 style="text-align:center;color:#33b5e5">
              Demandes de participation
            </h3>
            <v-data-table
              :no-results-text="resSearch"
              :no-data-text="text"
              :headers="headersSurTicket"
              :search="search"
              :items="surTicket"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              @page-count="pageCount = $event"
              sort-by="idTicket"
              class="elevation-4"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title style="color:#33b5e5"
                    >Invitations</v-toolbar-title
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
                </v-toolbar>
              </template>
              <template v-slot:item.nomLang="{ item }">
                <v-btn
                  @click="afficherLang(item)"
                  id="boutton"
                  tile
                  outlined
                  color="#4caf50"
                  ><v-icon left>mdi-eye</v-icon> Afficher</v-btn
                >
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  style="margin-right:20px"
                  @click="VoirProjet(item)"
                  id="boutton"
                  tile
                  outlined
                  color="#4caf50"
                  ><v-icon left>mdi-eye</v-icon> voir projet</v-btn
                >
                <v-btn
                  style="margin-right:20px"
                  @click="afficherCommentaires(item)"
                  id="boutton"
                  tile
                  outlined
                  color="#4caf50"
                  ><v-icon left>mdi-eye</v-icon> Commentaires</v-btn
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

        <!--dialog alert-->
        <v-row justify="center">
          <v-dialog v-model="dialogAlertVoirCpteRendu" max-width="1010">
            <v-card>
              <br />
              <div class="div1">
                <div class="div2">
                  <div class="div3">
                    <h5>
                      Equipe : <i>{{ this.seeProjet.code }}</i>
                    </h5>
                    <h5>
                      Rédigé par l'assistant :
                      <i>{{ this.seeCpteRendu.auteur }}</i>
                    </h5>
                    <h5>
                      Date : <i>{{ this.seeCpteRendu.date }}</i>
                    </h5>
                  </div>
                </div>
                <h3 style="text-align: center;">
                  Compte rendu du projet - {{ this.seeCpteRendu.codeProjet }}
                </h3>
              </div>
              <br />
              <table class="tableau">
                <tr class="trr">
                  <td>
                    <h5>
                      Objet : <i>{{ this.seeCpteRendu.objetCompteRendu }}</i>
                    </h5>
                  </td>
                </tr>
              </table>

              <h3 style="text-align: center;">Description</h3>
              <div style="height:100px;overflow:auto">
                <table class="tableau" style="height:100px">
                  <tr class="trr">
                    <td>
                      {{ this.seeCpteRendu.libelle }}
                    </td>
                  </tr>
                </table>
              </div>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialogAlertVoirCpteRendu = false"
                >
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <v-row justify="center">
          <v-dialog v-model="dialogAlertVoirProjet" max-width="500">
            <v-card style="text-align:center">
              <v-card-title class="headline" v-model="titre">
                <center>
                  Projet : {{ seeProjet.codeProjet }}<br />
                  Réclamation : {{ seeProjet.idTicket }}<br />
                  Chef Equipe : {{ seeProjet.code }}<br />
                  Assistant affecté : {{ seeProjet.idAss }}<br />
                  Etat : {{ seeProjet.etatProjet }}<br />
                  Date Debut : {{ seeProjet.dateDebutprojet }}<br />
                  Date Fin : {{ seeProjet.dateFinProjet }}
                </center>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialogAlertVoirProjet = false"
                >
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <v-row justify="center">
          <v-dialog v-model="dialogAlert" max-width="500">
            <v-card style="text-align:center">
              <v-card-title class="headline" v-model="titre">
                <center>
                  Code : {{ codeLang }}<br />
                  Nom : {{ nomLang }}<br />
                  Description : {{ descLang }}
                </center>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialogAlert = false">
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <v-row justify="center" class="container">
          <v-dialog v-model="dialogAlertAssistant">
            <v-card style="text-align:center">
              <v-data-table
                :no-results-text="resSearch"
                :no-data-text="text"
                :headers="headersAssistant"
                :search="searchAssist"
                :items="ListeAssistantSubordonnees"
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
                      >Affectations</v-toolbar-title
                    >
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field
                      v-model="searchAssist"
                      append-icon="mdi-magnify"
                      label="Rechercher"
                      single-line
                      hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </template>
                <template v-slot:item.dejaAffecter="{}"> </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    v-if="item.dejaAffecter != null"
                    @click="deselectionnerAssist(item)"
                    id="boutton"
                    tile
                    outlined
                    color="#4caf50"
                    ><v-icon left>mdi-pencil</v-icon> Desélectionner</v-btn
                  >
                  <v-btn
                    v-else
                    @click="selectionnerAssist(item)"
                    id="boutton"
                    tile
                    outlined
                    color="#4caf50"
                    ><v-icon left>mdi-pencil</v-icon> Sélectionner</v-btn
                  >
                </template>
                <template v-slot:item.existe> </template>
              </v-data-table>
              <div class="text-center pt-2">
                <v-pagination
                  v-model="page"
                  circle
                  :length="pageCount"
                ></v-pagination>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialogAlertAssistantFermer"
                >
                  Ok
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
    itemsPerPage: 5,
    nombreSurTicket: 0,
    surTicket: [],
    rules: [value => !!value || "Ce champ est obligatoire !"],
    nextCodeCpteRendu: "",
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    dialogAlertVoirProjet: false,
    dialogAlertAssistant: false,
    alert: true,
    dialogAlertVoirCpteRendu: false,
    dialog: false,
    dialogAlert: false,
    text: "Un projet a été créé pour tous les tickets !",
    resSearch: "Aucun élément n'a été trouvé !",
    titre: "",
    search: "",
    projetAAffecter: "",
    searchAssist: "",
    codeLang: "",
    CodeAssistantProjet: "",
    nomLang: "",
    descLang: "",
    dejaAffecter: 0,
    seeProjet: [],
    seeCpteRendu: [],
    ListeAssistantSubordonnees: [],
    headers: [
      {
        text: "Réclamation",
        align: "center",
        value: "idTicket",
        width: 126
      },
      {
        align: "center",
        text: "Objet réclamation",
        value: "objetTicket",
        width: 126
      },
      {
        align: "center",
        text: "Produit",
        value: "codePro",
        width: 126
      },
      {
        align: "center",
        text: "Langage développement",
        value: "nomLang"
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: 800
      },
      {
        value: "dejaFinaliser",
        width: 0
      }
    ],

    headersSurTicket: [
      {
        text: "Réclamation",
        align: "center",
        value: "idTicket"
      },
      {
        align: "center",
        text: "Objet réclamation",
        value: "objetTicket"
      },
      {
        align: "center",
        text: "Produit",
        value: "codePro"
      },
      {
        align: "center",
        text: "Langage développement",
        value: "nomLang"
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center"
      }
    ],

    headersAssistant: [
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
        value: "dejaAffecter",
        width: 0
      },

      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],

    Affectations: [],
    listeSurAffect: [],
    editedIndex: -1,
    editedItem: {
      objetCompteRendu: "",
      libelle: "",
      auteur: ""
    },
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
    voirCpteRendu(item) {
      axios.get("http://localhost:8083/projets").then(projet => {
        projet.data.forEach(element => {
          if (item.idTicket == element.idTicket) {
            this.seeProjet = element;
            axios.get("http://localhost:8083/compteRendus").then(projet => {
              projet.data.forEach(element => {
                if (element.codeProjet == this.seeProjet.codeProjet) {
                  this.seeCpteRendu = element;
                }
              });
            });
          }
        });
      });

      this.dialogAlertVoirCpteRendu = true;
    },
    dialogAlertAssistantFermer() {
      this.dialogAlertAssistant = false;
      location.reload();
    },

    creerCpteRendu(item) {
      axios.get("http://localhost:8083/projets").then(projet => {
        projet.data.forEach(element => {
          if (item.idTicket == element.idTicket) {
            this.CodeProjetAAffecter = element.codeProjet;
          }
        });
      });
      this.editedItem.auteur =
        this.$session.get("nom") + " " + this.$session.get("prenom");
      this.dialog = true;
    },
    finaliser(item) {
      axios.get("http://localhost:8083/projets").then(projet => {
        projet.data.forEach(element => {
          if (element.idTicket == item.idTicket) {
            element.etatProjet = "finalisé";
            element.dateFinProjet = new Date();
            axios.put(
              "http://localhost:8083/projet/" + element.codeProjet,
              element
            );
            this.$session.start(), this.$session.set("edit", 1);
            location.reload();
          }
        });
      });
    },
    selectionnerAssist(item) {
      axios.get("http://localhost:8083/projets").then(projet => {
        projet.data.forEach(element => {
          if (this.CodeProjetAAffecter == element.codeProjet) {
            axios.post("http://localhost:8083/surAffectation", {
              idAss: item.idAss,
              codeProjet: element.codeProjet
            });
            axios
              .post("http://localhost:8083/notification", {
                etatNotification: "non-lu",
                idAss: item.idAss,
                codeProjet: element.codeProjet,
                descriptionNotification:
                  "* Vous avez été affecté(e) par un autre assistant au projet * code : " +
                  "<strong>" +
                  element.codeProjet +
                  "</strong>"
              })
              .then(projet => {
                this.$session.start(), this.$session.set("add", 1);
                location.reload();
              });
          }
        });
      });
    },

    EnregistrerCpteRendu() {
      if (this.$refs.form.validate()) {
        const postData = {
          idCompteRendu: this.nextCodeCpteRendu + this.CodeProjetAAffecter,
          auteur: this.editedItem.auteur,
          objetCompteRendu: this.editedItem.objetCompteRendu,
          libelle: this.editedItem.libelle,
          date: new Date(),
          codeProjet: this.CodeProjetAAffecter
        };
        axios.post("http://localhost:8083/compteRendu", postData).then(cpt => {
          axios.get("http://localhost:8083/projets").then(pro => {
            axios.get("http://localhost:8083/equipeMaintenances").then(equi => {
              pro.data.forEach(p => {
                if (cpt.data.codeProjet == p.codeProjet) {
                  equi.data.forEach(el => {
                    if (p.code == el.code) {
                      axios.post("http://localhost:8083/notification", {
                        etatNotification: "non-lu",
                        idAss: el.chef,
                        codeProjet: cpt.data.codeProjet,
                        descriptionNotification:
                          "L'assistant : <strong> " +
                          p.idAss +
                          "</strong> a écris un compte rendu sur le projet : <strong> " +
                          cpt.data.codeProjet +
                          "</strong>"
                      });
                      this.$session.start(), this.$session.set("add", 2);
                      location.reload();
                    }
                  });
                }
              });
            });
          });
        });
      }
    },
    afficherCommentaires(item) {
      this.$session.start();
      this.$session.set("objetTicket", item.objetTicket);
      this.$session.set("idTicket", item.idTicket);
      location.replace("/ListeCommentaires");
    },
    voirAssistant(item) {
      this.ListeAssistantSubordonnees = [];
      axios.get("http://localhost:8083/projets").then(projet => {
        projet.data.forEach(element => {
          if (item.idTicket == element.idTicket) {
            this.CodeProjetAAffecter = element.codeProjet;
          }
        });
      });

      axios.get("http://localhost:8083/surAffectations").then(surAff => {
        this.listeSurAffect = surAff.data;
      });
      var chef = "";
      var assist = "";
      axios.get("http://localhost:8083/assistantTechniques").then(res => {
        res.data.forEach(element => {
          if (element.idAss == this.$session.get("idAssCnx")) {
            chef = element.chef;
            assist = element.idAss;
            res.data.forEach(element1 => {
              if (element1.chef == chef && element1.idAss != assist) {
                axios
                  .get("http://localhost:8083/assistantTechniques")
                  .then(ass => {
                    ass.data.forEach(el => {
                      if (element1.idAss == el.idAss) {
                        this.listeSurAffect.forEach(surAff => {
                          if (
                            element1.idAss == surAff.idAss &&
                            surAff.codeProjet == this.CodeProjetAAffecter
                          ) {
                            element1.dejaAffecter = "affecter";
                          }
                        });
                        this.ListeAssistantSubordonnees.push(element1);
                      }
                    });
                  });
              }
            });
          }
        });
      });

      this.dialogAlertAssistant = true;
    },
    deselectionnerAssist(item) {
      axios.get("http://localhost:8083/surAffectations").then(projet => {
        projet.data.forEach(element => {
          if (
            item.idAss == element.idAss &&
            this.CodeProjetAAffecter == element.codeProjet
          ) {
            axios.delete(
              "http://localhost:8083/surAffectations/" +
                element.idAss +
                "/" +
                element.codeProjet
            );
            this.$session.start(), this.$session.set("delete", 1);
            location.reload();
          }
        });
      });
    },

    VoirProjet(item) {
      axios.get("http://localhost:8083/projets").then(projet => {
        projet.data.forEach(element => {
          if (item.idTicket == element.idTicket) {
            this.seeProjet = element;
            this.seeProjet.dateDebutprojet = element.dateDebutprojet
              .toString()
              .split("T")[0];
            if (this.seeProjet.dateFinProjet != null) {
              this.seeProjet.dateFinProjet = element.dateFinProjet
                .toString()
                .split("T")[0];
            }

            if (this.seeProjet.dateFinProjet == null) {
              this.seeProjet.dateFinProjet = "-";
            }
          }
        });
        this.dialogAlertVoirProjet = true;
      });
    },
    afficherLang(item) {
      axios.get("http://localhost:8083/produits").then(prod => {
        prod.data.forEach(element => {
          if (item.codePro == element.codePro) {
            axios.get("http://localhost:8083/langageDevs").then(lang => {
              lang.data.forEach(l => {
                if (l.codeLang == element.langage) {
                  this.codeLang = l.codeLang;
                  this.nomLang = l.nomLang;
                  this.descLang = l.descriptionLang;
                  this.dialogAlert = true;
                }
              });
            });
          }
        });
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
    creer(item) {
      this.$session.start();
      this.$session.set("idTicletProjet", item.idTicket);
      location.replace("/CreerProjet");
    }
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
    this.$session.start(), this.$session.set("deselectionner", null);
    var exist = false;
    var final = false;

    axios.get("http://localhost:8083/tickets").then(ticket => {
      axios.get("http://localhost:8083/projets").then(projet => {
        ticket.data.forEach(t => {
          exist = false;
          projet.data.forEach(p => {
            if (
              t.idTicket == p.idTicket &&
              p.idAss == this.$session.get("idAssCnx")
            ) {
              exist = true;
              if (p.etatProjet == "finalisé") {
                final = true;
              }

              axios
                .get("http://localhost:8083/compteRendus")
                .then(compteRendu => {
                  compteRendu.data.forEach(cpte => {
                    if (cpte.codeProjet == p.codeProjet) {
                      t.dejaFinaliser = "compteRendudejaCreer";
                    }
                  });
                });
            }
          });
          if (exist == true) {
            if (final == true) {
              t.dejaFinaliser = "finalisé";
            }
            this.Affectations.push(t);
          }
        });
      });
    });

    axios.get("http://localhost:8083/surAffectations").then(suraff => {
      axios.get("http://localhost:8083/tickets").then(ticket => {
        axios.get("http://localhost:8083/projets").then(projet => {
          suraff.data.forEach(element => {
            if (element.idAss == this.$session.get("idAssCnx")) {
              projet.data.forEach(proj => {
                if (
                  element.codeProjet == proj.codeProjet &&
                  proj.etatProjet != "finalisé"
                ) {
                  ticket.data.forEach(tick => {
                    if (tick.idTicket == proj.idTicket) {
                      this.nombreSurTicket += 1;
                      this.surTicket.push(tick);
                    }
                  });
                }
              });
            }
          });
        });
      });
    });
  },
  created() {
    axios.get("http://localhost:8083/compteRendus").then(res => {
      if (res.data.length != 0) {
        res.data.reduce((a, b) => (a.idCompteRendu > b.idCompteRendu ? 1 : -1));
        this.nextCodeCpteRendu = res.data[res.data.length - 1].idCompteRendu;
        this.nextCodeCpteRendu =
          "CRendu-0" +
          (parseInt(this.nextCodeCpteRendu.split("-")[1]) + 1) +
          "-";
      } else {
        this.nextCodeCpteRendu = "CRendu-01-";
      }
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

.tableau {
  border: 1px solid black;
  margin-left: 10px;
  width: 990px;
}
.trr {
  border: 1px solid black;
  margin-left: 10px;
  width: 990px;
}
.div1 {
  border: solid 1px;
  width: 990px;
  margin-left: 10px;
}
.div2 {
  margin: 10px;
  border: solid 1px;
  width: 500px;
}

.div3 {
  margin-left: 10px;
}
</style>
