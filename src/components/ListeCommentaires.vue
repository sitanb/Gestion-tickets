<template>
  <v-app style="margin-top:55px">
    <div id="menu" class="fixed-top">
      <div class="row" id="menuflo">
        <v-btn
          v-if="this.$session.get('idAssCnx')"
          href="/AccueilAssChef"
          flat
          color="gray"
          style="color:#33b5e5;margin-right:20px;height:30px"
        >
          <span class="caption text-uppercase">Accueil </span>
        </v-btn>
        <v-btn
          v-else
          href="/AcceuilClient"
          flat
          color="gray"
          style="color:#33b5e5;margin-right:20px;height:30px"
        >
          <span class="caption text-uppercase">Accueil </span>
        </v-btn>
        <v-btn small flat color="gray" style="color:#33b5e5;">
          <span class="caption text-uppercase">FRS | For Right Solutions </span>
        </v-btn>
        <v-btn small flat color="gray" style="color:#33b5e5;margin-left:680px">
          <span class="caption text-lowercase">
            Bienvenu(e) {{ this.$session.get("nom") }}
            {{ this.$session.get("prenom") }}
          </span>
        </v-btn>
        <v-btn
          v-if="!this.$session.get('idAssCnx')"
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
          style="color:red;margin-left:6px"
          @click="deconnexion"
        >
          <span class="caption text-lowercase"> Déconnexion </span>
        </v-btn>
      </div>
    </div>
    <a @click="fermer">
      <div v-if="this.$session.get('add') == 1">
        <v-alert v-model="alert" dismissible dense text type="success">
          Votre mot de passe a été changer avec succès !
        </v-alert>
      </div>
    </a>
    <div id="body">
      <div class="containerChat">
        <div class="chatbox" style="width:100%">
          <div class="chatbox__user-list" style="overflow-x:auto">
            <h1>
              {{
                this.$session.get("idTicket") +
                  " : " +
                  this.$session.get("objetTicket")
              }}
            </h1>
            <br />
            <div>
              <v-btn small flat color="gray" style="margin-left:10px">
                <span class="caption text-uppercase">
                  <h5>
                    Personnes participantes
                  </h5>
                </span>
              </v-btn>
            </div>

            <div
              class="chatbox__user--active"
              v-for="participant in participants"
              :key="participant"
            >
              <p>
                <strong
                  style="color:  #0B2841

