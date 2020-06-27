<template>
  <v-app class="limiter">
    <div class="container-login100">
      <div class="wrap-login100">
        <div class="login100-pic js-tilt" data-tilt id="cf">
          <img
            class="bottom"
            width="400"
            height="400"
            src="../AuthClient/images/harous.jpg"
            alt="IMG"
          />
          <img
            class="top"
            width="400"
            height="400"
            src="../AuthClient/images/sitanb.jpg"
            alt="IMG"
          />
        </div>

        <form class="login100-form validate-form">
          <span class="login100-form-title" style="color:royalblue">
            For Right Solutions
          </span>

          <div class="wrap-input100 validate-input">
            <input
              class="input100 input"
              type="text"
              placeholder="Nom d'utilisateur"
              v-model="nomUtilCon"
              required
              pattern="[a-zA-Z0-9 ]{0,}[a-zA-Z]{2}[ -_.]?[ a-zA-Z0-9]+"
            />
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="fa fa-envelope" aria-hidden="true"></i>
            </span>
          </div>

          <div class="wrap-input100 validate-input">
            <input
              class="input100 input"
              type="password"
              v-model="motPass"
              required
              pattern="[a-zA-Z0-9 ]{0,}[a-zA-Z]{2}[ -_.]?[ a-zA-Z0-9]+"
              placeholder="Mot de passe"
            />
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="fa fa-lock" aria-hidden="true"></i>
            </span>
          </div>

          <div class="container-login100-form-btn">
            <button class="login100-form-btn" v-on:click="connexion">
              Connexion
            </button>
          </div>

          <div class="text-center p-t-12">
            <a
              class="txt2"
              style="color:royalblue"
              href="#"
              @click="dialogchangerMotPass = true"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <div class="text-center p-t-136">
            <a class="txt2" style="color:royalblue" href="/Enregistrement">
              S'inscrire
              <i class="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
            </a>
          </div>
          <div class="text-center">
            <a class="txt2" style="color:red" href="/">
              Accueil
              <i class="fa fa-home m-l-5" aria-hidden="true"></i>
            </a>
          </div>
        </form>
      </div>
    </div>

    <v-row justify="center">
      <v-dialog v-model="dialogDelete" persistent max-width="400">
        <v-card>
          <v-card-title class="headline" style="color:red"
            >Invalide
          </v-card-title>

          <v-card-text>
            Nom d'utilisateur ou mot de passe incorrect ! <br />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red" text @click="ferm">
              ok
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
      <v-dialog v-model="dialogAlertEdit1" persistent max-width="400">
        <v-card>
          <v-card-title class="headline" style="color:green"
            >Envoi
          </v-card-title>

          <v-card-text>
            Veuillez consulter votre email pour récuperer votre mot de passe !
            <br />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="dialogAlertEdit1 = false"
            >
              ok
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
  data: () => ({
    editedItem: {
      nomUtil: ""
    },
    dialogDelete: false,

    dialogchangerMotPass: false,
    dialogAlertEdit2: false,
    dialogAlertEdit1: false,
    show1: false,
    password: "Password",
    rules: {
      name: value =>
        /([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){3,30}/.test(value) | !value ||
        "Ce champ n'accepte que des lettres.",
      text: value =>
        /[a-zA-Z0-9 ]{0,}[a-zA-Z]{2}[ -_.]?[ a-zA-Z0-9]+/.test(value) |
          !value || "Ce champ n'accepte que des noms significatifs.",
      required: value => !!value || "ce champ est obligatoire.",
      min: v =>
        v.length > 12 ||
        "le numéro de téléphone doit avoir une longueur minimum de 13 chiffres",
      max: v => v.length < 14 || "Maximum 13 caractères",
      Email: v => /.+@.+\..+/.test(v) | v || "Email doit être valide.",
      minValue: value =>
        value >= 1 || "ce champ n'accepte pas de chiffe négatif."
    },
    resultatAdd: 3,
    resultatEdit: 3,
    resultatDelete: 3,
    motPass: "",
    nomUtilCon: ""
  }),
  mounted() {
    if (this.$session.get("err") == 1) {
      this.dialogDelete = true;
    }
  },
  methods: {
    ferm() {
      this.$session.set("err", 0);
      this.dialogDelete = false;
    },
    changerMotpass() {
      if (this.$refs.form.validate()) {
        var existe = false;
        var password = "";
        axios.get("http://localhost:8083/userComptes").then(comptes => {
          comptes.data.forEach(compte => {
            if (compte.nomUtil == this.editedItem.nomUtil) {
              existe = true;
              password = compte.motpass;
            }
          });
          if (existe == true) {
            axios.get("http://localhost:8083/inscriptions").then(Response => {
              Response.data.forEach(insc => {
                if (insc.nomUtil == this.editedItem.nomUtil) {
                  var corps = "Bonjour Mme, Mr " + insc.nom + " " + insc.prenom;
                  " Nom d'utilisateur : " +
                    compte.nomUtil +
                    " Mot de passe : " +
                    password +
                    " For Right Solutions Sfax Beb Bhar , Imm. BORJ KHALIFA B 404 – 3000 , Sfax Tél : 74 221 544 | Mobile : 52 591 855 +216 74 221 544 E-mail : contact@frsdev.com";
                  axios
                    .post(
                      "http://localhost:8083/mail/" +
                        insc.email +
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
                  /* this.$loadScript("http://smtpjs.com/v3/smtp.js").then(() => {
                    // Script was unloaded successfully
                    var corps =
                      '<html><center><img width="500" height="200" src="http://frsdev.com/media/logo.png"></center><p>Bonjour Mme, Mr ' +
                      insc.nom +
                      " " +
                      insc.prenom +
                      " !</p><p>Nom d'utilisateur:  <strong>" +
                      insc.nomUtil +
                      "</strong></p><p>Mot de passe: <strong>" +
                      password +
                      '</strong> </p><p>Cliquez <a target="_blank" href="http://localhost:8083">ici</a> pour vous connecter !</p><br><br><center>For Right Solutions Sfax <br>Beb Bhar , Imm. BORJ KHALIFA B 404 – 3000 , Sfax <br>Tél : 74 221 544 | Mobile : 52 591 855 +216 74 221 544 <br>E-mail : <a href="mailto:contact@frsdev.com">contact@frsdev.com</a> <br><br>For Right Solutions Tunis <br>Avenue Fattouma Bourguiba, 2036 , Soukra, Tunisie <br>Mobile : 28 911 011 <br>E-mail : <a href="mailto:contact@frsdev.com">contact@frsdev.com</a></center></html>';
                    Email.send({
                      Host: "smtp.gmail.com",
                      Username: "frsdev2011@gmail.com",
                      Password: "Frs.dev2011app",
                      To: insc.email,
                      From: "frsdev2011@gmail.com",
                      Subject: "Votre mot de passe ",
                      Body: corps
                    }).then(
                      (this.editedItem.nomUtil = ""),
                      (this.dialogchangerMotPass = false),
                      (this.dialogAlertEdit1 = true)
                    );
                  }); */
                }
              });
            });
          } else {
            this.dialogAlertEdit2 = true;
          }
        });
      }
    },
    fermer() {
      this.$session.set("add", 0);
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },
    connexion() {
      axios.get("http://localhost:8083/userComptes").then(res => {
        res.data.forEach(element => {
          if (
            element.nomUtil == this.nomUtilCon &&
            element.motpass == this.motPass
          ) {
            this.$session.start();
            this.$session.set("nomUtil", element.nomUtil);
            axios.get("http://localhost:8083/inscriptions").then(Response => {
              Response.data.forEach(insc => {
                if (insc.nomUtil == element.nomUtil) {
                  this.$session.set("raisonSoc", insc.societe);
                  this.$session.set("nom", insc.nom);
                  this.$session.set("prenom", insc.prenom);
                }
              });
            });
          }
        });
        if (this.$session.get("nomUtil") != null) {
          location.replace("/AcceuilClient");
        } else {
          this.$session.start();
          this.$session.set("err", 1);
        }
      });
    }
  }
};
</script>

<style>
#cf img {
  position: absolute;
  -webkit-transition: opacity 1s ease-in-out;
  -moz-transition: opacity 1s ease-in-out;
  -o-transition: opacity 1s ease-in-out;
  transition: opacity 1s ease-in-out;
}
@keyframes cf3FadeInOut {
  0% {
    opacity: 1;
  }
  45% {
    opacity: 1;
  }
  55% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
#cf img.top {
  animation-name: cf3FadeInOut;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 3s;
  animation-direction: alternate;
}
</style>
