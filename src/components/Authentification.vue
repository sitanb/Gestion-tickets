<template>
  <v-app>
    <!-- Entete -->
    <div>
      <div id="menu" class="fixed-top">
        <div class="row" id="menuflo">
          <div class="col-sm-12"></div>
        </div>
      </div>
      <nav
        class="navbar navbar-expand-lg fixed-top bg-light navbar-light"
        id="entete"
      >
        <!-- Brand/logo -->
        <a class="navbar-brand" href="#">
          <img src="../assets/FRS.png" alt="" id="imgauth" />
        </a>
      </nav>

      <div id="auth">
        <center>
          <table>
            <tr>
              <br /><br />
              <td style="width:700px" id="colo">Authentification</td>
            </tr>
          </table>

          <br />
          <img
            style=""
            src="../assets/login.png"
            class="rounded-circle"
            width="150"
            height="150"
          /><img />
          <br />
          <br />
          <a @click="fermer">
            <div v-if="this.$session.get('erreur') == 0">
              <v-alert v-model="alert" dismissible dense text type="error">
                Le nom d'utilisateur ou le mot de passe
                <strong>saisit </strong> est
                <strong> incorrect, veuillez réessayer </strong>!
              </v-alert>
            </div>
          </a>
          <table>
            <tr>
              <td>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text"
                      ><icon name="user"></icon
                    ></span>
                  </div>
                  <input
                    id="inpu"
                    v-model="nomUtil"
                    type="text"
                    class="form-control"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
              </td>
            </tr>
          </table>

          <br />
          <table>
            <tr>
              <td>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text"
                      ><icon name="lock"></icon
                    ></span>
                  </div>
                  <input
                    id="inpu"
                    type="password"
                    class="form-control"
                    v-model="motPass"
                    placeholder="Mot de passe"
                    required
                  />
                </div>
              </td>

              <td></td>
            </tr>
          </table>

          <a style="color:blue" @click="dialogchangerMotPass = true"
            >Mot de passe oublié ?</a
          >
          <br />
          <br />
          <i style="padding-left:6px"
            ><button
              @click="connexion"
              type="submit"
              id="colo"
              class="btn btn-primary"
              style="width:200px"
            >
              Connexion
            </button></i
          >
        </center>
      </div>
    </div>

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
                <h4 style="color:#4caf50">Mot de passe oublié</h4>
                <br />
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="editedItem.nomUtil"
                    label="Nom d'utilisateur *"
                    :rules="[rules.required, rules.text]"
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
      <v-dialog v-model="dialogAlertEdit1" max-width="800">
        <v-card>
          <v-card-title class="headline" v-model="titre" style="color:green">
            Veuillez consulter votre email pour récuperer votre mot de passe
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
  </v-app>
