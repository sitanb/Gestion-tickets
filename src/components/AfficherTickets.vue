<template>
  <v-app style="margin-top:45px">
    <div id="menu" class="fixed-top">
      <div class="row" id="menuflo">
        <v-btn small flat color="gray" style="color:#33b5e5;">
          <span class="caption text-uppercase">FRS | For Right Solutions </span>
        </v-btn>
        <v-btn small flat color="gray" style="color:#33b5e5;margin-left:780px">
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
          style="color:red;margin-left:6px"
          @click="deconnexion"
        >
          <span class="caption text-lowercase"> Déconnexion </span>
        </v-btn>
      </div>
    </div>

    <div>
      <v-btn
        href="AcceuilClient"
        small
        flat
        color="#33b5e5"
        style="color:white;margin-left:100px"
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
      <div style="width:40%;float:left">
        <img :src="this.$session.get('prodImage')" />
      </div>

      <div style="width:60%;float:left">
        <v-data-table
          :headers="headers"
          :search="search"
          :items="tickets"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          @page-count="pageCount = $event"
          class="elevation-4"
        >
          <template v-slot:top>
            <v-toolbar flat color="white" style="height:40px">
              <v-toolbar-title style="color:#33b5e5"
                >Mes réclamations</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Objet"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:item="{ item }">
            <br />
            <div
              class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-24"
              style="margin-left:100px"
            >
              <stats-card data-background-color="red">
                <template slot="header">
                  <md-icon>book</md-icon>
                </template>

                <template slot="content">
                  <p class="category" style="float:left">
                    <strong> Code : {{ item.idTicket }}</strong>
                  </p>
                  <br />
                  <h3 class="title" style="float:left">
                    <i>Objet : {{ item.objetTicket }}</i>
                  </h3>
                  <br /><br />
                </template>

                <template slot="footer">
                  <div class="stats">
                    <table style="margin-left:80px">
                      <tr>
                        <td>
                          <v-btn
                            @click="afficherCommentaires(item)"
                            id="boutton"
                            tile
                            outlined
                            color="#4caf50"
                            ><v-icon left>mdi-eye</v-icon>Commentaires</v-btn
                          >
                        </td>
                        <td>
                          <a
                            @click="ouvrir(item)"
                            id="boutton"
                            style="color:#33b5e5"
                            tile
                            outlined
                            color="#4caf50"
                          >
                            Modifier
                            <v-icon style="color:#33b5e5;margin-left:12px"
                              >mdi-pencil</v-icon
                            ></a
                          >
                        </td>
                        <td>
                          <a @click="supp(item)" id="boutton" style="color:red"
                            >Supprimer<v-icon
                              style="color:red;margin-left:20px"
                              left
                              >mdi-delete</v-icon
                            ></a
                          >
                        </td>
                      </tr>
                    </table>
                  </div>
                </template>
              </stats-card>
            </div>
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

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500">
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
import {
  StatsCard,
  ChartCard,
  NavTabsCard,
  NavTabsTable,
  OrderedTable
} from "@/components";
import axios from "axios";
export default {
  components: {
    StatsCard
  },

  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 2,
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
      search: "",
      items: [],
      tickets: [],
      dialogVerif: false,
      dialogDelete: false,
      eltSupp: [],
      objetTicketM: "",
      itemModifier: [],

      dialog: false,

      editedItem: {
        nomUtil: "",
        motPass: "",
        confirm: ""
      },
      headers: [
        {
          align: "left",
          sortable: false,
          value: "objetTicket"
        },
        { value: "actions", sortable: false, align: "right" }
      ]
    };
  },

  created() {
    axios.get("http://localhost:8083/tickets").then(Response => {
      Response.data.forEach(element => {
        if (
          this.$session.get("prodId") == element.codePro &&
          element.raisonSoc == this.$session.get("raisonSocPro")
        ) {
          this.tickets.push(element);
        }
      });
    });
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
  },
  methods: {
    afficherCommentaires(item) {
      this.$session.start();
      this.$session.set("objetTicket", item.objetTicket);
      this.$session.set("idTicket", item.idTicket);
      location.replace("/ListeCommentaires");
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

    supp(item) {
      this.eltSupp = item;
      this.dialogDelete = true;
    },

    deconnexion() {
      this.$session.destroy();
      location.replace("/");
    },
    supprimer(item) {
      this.dialogDelete = false;
      axios.delete("http://localhost:8083/ticket/" + item.idTicket);
      location.reload();
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
            objetTicket: this.objetTicketM
          }
        );
        this.dialog = false;
        location.reload();
      }
    },
    ouvrir(item) {
      this.itemModifier = item;
      this.objetTicketM = item.objetTicket;
      this.dialog = true;
    }
  }
};
</script>
<style></style>
