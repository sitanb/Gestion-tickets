<template>
  <div class="content">
    <div class="md-layout">
      <div id="app" class="shadow">
        <fusioncharts
          :type="type1"
          :width="width"
          :height="height"
          :dataFormat="dataFormat"
          :dataSource="dataSource"
        ></fusioncharts>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <md-icon>content_paste</md-icon>
          </template>

          <template slot="content">
            <p class="category"><strong>Demandes incriptions</strong></p>
            <h3 class="title">
              {{ nbIncr }}
            </h3>
            <br />
            <br />
            <br />
            <br />
          </template>

          <template slot="footer">
            <div class="stats"></div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="green">
          <template slot="header">
            <i class="fas fa-user"></i>
          </template>

          <template slot="content">
            <p class="category"><strong>Comptes utilisateurs</strong></p>
            <br />
            <h3 class="title">{{ nbUtil }}</h3>
            <br />
            <br />
            <br />
          </template>

          <template slot="footer">
            <div class="stats"></div>
          </template>
        </stats-card>
      </div>
    </div>
  </div>
</template>

<script>
//graphe2

const dataSource = {
  chart: {
    caption: "Nombre d'inscriptions par mois",
    yaxisname: "Nombre d'inscriptions",
    subcaption: "" + new Date().getFullYear(),
    showhovereffect: "1",
    xaxisname: "Mois",
    drawcrossline: "1",
    plottooltext: "<b>$dataValue</b> of youth were on $seriesName",
    theme: "fusion"
  },
  categories: [
    {
      category: [
        {
          label: "Janv"
        },
        {
          label: "Févr"
        },
        {
          label: "Mars"
        },
        {
          label: "Avril"
        },
        {
          label: "Mai"
        },
        {
          label: "Juin"
        },
        {
          label: "Juil"
        },
        {
          label: "Août"
        },
        {
          label: "Sept"
        },
        {
          label: "Oct"
        },
        {
          label: "Nov"
        },
        {
          label: "Déc"
        }
      ]
    }
  ],
  dataset: [
    {
      seriesname: "Inscriptions",
      data: [
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        },
        {
          value: "0"
        }
      ]
    }
  ]
};
import axios from "axios";
import {
  StatsCard,
  ChartCard,
  NavTabsCard,
  NavTabsTable,
  OrderedTable
} from "@/components";

export default {
  components: {
    StatsCard
  },
  data() {
    return {
      renderAt: "chart-container",
      width: "605",
      height: "350",
      dataFormat: "json",
      dataSource,
      type1: "msline",
      nbUtil: 0,
      nbIncr: 0,
      nb: 0
    };
  },
  mounted() {
    axios.get("http://localhost:8083/inscriptions").then(Response => {
      Response.data.forEach(element => {
        this.nb = 0;
        Response.data.forEach(ele => {
          if (
            new Date(element.dateInsc).getMonth() ==
              new Date(ele.dateInsc).getMonth() &&
            new Date(element.dateInsc).getFullYear() == new Date().getFullYear()
          ) {
            this.nb += 1;
          }
        });
        if (new Date(element.dateInsc).getMonth() == 0) {
          dataSource.dataset[0].data[0].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 1) {
          dataSource.dataset[0].data[1].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 2) {
          dataSource.dataset[0].data[2].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 3) {
          dataSource.dataset[0].data[3].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 4) {
          dataSource.dataset[0].data[4].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 5) {
          dataSource.dataset[0].data[5].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 6) {
          dataSource.dataset[0].data[6].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 7) {
          dataSource.dataset[0].data[7].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 8) {
          dataSource.dataset[0].data[8].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 9) {
          dataSource.dataset[0].data[9].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 10) {
          dataSource.dataset[0].data[10].value = this.nb;
        }
        if (new Date(element.dateInsc).getMonth() == 11) {
          dataSource.dataset[0].data[11].value = this.nb;
        }
      });
    });
    axios.get("http://localhost:8083/inscriptions").then(Response => {
      Response.data.forEach(element => {
        this.nbIncr += 1;
      });
    });

    axios.get("http://localhost:8083/utilisateurs").then(Response => {
      Response.data.forEach(element => {
        this.nbUtil += 1;
      });
    });
  }
};
</script>
