<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <md-list>
            <li
              class="md-list-item"
              v-if="this.$session.get('idAssCnx') != null"
              style="margin-right:80px;"
            >
              <a
                href="#"
                class="md-list-item-router md-list-item-container md-button-clean dropdown"
              >
                <div class="md-list-item-content">
                  <drop-down>
                    <md-button
                      slot="title"
                      class="md-button md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>notifications</md-icon>
                      <span class="notification">{{ this.nbrNotif }}</span>
                      <p class="hidden-lg hidden-md">Notifications</p>
                    </md-button>
                    <ul
                      class="dropdown-menu dropdown-menu-right"
                      style="overflow:auto;height:200px"
                      v-chat-scroll
                    >
                      <table
                        v-for="notification in notifs"
                        :key="notification.idNotification"
                      >
                        <tr>
                          <td style="width:80%">
                            <li>
                              <a
                                href="#"
                                v-html="notification.descriptionNotification"
                              ></a>
                            </li>
                          </td>
                          <td style="width:20%">
                            <v-btn
                              v-if="notification.etatNotification == 'non-lu'"
                              small
                              flat
                              color="gray"
                              style="color:green"
                              @click="marquer(notification)"
                            >
                              <span class="caption text-lowercase">
                                Marquer lu</span
                              >
                            </v-btn>

                            <v-btn
                              v-else
                              small
                              flat
                              color="gray"
                              style="color:green"
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
                              style="color:red;margin-left: 10px"
                              @click="SupprimerNotif(notification)"
                            >
                              <span class="caption text-lowercase"
                                >Supprimer</span
                              >
                            </v-btn>
                          </td>
                        </tr>
                      </table>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      nbrNotif: 0,
      notifs: []
    };
  },
  methods: {
    SupprimerNotif(notification) {
      axios.get("http://localhost:8083/notifications").then(res => {
        res.data.forEach(element => {
          if (
            element.idAss == notification.idAss &&
            element.codeProjet == notification.codeProjet
          ) {
            axios.delete(
              "http://localhost:8083/notification/" +
                element.idAss +
                "/" +
                element.codeProjet
            );
          }
        });
      });
      location.reload();
    },
    marquer(notification) {
      axios.get("http://localhost:8083/notifications").then(res => {
        res.data.forEach(element => {
          if (
            element.idAss == notification.idAss &&
            element.codeProjet == notification.codeProjet
          ) {
            element.etatNotification = "lu";
            axios.put(
              "http://localhost:8083/notification/" +
                element.idAss +
                "/" +
                element.codeProjet +
                "/" +
                element.etatNotification
            );
          }
        });
      });
      location.reload();
    },
    nonMarquer(notification) {
      axios.get("http://localhost:8083/notifications").then(res => {
        res.data.forEach(element => {
          if (
            element.idAss == notification.idAss &&
            element.codeProjet == notification.codeProjet
          ) {
            element.etatNotification = "non-lu";
            axios.put(
              "http://localhost:8083/notification/" +
                element.idAss +
                "/" +
                element.codeProjet +
                "/" +
                element.etatNotification
            );
          }
        });
      });
      location.reload();
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    }
  },
  mounted() {
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
  }
};
</script>

<style lang="css"></style>
