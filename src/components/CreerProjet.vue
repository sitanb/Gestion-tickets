<template>
  <div class="content">
    <v-app id="inspire">
      <div>
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

        <center>
          <v-card max-width="600px">
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
                        v-model="editedItem.codeProjet"
                        disabled="true"
                        label="Code projet *"
                        :rules="[rules.required, rules.text]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="editedItem.code"
                        :rules="[rules.required]"
                        :items="items"
                        label="Equipe Maintenance *"
                      >
                      </v-select>
                    </v-col>
                    <i style="color:red">Les champs avec * sont obligatoires</i>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text>Annuler</v-btn>
              <v-btn color="success" text @click="save">Enregistrer</v-btn>
            </v-card-actions>
          </v-card>
        </center>
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
      required: value => !!value || "ce champ est obligatoire.",
      min: v => v.length > 12 || "Minimum 13 caractères",
      max: v => v.length < 14 || "Maximum 13 caractères",
      Email: v => /.+@.+\..+/.test(v) | v || "Email doit être valide."
    },
    nextCodeProjet: "",
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    datedebut: null,
    ancienCodeProjet: "",
    alert: true,
    dialog: false,
    dialogAlertEdit: false,
    dialogAlertAdd: false,
    search: "",
    items: [],

    projets: [],
    editedIndex: -1,
    editedItem: {
      codeProjet: "",
      dateDebutprojet: "",
      dateFinProjet: "",
      code: ""
    },
    defaultItem: {
      codeProjet: ""
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

    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    editItem(item) {
      this.ancienCodeProjet = item.codeProjet;
      this.datedebut = item.dateDebutprojet;
      this.editedIndex = this.projets.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    },
    finaliser(item) {
      item.etatProjet = "finalisé";
      item.dateFinProjet = new Date();
      axios.put("http://localhost:8083/projet/" + item.codeProjet, item);
      location.reload();
    },
    /*  affecter(item){
         this.$session.start()
         this.$session.set('projet', item.codeProjet)
         location.replace('/AffecterTickets')
    }, */
    deleteItem(item) {
      const index = this.projets.indexOf(item);
      this.dialogDelete = false;

      axios
        .delete("http://localhost:8083/projet/" + item.codeProjet)
        .then(Response => {
          console.log(Response);
        });
      this.projets.splice(index, 1);
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
    },

    save() {
      if (this.$refs.form.validate()) {
        this.postData = {
          codeProjet:
            this.editedItem.codeProjet + this.editedItem.code.split("-")[2],
          etatProjet: "en cours",
          dateDebutprojet: new Date(),
          idTicket: this.$session.get("idTicletProjet"),
          code: this.editedItem.code
        };

        axios
          .post("http://localhost:8083/projet", this.postData)
          .then(projet => {
            if (projet.data.codeProjet != null) {
              axios
                .get("http://localhost:8083/equipeMaintenances")
                .then(Response => {
                  Response.data.forEach(element => {
                    if (element.code == projet.data.code) {
                      axios.post("http://localhost:8083/notification", {
                        etatNotification: "non-lu",
                        idAss: element.chef,
                        codeProjet: projet.data.codeProjet,
                        descriptionNotification:
                          "* Votre équipe a été affectée à un nouveau projet * code : " +
                          "<strong>" +
                          projet.data.codeProjet +
                          "</strong>"
                      });
                    }
                  });
                });

              console.log(Response.data);
              this.resultatAdd = 1;
              this.projets.push(this.editedItem);
              (this.codeProjet = ""), this.close();
              this.$session.start();
              this.$session.set("add", 1);
              location.replace("/ListeProjets");
            } else {
              this.dialogAlertAdd = true;
            }
          });
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
    axios.get("http://localhost:8083/projets").then(res => {
      this.projets = res.data;

      if (res.data != 0) {
        res.data.sort((a, b) =>
          a.dateDebutprojet > b.dateDebutprojet ? 1 : -1
        );
        this.nextCodeProjet = res.data[res.data.length - 1].codeProjet;
        this.editedItem.codeProjet =
          "Pro-0" + (parseInt(this.nextCodeProjet.split("-")[1]) + 1);
      } else {
        this.editedItem.codeProjet = "Pro-01-";
      }
    });
    axios.get("http://localhost:8083/equipeMaintenances").then(res => {
      res.data.forEach(element => {
        this.items.push(element.code);
      });
    });
  }
};
</script>

<style>
#boutton {
  height: 27px;
}
</style>
