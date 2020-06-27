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
      <div id="app" class="shadow" style="margin-left:10px">
        <fusioncharts
          :type="type1"
          :width="width"
          :height="height"
          :dataFormat="dataFormat"
          :dataSource="dataSource1"
        ></fusioncharts>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
        style="margin-top:30px;margin-left:300px"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <i class="fab fa-microsoft    "></i>
          </template>

          <template slot="content">
            <p class="category"><strong>Produits</strong></p>
            <h3 class="title">
              {{ nbIncr }}
            </h3>
            <br />
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
        style="margin-top:30px"
      >
        <stats-card data-background-color="red">
          <template slot="header">
            <i class="fa fa-home"></i>
          </template>

          <template slot="content">
            <p class="category"><strong>Sociétés</strong></p>
            <h3 class="title">{{ nbCptR }}</h3>
            <br />
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
    </div>
  </div>
</template>

<script>
const dataSource1 = {
  chart: {
    caption: "Nombre de produits vendus par mois",
    yaxisname: "Nombre de produits",
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
      seriesname: "Produits vendus",
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

//graphe2

const dataSource = {
  chart: {
    caption: "Montant des ventes réalisées par mois",
    yaxisname: "Montant en DT",
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
      seriesname: "Vente en DT",
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
      dataSource1,
      nbCptR: 0,
      nbIncr: 0,
      montant: 0,
      nb: 0
    };
  },
  mounted() {
    axios.get("http://localhost:8083/ligneProduits").then(Response => {
      Response.data.forEach(element => {
        this.montant = 0;
        this.nb = 0;
        Response.data.forEach(ele => {
          if (
            element.date.toString().substring(2, 4) ==
              ele.date.toString().substring(2, 4) &&
            element.date.toString().substring(4, 8) ==
              new Date().getFullYear().toString()
          ) {
            this.montant += ele.quantite * ele.prixUnitaire;
            this.nb += 1;
          }
        });
        if (element.date.toString().substring(2, 4) == 1) {
          dataSource.dataset[0].data[0].value = this.montant;
          dataSource1.dataset[0].data[0].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 2) {
          dataSource.dataset[0].data[1].value = this.montant;
          dataSource1.dataset[0].data[1].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 3) {
          dataSource.dataset[0].data[2].value = this.montant;
          dataSource1.dataset[0].data[2].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 4) {
          dataSource.dataset[0].data[3].value = this.montant;
          dataSource1.dataset[0].data[3].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 5) {
          dataSource.dataset[0].data[4].value = this.montant;
          dataSource1.dataset[0].data[4].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 6) {
          dataSource.dataset[0].data[5].value = this.montant;
          dataSource1.dataset[0].data[5].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 7) {
          dataSource.dataset[0].data[6].value = this.montant;
          dataSource1.dataset[0].data[6].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 8) {
          dataSource.dataset[0].data[7].value = this.montant;
          dataSource1.dataset[0].data[7].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 9) {
          dataSource.dataset[0].data[8].value = this.montant;
          dataSource1.dataset[0].data[8].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 10) {
          dataSource.dataset[0].data[9].value = this.montant;
          dataSource1.dataset[0].data[9].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 11) {
          dataSource.dataset[0].data[10].value = this.montant;
          dataSource1.dataset[0].data[10].value = this.nb;
        }
        if (element.date.toString().substring(2, 4) == 12) {
          dataSource.dataset[0].data[11].value = this.montant;
          dataSource1.dataset[0].data[11].value = this.nb;
        }
      });
    });
    axios.get("http://localhost:8083/produits").then(Response => {
      Response.data.forEach(element => {
        this.nbIncr += 1;
      });
    });

    axios.get("http://localhost:8083/societes").then(Response => {
      Response.data.forEach(element => {
        this.nbCptR += 1;
      });
    });
  }
};
</script>
