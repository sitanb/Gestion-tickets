<template>
  <div class="content">
    <v-app>
      <div class="md-layout">
        <div
          class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
        >
          <stats-card data-background-color="blue">
            <template slot="header">
              <md-icon>book</md-icon>
            </template>

            <template slot="content">
              <p class="category"><strong>Mes réclamations</strong></p>
              <h3 class="title">
                {{ nbTicket }}
              </h3>
              <br />
            </template>

            <template slot="footer">
              <div class="stats"></div>
            </template>
          </stats-card>
        </div>
        <div
          v-if="this.$session.get('chef') != null"
          class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
        >
          <stats-card data-background-color="orange">
            <template slot="header">
              <i class="fas fa-user-plus"></i>
            </template>

            <template slot="content">
              <p class="category"><strong>Affectations réclamations</strong></p>
              <h3 class="title">{{ nbAffTick }}</h3>
            </template>

            <template slot="footer">
              <div class="stats"></div>
            </template>
          </stats-card>
        </div>
        <div
          class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-20"
        >
          <stats-card data-background-color="red">
            <template slot="header">
              <i class="fas fa-edit"></i>
            </template>

            <template slot="content">
              <p class="category"><strong>Comptes rendus</strong></p>
              <h3 class="title">{{ nbCptR }}</h3>
              <br />
            </template>

            <template slot="footer">
              <div class="stats"></div>
            </template>
          </stats-card>
        </div>
      </div>

      <!-- Entete chat -->
      <div>
        <div style="float:left;width:28%;margin-left:20px">
          <v-card max-width="500" class="mx-auto">
            <v-toolbar color="#8fbc8f" dark>
              <v-toolbar-title>Discussion</v-toolbar-title>

              <v-spacer></v-spacer>
            </v-toolbar>
            <a>
              <v-list subheader style="height:400px;overflow:auto">
                <v-subheader>Discussion récente</v-subheader>

                <v-list-item
                  v-for="user in users"
                  :key="user.nomUtil"
                  @click="chat(user)"
                >
                  <v-list-item-avatar>
                    <img src="../assets/imgmsg.jpg" />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="user.nomUtil"
                    ></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-icon>
                    <div style="color:red">
                      {{ user.nbMsg }}
                    </div>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </a>
          </v-card>
        </div>

        <v-row justify="center">
          <v-dialog v-model="dialogAlertNotif" max-width="800">
            <v-card style="overflow:auto;height:200px">
              <br />
              <div
                v-for="notification in notifs"
                :key="notification.idNotification"
              >
                <table
                  v-if="notification.etatNotification == 'non-lu'"
                  style="margin-left:20px"
                >
                  <tr>
                    <td style="width:80%">
                      <p
                        style="margin-top:10px"
                        v-html="notification.descriptionNotification"
                      ></p>
                    </td>
                    <td style="width:20%">
                      <v-btn
                        v-if="notification.etatNotification == 'non-lu'"
                        small
                        flat
                        color="gray"
                        style="color:green;margin-left:50px"
                        @click="marquer(notification)"
                      >
                        <span class="caption text-lowercase">
                          Marquer comme lu</span
                        >
                      </v-btn>

                      <v-btn
                        v-else
                        small
                        flat
                        color="gray"
                        style="color:green;margin-left:50px"
                        @click="nonMarquer(notification)"
                      >
                        <span class="caption text-lowercase"
                          >Marquer non-lu</span
                        >
                      </v-btn>
                    </td>
                    <td style="width:20%">
                      <v-btn
                        small
                        flat
                        color="gray"
                        style="color:red;margin-left: 30px"
                        @click="SupprimerNotif(notification)"
                      >
                        <span class="caption text-lowercase">Supprimer</span>
                      </v-btn>
                    </td>
                  </tr>
                </table>

                <table v-else style="margin-left:20px">
                  <tr>
                    <td style="width:80%">
                      <p
                        style="margin-top:10px"
                        v-html="notification.descriptionNotification"
                      ></p>
                    </td>
                    <td style="width:20%">
                      <v-btn
                        small
                        flat
                        color="gray"
                        style="color:green;margin-left: 30px"
                        @click="nonMarquer(notification)"
                      >
                        <span class="caption text-lowercase"
                          >Marquer comme non-lu</span
                        >
                      </v-btn>
                    </td>
                    <td style="width:20%">
                      <v-btn
                        small
                        flat
                        color="gray"
                        style="color:red;margin-left: 30px"
                        @click="SupprimerNotif(notification)"
                      >
                        <span class="caption text-lowercase">Supprimer</span>
                      </v-btn>
                    </td>
                  </tr>
                </table>
              </div>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="fermer">
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
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
    </v-app>
  </div>
</template>

