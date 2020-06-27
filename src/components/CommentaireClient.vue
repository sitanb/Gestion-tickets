<template>
  <div>
    <div id="body">
      <div class="containerChat">
        <div class="chatbox">
          <div class="chatbox__user-list" style="overflow-x:hidden">
            <h1>
              {{
                this.$session.get("idTicket") +
                  " : " +
                  this.$session.get("objetTicket")
              }}<br />
              <a href="#" @click="ouvrir($session.get('tickEdit'))">
                <i
                  style="color:royalblue;font-size: 18px !important;padding-top:10px"
                  class="fas fa-edit"
                ></i>
              </a>
              <a href="#" @click="suppTicket($session.get('idTicket'))">
                <i
                  style="color:red;font-size: 18px !important;padding-top:10px;padding-left:16px"
                  class="fas fa-trash"
                ></i>
              </a>
            </h1>

            <br />
            <div style="text-align:center">
              <v-btn small flat color="gray">
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
                <strong style="color:  #0B2841">{{
                  participant.toString().split("|")[0]
                }}</strong>
              </p>
            </div>
          </div>
          <div class="chatbox__messages" v-chat-scroll>
            <div v-for="(item, i) in commentaires" :key="i">
              <div>
                <div
                  class="chatbox__messages__user-message_send"
                  v-if="item.auteur == $session.get('nomUtil')"
                >
                  <div
                    class="chatbox__messages__user-message--ind-message_send"
                  >
                    <p style="color:#010c17;font-size:16px;padding-left:0px">
                      <strong>{{ item.auteur.split("|")[0] }}</strong>
                      <i class="fa fa-user" aria-hidden="true"></i>
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
                      <i class="fas fa-users-cog"></i>
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
    <br />
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

    <v-row justify="center">
      <v-dialog v-model="dialogDeleteTicket" max-width="400">
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

            <v-btn color="red" text @click="dialogDeleteTicket = false">
              Annuler
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              @click="supprimerTicket(idTicketSupp)"
            >
              Oui, supprimé
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialogTick" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color:red"
            ><v-text-field
              v-model="objetTicketM"
              label="Objet *"
              :rules="rules"
            ></v-text-field
          ></v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="verifier">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialogVerif" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color:red"
            >Le champ objet est obligatoire !</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogVerif = false">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
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
      dialogTick: false,
      dialog: false,
      htmlForEditor: "",
      objet: "",
      dialogDelete: false,
      dialogDeleteTicket: false,
      eltSupp: [],
      content: "",
      itemnew: null,
      commentaires: [],
      idTicketSupp: ""
    };
  },
  created() {
    this.getCommentaires();
    setInterval(() => this.getCommentaires(), 1000);
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
        this.participants = [];
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
    suppTicket(item) {
      this.idTicketSupp = item;
      this.dialogDeleteTicket = true;
    },
    supprimerTicket(item) {
      this.dialogDeleteTicket = false;
      axios.delete("http://localhost:8083/ticket/" + item);
      location.replace("/StatsReclamation");
    },
    verifier() {
      if (this.objetTicketM == "") {
        this.dialogVerif = true;
      } else {
        axios.put(
          "http://localhost:8083/ticket/" + this.itemModifier.idTicket,
          {
            codePro: this.itemModifier.codePro,
            dateDebut: this.itemModifier.dateDebut,
            nomUtil: this.itemModifier.nomUtil,
            objetTicket: this.objetTicketM,
            raisonSoc: this.itemModifier.raisonSoc
          }
        );
        this.dialogTick = false;
        location.replace("/StatsReclamation");
      }
    },
    ouvrir(item) {
      this.itemModifier = item;
      this.objetTicketM = item.objetTicket;
      this.dialogTick = true;
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
