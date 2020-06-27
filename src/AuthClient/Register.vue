<template>
  <v-app>
    <div class="wrapperRe">
      <div class="inner">
        <form class="form">
          <h3 style="color:royalblue">For Right Solutions</h3>
          <h5>
            Inscription
            <a class="txt2" style="color:red;padding-left:200px" href="/">
              Accueil
              <i class="fa fa-home m-l-5" aria-hidden="true"></i>
            </a>
          </h5>
          <br />

          <div class="form-group">
            <div class="form-wrapper">
              <labelf for="">Nom *</labelf>
              <input
                v-model="nom"
                type="text"
                class="form-controlRegister"
                required
                pattern="[A-Z][a-z]{2,30}"
                title="Ce champ n'accepte que des lettres."
              />
            </div>
            <div class="form-wrapper">
              <labelf for="">Prénom *</labelf>
              <input
                v-model="prenom"
                type="text"
                class="form-controlRegister"
                required
                pattern="[A-Z][a-z]{2,30}([ ][A-Z][a-z]{2,30})*"
                title="Ce champ n'accepte que des lettres."
              />
            </div>
          </div>
          <div class="form-group">
            <div class="form-wrapper">
              <labelf for="">Email *</labelf>
              <input
                v-model="email"
                type="text"
                class="form-controlRegister"
                required
                pattern=".+@.+\..+"
                title="Ce champ n'accepte que le format email standard"
              />
            </div>
            <div class="form-wrapper">
              <labelf for="">Nom d'utilisateur *</labelf>
              <input
                v-model="nomUtil"
                type="text"
                class="form-controlRegister"
                required
                pattern="[a-zA-Z0-9 ]{0,}[a-zA-Z]{2}[ -_.]?[ a-zA-Z0-9]+"
                title="Ce champ n'accepte que des noms significatifs."
              />
            </div>
          </div>
          <div class="form-group">
            <div class="form-wrapper">
              <labelf for="">Téléphone *</labelf>
              <input
                v-model="telephone"
                type="text"
                class="form-controlRegister"
                required
                minlength="13"
                maxlength="13"
                pattern="[0-9]+"
                title="Ce champ n'accepte que des chiffres."
              />
            </div>
            <div class="form-wrapper">
              <labelf for="">Société *</labelf>
              <input
                v-model="societe"
                type="text"
                class="form-controlRegister"
                required
                pattern="[a-zA-Z0-9 ]{0,}[a-zA-Z]{2}[ -_.]?[ a-zA-Z0-9]+"
                title="Ce champ n'accepte que des noms significatifs."
              />
            </div>
          </div>

          <div class="checkbox">
            <labelf style="color:red">
              Les champs avec * sont obligatoires.
            </labelf>
          </div>
          <input
            class="button"
            type="submit"
            value="Inscription"
            v-on:click="inscription"
          />
        </form>
      </div>
    </div>

    <v-row justify="center">
      <v-dialog v-model="dialogErr" persistent max-width="400">
        <v-card>
          <v-card-title class="headline" style="color:red">
            Erreur
          </v-card-title>

          <v-card-text>
            Le nom d'utilisateur est déjà pris, veuillez choisir un autre !
            <br />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red" text @click="fermErr">
              ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialogSucces" persistent max-width="500">
        <v-card>
          <v-card-title class="headline" style="color:green">
            Votre inscription a été prise en compte !
          </v-card-title>

          <v-card-text>
            Un email vous sera envoyé ultérieurement pour <br />
            vous fournir un identifiant et un mot de passe
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green" text @click="ferm">
              ok
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
  data: () => ({
    editedItem: {
      nomUtil: ""
    },
    dialogErr: false,
    dialogSucces: false,
    rules: {
      name: value =>
        /[A-Z][a-z]{2,30}/.test(value) | !value ||
        "Ce champ n'accepte que des lettres.",
      lastName: value =>
        /[A-Z][a-z]{2,30}([ ][A-Z][a-z]{2,30})*/.test(value) | !value ||
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
    nom: "",
    prenom: "",
    email: "",
    nomUtil: "",
    societe: "",
    telephone: ""
  }),

  methods: {
    fermErr() {
      this.$session.set("err", 0);
      this.dialogErr = false;
    },
    ferm() {
      this.$session.destroy();
      location.replace("/");
    },
    inscription() {
      if (
        this.telephone != "" &&
        this.societe != "" &&
        this.nom != "" &&
        this.prenom &&
        this.email != "" &&
        this.nomUtil
      ) {
        const postData = {
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          nomUtil: this.nomUtil,
          motPass: this.motPass,
          telephone: this.telephone,
          societe: this.societe,
          etat: "non confirmée",
          dateInsc: new Date()
        };

        axios
          .post("http://localhost:8083/inscription", postData)
          .then(Response => {
            if (Response.data.nomUtil != null) {
              (this.nom = ""),
                (this.prenom = ""),
                (this.email = ""),
                (this.nomUtil = ""),
                (this.motPass = ""),
                (this.telephone = "");
              this.$session.set("succes", 1);
            } else {
              this.$session.start();
              this.$session.set("nomIn", this.nom);
              this.$session.set("prenomIn", this.prenom);
              this.$session.set("emailIn", this.email);
              this.$session.set("nomUtilIn", this.nomUtil);
              this.$session.set("telIn", this.telephone);
              this.$session.set("socIn", this.societe);
              this.$session.set("err", 1);
            }
          });
      }
    }
  },
  mounted() {
    if (this.$session.get("err") == 1) {
      this.nom = this.$session.get("nomIn");
      this.prenom = this.$session.get("prenomIn");
      this.email = this.$session.get("emailIn");
      this.nomUtil = this.$session.get("nomUtilIn");
      this.telephone = this.$session.get("telIn");
      this.societe = this.$session.get("socIn");
      this.dialogErr = true;
    }
    if (this.$session.get("succes") == 1) {
      this.dialogSucces = true;
    }
  }
};
</script>