"
                  >{{ participant.toString().split("|")[0] }}</strong
                >
              </p>
            </div>
          </div>
          <div class="chatbox__messages" v-chat-scroll>
            <div v-for="(item, i) in commentaires" :key="i">
              <div v-if="$session.get('idAssCnx') != null">
                <div
                  class="chatbox__messages__user-message_send"
                  v-if="
                    item.auteur.split('|')[0] == $session.get('nomUtil') ||
                      item.auteur.split('|')[1] != null
                  "
                >
                  <div
                    class="chatbox__messages__user-message--ind-message_send"
                  >
                    <p style="color:#010c17;font-size:16px;padding-left:0px">
                      <strong>{{ item.auteur.split("|")[0] }}</strong>
                      <i class="fas fa-users-cog"></i>
                    </p>
                    <p
                      class="name"
                      v-html="item.desciptionComm.replace('\n', '<br/>')"
                    ></p>
                    <p class="message" style="padding-left:270px">
                      <strong>{{
                        item.dateComm.toString().split("T")[0] +
                          "  " +
                          (parseInt(
                            item.dateComm
                              .toString()
                              .split("T")[1]
                              .split(":")[0]
                          ) +
                            1) +
                          ":" +
                          item.dateComm
                            .toString()
                            .split("T")[1]
                            .split(":")[1]
                      }}</strong>
                      <a
                        v-if="
                          Math.floor(
                            new Date().getTime() -
                              new Date(item.dateComm).getTime()
                          ) /
                            60000 <
                            5
                        "
                        @click="supp(item)"
                        ><v-icon style="color:red;margin-left:10px"
                          >mdi-delete</v-icon
                        ></a
                      >
                    </p>
                  </div>
                </div>

                <div class="chatbox__messages__user-message" v-else>
                  <div class="chatbox__messages__user-message--ind-message">
                    <p
                      style="color:rgb(12, 191, 125);font-size:16px;padding-left:0px"
                    >
                      <strong>{{ item.auteur.split("|")[0] }}</strong>
                      <i class="fa fa-user" aria-hidden="true"></i>
                    </p>
                    <p
                      class="name"
                      v-html="item.desciptionComm.replace('\n', '<br/>')"
                    ></p>
                    <p class="message" style="padding-left:300px">
                      <strong>{{
                        item.dateComm.toString().split("T")[0] +
                          "  " +
                          (parseInt(
                            item.dateComm
                              .toString()
                              .split("T")[1]
                              .split(":")[0]
                          ) +
                            1) +
                          ":" +
                          item.dateComm
                            .toString()
                            .split("T")[1]
                            .split(":")[1]
                      }}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form>
            <textarea
              v-model="content"
              class="form-control"
              placeholder="Taper votre commentaire..."
            ></textarea
            ><a href="#" @click="saveContent"
              ><i class="far fa-paper-plane fa-2x"></i>
            </a>
          </form>
        </div>
      </div>
    </div>
    <!--dialog alert-->

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title class="headline" style="color:red"
            >Veuillez saisir un commentaire commentaire !</v-card-title
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

            <v-btn color="green darken-1" text @click="supprimer(eltSupp)">
              Oui, supprimé
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
      participants: [],
      nbrCommentaires: 0,
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

      editedItem: {
        nomUtil: "",
        motPass: "",
        confirm: ""
      },
      dialog: false,
      htmlForEditor: "",
      objet: "",
      dialogDelete: false,
      eltSupp: [],
      content: "",
      itemnew: null,
      commentaires: []
    };
  },
  created() {
    this.getCommentaires();
    setInterval(() => this.getCommentaires(), 5000);
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
  },

  methods: {
    getCommentaires() {
      axios.get("http://localhost:8083/commentaires").then(Response => {
        this.commentaires = [];
        Response.data.sort((a, b) => (a.dateComm > b.dateComm ? 1 : -1));
        Response.data.forEach(element => {
          if (this.$session.get("idTicket") == element.idTicket) {
            this.commentaires.push(element);
            if (this.participants.includes(element.auteur) == false) {
              this.participants.push(element.auteur);
            }
          }
        });

        this.nbrCommentaires = this.commentaires.length;
        if (Response.data.length != 0) {
          this.nextCodeCmtaire = Response.data[Response.data.length - 1].idComm;
          this.nextCodeCmtaire =
            "FRS-Commt-000" +
            (parseInt(this.nextCodeCmtaire.split("-")[2]) + 1);
        } else {
          this.nextCodeCmtaire = "FRS-Commt-0001";
        }
      });
    },

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

    saveContent: function() {
      // You have the content to save

      if (this.content == "") {
        this.dialog = true;
      } else {
        if (this.$session.get("idAssCnx") != null) {
          axios.post("http://localhost:8083/commentaire", {
            idComm: this.nextCodeCmtaire,
            desciptionComm: this.content,
            idTicket: this.$session.get("idTicket"),
            auteur:
              this.$session.get("nomUtil") +
              "|" +
              this.$session.get("idAssCnx"),
            dateComm: new Date()
          });
        } else {
          axios.post("http://localhost:8083/commentaire", {
            idComm: this.nextCodeCmtaire,
            desciptionComm: this.content,
            idTicket: this.$session.get("idTicket"),
            auteur: this.$session.get("nomUtil"),
            dateComm: new Date()
          });
        }

        location.reload();
      }
    },
    supprimer(item) {
      this.dialogDelete = false;
      axios.delete("http://localhost:8083/commentaire/" + item.idComm);
      location.reload();
    },

    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    deconnexion() {
      if (this.$session.get("idAssCnx") != null) {
        this.$session.destroy();
        location.replace("/Authentification");
      } else {
        this.$session.destroy();
        location.replace("/");
      }
    }
  }
};
</script>
<style>
.scroll {
  height: 350px;
  overflow: auto;
}
</style>