</template>
<script src="./assets/smtp.js"></script>
<script>
import axios from "axios";
export default {
  name: "Authentification",
  data: () => ({
    editedItem: {
      nomUtil: ""
    },

    dialogchangerMotPass: false,
    dialogAlertEdit2: false,
    dialogAlertEdit1: false,
    show1: false,
    password: "Password",
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
      Email: v => /.+@.+\..+/.test(v) | v || "Email doit être valide.",
      minValue: value =>
        value >= 1 || "ce champ n'accepte pas de chiffe négatif."
    },
    nomUtil: "",
    motPass: "",
    nom: "",
    alert: true
  }),
  mounted() {
    this.$session.set("erreur", 1);
  },
  methods: {
    changerMotpass() {
      var existe = false;
      var password = "";
      axios.get("http://localhost:8083/utilisateurs").then(comptes => {
        comptes.data.forEach(compte => {
          if (compte.nomUtil == this.editedItem.nomUtil) {
            existe = true;
            password = compte.motPass;
            var corps =
              "Bonjour Mme, Mr " +
              compte.nom +
              " " +
              compte.prenom +
              " Nom d'utilisateur : " +
              compte.nomUtil +
              " Mot de passe : " +
              password +
              " For Right Solutions Sfax Beb Bhar , Imm. BORJ KHALIFA B 404 – 3000 , Sfax Tél : 74 221 544 | Mobile : 52 591 855 +216 74 221 544 E-mail : contact@frsdev.com";
            axios
              .post(
                "http://localhost:8083/mail/" +
                  compte.email +
                  "/" +
                  "frsdev2011@gmail.com" +
                  "/" +
                  "Votre mot de passe " +
                  "/" +
                  corps
              )
              .then(() => {
                (this.editedItem.nomUtil = ""),
                  (this.dialogchangerMotPass = false),
                  (this.dialogAlertEdit1 = true);
              });
            /*   this.$loadScript("https://smtpjs.com/v3/smtp.js").then(() => {
              // Script was unloaded successfully
              var corps =
                '<html><center><img width="500" height="200" src="https://frsdev.com/media/logo.png"></center><p>Bonjour Mme, Mr ' +
                compte.nom +
                " " +
                compte.prenom +
                " !</p><p>Nom d'utilisateur:  <strong>" +
                compte.nomUtil +
                "</strong></p><p>Mot de passe: <strong>" +
                password +
                '</strong> </p><p>Cliquez <a target="_blank" href="http://localhost:8084">ici</a> pour vous connecter !</p><br><br><center>For Right Solutions Sfax <br>Beb Bhar , Imm. BORJ KHALIFA B 404 – 3000 , Sfax <br>Tél : 74 221 544 | Mobile : 52 591 855 +216 74 221 544 <br>E-mail : <a href="mailto:contact@frsdev.com">contact@frsdev.com</a> <br><br>For Right Solutions Tunis <br>Avenue Fattouma Bourguiba, 2036 , Soukra, Tunisie <br>Mobile : 28 911 011 <br>E-mail : <a href="mailto:contact@frsdev.com">contact@frsdev.com</a></center></html>';
              Email.send({
                Host: "smtp.gmail.com",
                Username: "frsdev2011@gmail.com",
                Password: "Frs.dev2011app",
                From: "frsdev2011@gmail.com",
                To: compte.email,
               , Subject: "Votre mot de passe "
                Body: corps
              }).then(
                (this.editedItem.nomUtil = ""),
                (this.dialogchangerMotPass = false),
                (this.dialogAlertEdit1 = true)
              );
            }); */
          }
        });
        if (existe == true) {
          this.dialogAlertEdit2 = true;
        }
      });
    },
    fermer() {
      this.$session.set("erreur", 1);
    },

    connexion() {
      axios.get("http://localhost:8083/utilisateurs").then(res => {
        res.data.forEach(element => {
          if (
            this.nomUtil == element.nomUtil &&
            this.motPass == element.motPass
          ) {
            (this.nomUtil = element.nomUtil), (this.motPass = element.motPass);
            if (element.groupe == "Administrateur") {
              this.$session.start();
              this.$session.set("nomUtil", this.nomUtil);

              this.$session.set("nom", element.nom);
              this.$session.set("prenom", element.prenom);
              location.replace("/AccueilAdmin");
            }
            if (element.groupe == "Commercial") {
              this.$session.start();
              this.$session.set("nomUtil", this.nomUtil);

              this.$session.set("nom", element.nom);
              this.$session.set("prenom", element.prenom);
              location.replace("/AccueilCommercial");
            }
            if (element.groupe == "Chef personnel") {
              this.$session.start();
              this.$session.set("nomUtil", this.nomUtil);

              this.$session.set("nom", element.nom);
              this.$session.set("prenom", element.prenom);
              location.replace("/AccueilChefPers");
            }

            if (element.groupe == "Assistant technique") {
              this.$session.start();
              this.$session.set("nomUtil", this.nomUtil);
              this.$session.set("idAssCnx", element.idAss);
              this.$session.set("nom", element.nom);
              this.$session.set("prenom", element.prenom);
              location.replace("/AccueilAssChef");
            }

            if (element.groupe == "Chef assistant technique") {
              this.$session.start();
              this.$session.set("nomUtil", this.nomUtil);
              this.$session.set("chef", "chef");
              this.$session.set("idAssCnx", element.idAss);
              this.$session.set("nom", element.nom);
              this.$session.set("prenom", element.prenom);
              axios
                .get("http://localhost:8083/equipeMaintenances")
                .then(res => {
                  res.data.forEach(equip => {
                    if (equip.chef == element.idAss) {
                      this.$session.set("codeEquipe", equip.code);
                    }
                  });
                });
              location.replace("/AccueilAssChef");
            }
          }
        });
      });

      this.$session.start();
      this.$session.set("erreur", 0);
      location.reload();
    }
  }
};
</script>

<style>
#colo {
  background-color: steelblue;
  text-align: center;
  color: #e8e8e8;
}
#entete {
  background-color: #e8e8e8 !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  position: fixed;
  top: 35px;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
  height: 90px;
  z-index: 9999;
}
#imgauth {
  width: 300px;
  margin-left: 530px;
  max-width: 100%;
  line-height: 0;
  height: auto;
}

#menu {
  height: 35px;
  width: 100%;
  border-bottom: solid 0.1px;
  border-bottom-color: #e8e8e8;
  background-color: #e8e8e8;
}
#menuflo {
  float: right;
}
#btn {
  margin-top: 30px;
  margin-left: 5px;
  height: 30px;
  width: 120px;
  padding: 0px;
  background-color: dodgerblue;
}
#inpu {
  border-bottom: none;
}
#auth {
  margin-top: 170px;
  width: 600px;
  height: 560px;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-left: 30%;
}
</style>