<script>
import CloseIcon from "vue-beautiful-chat/src/assets/close-icon.png";
import OpenIcon from "vue-beautiful-chat/src/assets/logo-no-bg.svg";
import FileIcon from "vue-beautiful-chat/src/assets/file.svg";
import CloseIconSvg from "vue-beautiful-chat/src/assets/close.svg";
import axios from "axios";
import { StatsCard } from "@/components";

export default {
  components: {
    StatsCard
  },
  data() {
    return {
      nbTicket: 0,
      nbCptR: 0,
      nbAffTick: 0,
      userSelect: "",
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
            "ehttps://ncrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSP9qX9lq9dk1OKQyNlNKGTt9-5kU3F7YbCiLgE9u3K44GlVFTP&usqp=CAU"
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

      //autre
      nbrNotif: 0,
      notifs: [],
      dialogAlertNotif: false,

      users: [],

      rules: [value => !!value || "Ce champ est obligatoire !"]
    };
  },
  methods: {
    deconnexion() {
      this.$session.destroy();
      location.replace("/Authentification");
    },

    getChats() {
      axios.get("http://localhost:8083/chats").then(res => {
        this.users = res.data;
        this.users.sort((a, b) => (b.dateChat > a.dateChat ? 1 : -1));
      });
    },

    ouvrir() {
      this.dialogAlertNotif = true;
    },
    fermer() {
      this.dialogAlertNotif = false;
    },

    chat(user) {
      this.$session.start();
      this.$session.set("userClient", user.nomUtil);
      axios.get("http://localhost:8083/messages").then(res => {
        this.messageList = [];
        res.data.sort((a, b) => (a.idMsg > b.idMsg ? 1 : -1));
        res.data.forEach(element => {
          if (element.nomUtil == user.nomUtil && element.idAss == null) {
            var contenu = element.contenu;
            var mess = {
              author: user.nomUtil,
              type: "text",
              data: { text: contenu }
            };
            this.messageList.push(mess);
          } else if (element.nomUtil == user.nomUtil && element.idAss != null) {
            var conten = element.contenu;
            var msg = { author: "me", type: "text", data: { text: conten } };
            this.messageList.push(msg);
          }
          if (element.nomUtil == user.nomUtil) {
            element.status = "lu";
            axios.put(
              "http://localhost:8083/message/" + element.idMsg,
              element
            );
          }
        });
      });

      axios.get("http://localhost:8083/chats").then(res => {
        res.data.forEach(element => {
          if (element.nomUtil == user.nomUtil) {
            element.nbMsg = null;
            axios.put("http://localhost:8083/chat/" + element.nomUtil, element);
          }
        });
      });
      this.isChatOpen = true;
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
        nomUtil: this.$session.get("userClient"),
        idAss: this.$session.get("idAssCnx"),
        status: "non-lu"
      });
      axios.get("http://localhost:8083/chats").then(res => {
        res.data.forEach(element => {
          if (element.nomUtil == this.$session.get("userClient")) {
            element.dateChat = new Date();
            axios.put("http://localhost:8083/chat/" + element.nomUtil, element);
          }
        });
      });
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
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
    var exist = false;
    axios.get("http://localhost:8083/tickets").then(ticket => {
      axios.get("http://localhost:8083/projets").then(projet => {
        ticket.data.forEach(t => {
          exist = false;
          projet.data.forEach(p => {
            if (
              t.idTicket == p.idTicket &&
              p.code == this.$session.get("codeEquipe")
            ) {
              exist = true;
            }
          });
          if (exist == true) {
            this.nbAffTick += 1;
          }
        });
      });
    });
    axios.get("http://localhost:8083/projets").then(Response => {
      Response.data.forEach(element => {
        if (element.idAss == this.$session.get("idAssCnx")) {
          this.nbTicket += 1;
        }
      });
    });
    axios.get("http://localhost:8083/projets").then(res => {
      axios.get("http://localhost:8083/compteRendus").then(cpt => {
        res.data.forEach(element => {
          if (element.idAss == this.$session.get("idAssCnx")) {
            cpt.data.forEach(crendu => {
              if (element.codeProjet == crendu.codeProjet) {
                this.nbCptR += 1;
              }
            });
          }
        });
      });
    });

    axios.get("http://localhost:8083/notifications").then(notif => {
      notif.data.forEach(n => {
        if (
          n.etatNotification == "non-lu" &&
          n.idAss == this.$session.get("idAssCnx")
        ) {
          this.nbrNotif = this.nbrNotif + 1;
          this.notifs.push(n);
        }
        if (
          n.etatNotification == "lu" &&
          n.idAss == this.$session.get("idAssCnx")
        ) {
          this.notifs.push(n);
        }
      });
    });

    this.getChats();
    setInterval(() => this.getChats(), 5000);
  }
};
</script>
