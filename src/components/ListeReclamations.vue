<template>
  <v-app class="container" style="margin-top:45px">
    <div>
      <div id="menu" class="fixed-top">
        <div class="row" id="menuflo">
          <v-btn small flat color="gray" style="color:#33b5e5;">
            <span class="caption text-uppercase"
              >FRS | For Right Solutions
            </span>
          </v-btn>
          <v-btn
            small
            flat
            color="gray"
            style="color:#33b5e5;margin-left:780px"
          >
            <span class="caption text-lowercase">
              Bienvenu(e) {{ this.$session.get("nom") }}
              {{ this.$session.get("prenom") }}
            </span>
          </v-btn>
          <v-btn
            small
            flat
            color="gray"
            style="color:#33b5e5;margin-left:6px"
            @click="dialogchangerMotPass = true"
          >
            <span class="caption text-lowercase"> Changer mot de passe ? </span>
          </v-btn>
          <v-btn
            small
            flat
            color="gray"
            style="color:red ;margin-left:6px"
            @click="deconnexion"
          >
            <span class="caption text-lowercase"> Déconnexion </span>
          </v-btn>
        </div>
      </div>
      <v-btn
        href="AcceuilClient"
        small
        flat
        color="#33b5e5"
        style="color:white;"
      >
        <span class="caption text-uppercase">Accueil </span> </v-btn
      ><br /><br />
      <a @click="fermer">
        <div v-if="this.$session.get('add') == 1">
          <v-alert v-model="alert" dismissible dense text type="success">
            Votre mot de passe a été changer avec succès !
          </v-alert>
        </div>
      </a>
      <table>
        <tr>
          <td>
            <img
              :src="this.$session.get('prodImage')"
              alt=""
              width="480px"
              height="150px"
            />
          </td>
          <td><h2>Placez le service client au cœur de l'entreprise !</h2></td>
        </tr>
      </table>

      <br /><br />
      <v-card>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <h4 style="color:#4caf50">Nouvelle réclamation</h4>
                <br />
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="objet"
                    label="Objet réclamation *"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <div class="input-group">
                    <textarea
                      v-model="content"
                      name=""
                      class="form-control type_msg"
                      placeholder="Taper votre commentaire... *"
                    ></textarea>
                  </div>
                </v-col>
                <i style="color:red">Les champs avec * sont obligatoires</i>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="saveContent">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!--dialog alert-->

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color:red"
            >Veuillez remplir le champ commentaire !</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialogObjet" max-width="400">
        <v-card>
          <v-card-title class="headline" style="color:red"
            >Veuillez remplir le champ objet !</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogObjet = false">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-dialog
      v-model="dialogchangerMotPass"
      persistent="true"
      max-width="500px"
    >
      <v-card>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <h4 style="color:#4caf50">Changer mot de passe</h4>
                <br />
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="editedItem.nomUtil"
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
                    label="nouveau mot de passe *"
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
              </v-row>
            </v-container>
          </v-form>
          <i style="color:red">Les champs avec * sont obligatoires</i>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialogchangerMotPass = false"
            >Annuler</v-btn
          >
          <v-btn color="success" text @click="changerMotpass">Envoyer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="center">
      <v-dialog v-model="dialogAlertEdit2" max-width="500">
        <v-card>
          <v-card-title class="headline" v-model="titre" style="color:red">
            Vérifier votre nom d'utilisateur !</v-card-title
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
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  components: {},

  data() {
    return {
      nextCodeTicket: "",
      nextCodeCmtaire: "",
      dialogchangerMotPass: false,
      show3: false,
      show4: false,
      dialogAlertEdit2: false,
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
      htmlForEditor: "",
      objet: "",
      dialog: false,
      dialogObjet: false,
      content: "",

      editedItem: {
        nomUtil: "",
        motPass: "",
        confirm: ""
      }
    };
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
    axios.get("http://localhost:8083/tickets").then(res => {
      if (res.data.length != 0) {
        res.data.reduce((a, b) => (a.idTicket > b.idTicket ? 1 : -1));
        this.nextCodeTicket = res.data[res.data.length - 1].idTicket;
        this.nextCodeTicket =
          "R-0" + (parseInt(this.nextCodeTicket.split("-")[1]) + 1) + "-";
      } else {
        this.nextCodeTicket = "R-01";
      }
    });

    axios.get("http://localhost:8083/commentaires").then(Response => {
      if (Response.data.length != 0) {
        this.nextCodeCmtaire = Response.data[Response.data.length - 1].idComm;
        this.nextCodeCmtaire =
          "FRS-Commt-000" + (parseInt(this.nextCodeCmtaire.split("-")[2]) + 1);
      } else {
        this.nextCodeCmtaire = "FRS-Commt-0001";
      }
    });
  },
  watch() {},
  methods: {
    changerMotpass() {
      var existe = false;
      axios.get("http://localhost:8083/userComptes").then(comptes => {
        comptes.data.forEach(compte => {
          if (
            compte.nomUtil == this.editedItem.nomUtil &&
            this.editedItem.nomUtil == this.$session.get("nomUtil")
          ) {
            existe = true;
          }
        });
        if (existe == true) {
          axios.put(
            "http://localhost:8083/userCompte/" + this.editedItem.nomUtil,
            {
              nomUtil: this.editedItem.nomUtil,
              motpass: this.editedItem.motPass
            }
          );
          this.$session.start();
          this.$session.set("add", 1);
          location.reload();
        } else {
          this.dialogAlertEdit2 = true;
        }
      });
    },
    fermer() {
      this.$session.set("add", 0);
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },

    verifie() {
      return (
        this.editedItem.motPass === this.editedItem.confirm ||
        "Le mot de passe et la confirmation ne correspondent pas."
      );
    },
    deconnexion() {
      this.$session.destroy();
      location.replace("/");
    },
    saveContent: function() {
      // You have the content to save

      if (this.objet == "") {
        this.dialogObjet = true;
      } else if (this.content == "") {
        this.dialog = true;
      } else {
        axios
          .post("http://localhost:8083/ticket", {
            idTicket: this.nextCodeTicket + "~~" + this.$session.get("prodId"),
            objetTicket: this.objet,
            dateDebut: new Date(),
            codePro: this.$session.get("prodId"),
            raisonSoc: this.$session.get("raisonSocPro")
          })
          .then(Response => {
            this.$session.start();
            this.$session.set("objetTicket", this.objet);
            this.$session.set("idTicket", Response.data.idTicket);
            axios.post("http://localhost:8083/commentaire", {
              idComm: this.nextCodeCmtaire,
              desciptionComm: this.content,
              idTicket: Response.data.idTicket,
              auteur: this.$session.get("nomUtil"),
              dateComm: new Date()
            });
            location.replace("/StatsReclamation");
          });
      }
    }
  }
};
</script>
