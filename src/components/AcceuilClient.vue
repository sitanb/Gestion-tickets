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
            <span class="caption text-lowercase">
              Changer mot de passe ?
            </span>
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

      <v-data-table
        :headers="headers"
        :search="search"
        :items="produits"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        @page-count="pageCount = $event"
        class="elevation-4"
      >
        <template v-slot:top>
          <v-toolbar flat color="white" style="height:40px">
            <v-toolbar-title style="color:#33b5e5"
              >Mes Produits</v-toolbar-title
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
        <template v-slot:item="{ item }">
          <br />
          <table class="tab">
            <tr>
              <td>
                <v-btn
                  style="margin-left:10px"
                  dark
                  class="mb-2"
                  tile
                  outlined
                  color="#33b5e5"
                  >{{ item.nomPro }}</v-btn
                >
                <img :src="item.image" width="790" style="height:175px" />
              </td>
              <td align="center">
                <v-btn
                  @click="nouvelleReclamation(item)"
                  id="boutton"
                  tile
                  outlined
                  color="#4caf50"
                  ><v-icon left>mdi-plus</v-icon> Nouvelle réclamation</v-btn
                ><br /><br />
                <v-btn
                  @click="afficherReclamation(item)"
                  id="boutton"
                  style="margin-left:20px"
                  tile
                  outlined
                  color="#4caf50"
                  ><v-icon left>mdi-eye</v-icon> Mes réclamations</v-btn
                >
              </td>
            </tr>

            <br />
          </table>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" circle :length="pageCount"></v-pagination>
      </div>
    </div>

    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
    />

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
import CloseIcon from "vue-beautiful-chat/src/assets/close-icon.png";
import OpenIcon from "vue-beautiful-chat/src/assets/logo-no-bg.svg";
import FileIcon from "vue-beautiful-chat/src/assets/file.svg";
import CloseIconSvg from "vue-beautiful-chat/src/assets/close.svg";
import axios from "axios";

export default {
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
      editedItem: {
        nomUtil: "",
        motPass: "",
        confirm: ""
      },

      //pour chat
      icons: {
        open: {
          img: OpenIcon,
          name: "default"
        },
        close: {
          img: CloseIcon,
          name: "default"
        },
        file: {
          img: FileIcon,
          name: "default"
        },
        closeSvg: {
          img: CloseIconSvg,
          name: "default"
        }
      },
      participants: [
        {
          id: "Assistant",
          name: "Assistant",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSP9qX9lq9dk1OKQyNlNKGTt9-5kU3F7YbCiLgE9u3K44GlVFTP&usqp=CAU"
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: "",
      messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        launcher: {
          bg: "#4e8cff"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)

      //Pour table
      search: "",
      items: [],
      headers: [
        {
          align: "center",
          sortable: false,
          value: "image"
        },
        {
          align: "left",
          sortable: false,
          value: "nomPro"
        },
        { value: "actions", sortable: false, align: "center" }
      ],
      produits: [],
      lignePro: []
    };
  },

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

    verifie() {
      return (
        this.editedItem.motPass === this.editedItem.confirm ||
        "Le mot de passe et la confirmation ne correspondent pas."
      );
    },
    fermer() {
      this.$session.set("add", 0);
      this.$session.set("edit", 0);
      this.$session.set("delete", 0);
    },

    nouvelleReclamation(item) {
      this.$session.start();
      this.$session.set("prodId", item.codePro);
      this.$session.set("prodImage", item.image);
      location.replace("/ListeReclamations");
    },

    afficherReclamation(item) {
      this.$session.start();
      this.$session.set("prodId", item.codePro);
      this.$session.set("prodImage", item.image);
      location.replace("/StatsReclamation");
    },

    getMessages() {
      axios.get("http://localhost:8083/messages").then(res => {
        this.messageList = [];
        res.data.sort((a, b) => (a.idMsg > b.idMsg ? 1 : -1));
        res.data.forEach(element => {
          if (
            element.nomUtil == this.$session.get("nomUtil") &&
            element.idAss == null
          ) {
            var contenu = element.contenu;
            var mess = { author: "me", type: "text", data: { text: contenu } };
            this.messageList.push(mess);
          } else if (
            element.nomUtil == this.$session.get("nomUtil") &&
            element.idAss != null
          ) {
            var conten = element.contenu;
            var msg = {
              author: "Assistant",
              type: "text",
              data: { text: conten }
            };
            this.messageList.push(msg);
          }

          if (
            element.status == "non-lu" &&
            this.$session.get("compter") == true
          ) {
            this.newMessagesCount = this.newMessagesCount + 1;
            this.$session.start();
            this.$session.set("compter", false);
          }
        });
      });
    },

    //debut chat methodes

    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({ author: "me", type: "text", data: { text } });
      }
    },
    onMessageWasSent(message) {
      // called when the user sends a message
      this.messageList = [...this.messageList, message];
      axios.post("http://localhost:8083/message", {
        contenu: message.data.text,
        date: new Date(),
        nomUtil: this.$session.get("nomUtil"),
        status: "non-lu"
      });
      axios.post("http://localhost:8083/chat", {
        nomUtil: this.$session.get("nomUtil"),
        dateChat: new Date(),
        nbMsg: 1
      });

      axios.get("http://localhost:8083/chats").then(res => {
        res.data.forEach(element => {
          if (element.nomUtil == this.$session.get("nomUtil")) {
            if (element.nbMsg == null) {
              element.nbMsg = 1;
              element.dateChat = new Date();
              axios.put(
                "http://localhost:8083/chat/" + element.nomUtil,
                element
              );
            } else {
              element.nbMsg = parseInt(element.nbMsg) + 1;
              element.dateChat = new Date();
              axios.put(
                "http://localhost:8083/chat/" + element.nomUtil,
                element
              );
            }
          }
        });
      });
    },

    deconnexion() {
      this.$session.destroy();
      location.replace("/");
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
      this.$session.start();
      this.$session.set("compter", false);

      axios.get("http://localhost:8083/messages").then(res => {
        res.data.forEach(element => {
          if (element.nomUtil == this.$session.get("nomUtil")) {
            element.status = "lu";
            axios.put(
              "http://localhost:8083/message/" + element.idMsg,
              element
            );
          }
        });
      });
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
      this.$session.start();
      this.$session.set("compter", true);
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      console.log("Emit typing event");
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  },
  mounted() {
    /*if(this.$session.get('nomUtil')==null){
              location.replace('/Authentification')
          }*/
    this.$session.start();
    this.$session.set("compter", true);
    this.getMessages();
    setInterval(() => this.getMessages(), 5000);
  },

  created() {
    axios.get("http://localhost:8083/ligneProduits").then(res => {
      res.data.forEach(element => {
        if (
          element.raisonSoc
            .toString()
            .toUpperCase()
            .includes(
              this.$session
                .get("raisonSoc")
                .toString()
                .toUpperCase()
            ) == true
        ) {
          this.$session.start();
          this.$session.set("raisonSocPro", element.raisonSoc);
          this.lignePro.push(element);
        }
      });
    });
    axios.get("http://localhost:8083/produits").then(res => {
      res.data.forEach(element => {
        this.lignePro.forEach(ligne => {
          if (
            element.codePro == ligne.codePro &&
            this.produits.toString().includes(ligne.codePro) == false
          ) {
            this.produits.push(element);
          }
        });
      });
    });
  }
};
</script>

<style>
.tab {
  border: none;
}
</style>
