<template>
  <div class="content">
    <div class="md-layout">
      <div id="app" class="shadow">
        <fusioncharts
          :type="type"
          :width="width"
          :height="height"
          :dataformat="dataFormat"
          :dataSource="dataSource"
        >
        </fusioncharts>
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
        style="margin-top:20px"
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <i class="fas fa-users-cog"></i>
          </template>

          <template slot="content">
            <p class="category"><strong>Equipes maintenaces</strong></p>
            <br />
            <h3 class="title">{{ nbEquipMain }}</h3>
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
        style="margin-top:20px"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <i class="fas fa-wrench"></i>
          </template>

          <template slot="content">
            <p class="category"><strong>Assistants techniques</strong></p>
            <br />
            <h3 class="title">{{ nbAss }}</h3>
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
        style="margin-top:20px"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <i class="fas fa-compact-disc    "></i>
          </template>

          <template slot="content">
            <p class="category"><strong>Equipes de développement</strong></p>
            <br />
            <h3 class="title">{{ nbEquipDev }}</h3>
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
        style="margin-top:20px"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>person</md-icon>
          </template>

          <template slot="content">
            <p class="category"><strong>Développeurs</strong></p>
            <br />
            <h3 class="title">{{ nbDev }}</h3>
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
        <stats-card data-background-color="purple">
          <template slot="header">
            <md-icon>book</md-icon>
          </template>

          <template slot="content">
            <p class="category"><strong>Réclamations</strong></p>
            <br />
            <h3 class="title">{{ nbRecla }}</h3>
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
        <stats-card data-background-color="red">
          <template slot="header">
            <md-icon>settings</md-icon>
          </template>

          <template slot="content">
            <p class="category"><strong>Langages de développement</strong></p>
            <br />
            <h3 class="title">{{ nbLang }}</h3>
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
            <md-icon>edit</md-icon>
          </template>

          <template slot="content">
            <p class="category"><strong>Projets</strong></p>
            <br />
            <h3 class="title">{{ nbProj }}</h3>
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
// STEP 2: Prepare the data
const chartData = [
  {
    label: "Janv",
    value: "0"
  },
  {
    label: "Févr",
    value: "0"
  },
  {
    label: "Mars",
    value: "0"
  },
  {
    label: "Avril",
    value: "0"
  },
  {
    label: "Mai",
    value: "0"
  },
  {
    label: "Juin",
    value: "0"
  },
  {
    label: "Juil",
    value: "0"
  },
  {
    label: "Août",
    value: "0"
  },
  {
    label: "Sept",
    value: "0"
  },
  {
    label: "Oct",
    value: "0"
  },
  {
    label: "Nov",
    value: "0"
  },
  {
    label: "Déc",
    value: "0"
  }
];

// STEP 3: Configure your chart
const dataSource = {
  chart: {
    caption: "Nombre de réclamations par mois",
    subcaption: "" + new Date().getFullYear(),
    xaxisname: "Mois",
    yaxisname: "Nombre de réclamations",
    numbersuffix: "",
    theme: "fusion"
  },
  data: chartData
};

//graphe2

const dataSource1 = {
  chart: {
    caption: "Nombre de projets finalisé et non finalisé par mois",
    yaxisname: "Nombre de projets",
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
      seriesname: "Projet finalisé",
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
    },
    {
      seriesname: "Projet non finalisé",
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
      type: "column3d",
      renderAt: "chart-container",
      width: "605",
      height: "350",
      dataFormat: "json",
      dataSource,
      type1: "msline",
      dataSource1,
      nbEquipMain: 0,
      nbAss: 0,
      nbEquipDev: 0,
      nbDev: 0,
      nbRecla: 0,
      nbLang: 0,
      nbProj: 0,
      donneeR: 0,
      donneePF: 0,
      donneePNF: 0
    };
  },
  methods: {
    getStatsTicket() {
      axios.get("http://localhost:8083/tickets").then(Response => {
        Response.data.forEach(element => {
          (this.donneeR = 0),
            Response.data.forEach(ele => {
              if (
                new Date(element.dateDebut).getMonth() ==
                  new Date(ele.dateDebut).getMonth() &&
                new Date(element.dateDebut).getFullYear() ==
                  new Date().getFullYear()
              ) {
                this.donneeR += 1;
              }
            });

          if (new Date(element.dateDebut).getMonth() == 0) {
            chartData[0].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 1) {
            chartData[1].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 2) {
            chartData[2].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 3) {
            chartData[3].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 4) {
            chartData[4].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 5) {
            chartData[5].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 6) {
            chartData[6].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 7) {
            chartData[7].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 8) {
            chartData[8].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 9) {
            chartData[9].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 10) {
            chartData[10].value = this.donneeR;
          }
          if (new Date(element.dateDebut).getMonth() == 11) {
            chartData[11].value = this.donneeR;
          }
          this.nbRecla += 1;
        });
      });
    }
  },
  created() {
    this.getStatsTicket();
  },
  mounted() {
    axios.get("http://localhost:8083/equipeMaintenances").then(Response => {
      Response.data.forEach(element => {
        this.nbEquipMain += 1;
      });
    });

    axios.get("http://localhost:8083/assistantTechniques").then(Response => {
      Response.data.forEach(element => {
        this.nbAss += 1;
      });
    });

    axios.get("http://localhost:8083/equipeDeveloppements").then(Response => {
      Response.data.forEach(element => {
        this.nbEquipDev += 1;
      });
    });

    axios.get("http://localhost:8083/developpeurs").then(Response => {
      Response.data.forEach(element => {
        this.nbDev += 1;
      });
    });

    axios.get("http://localhost:8083/tickets").then(Response => {
      Response.data.forEach(element => {
        this.nbRecla += 1;
      });
    });

    axios.get("http://localhost:8083/langageDevs").then(Response => {
      Response.data.forEach(element => {
        this.nbLang += 1;
      });
    });

    axios.get("http://localhost:8083/projets").then(Response => {
      Response.data.forEach(element => {
        (this.donneePF = 0),
          (this.donneePNF = 0),
          Response.data.forEach(ele => {
            if (
              new Date(element.dateDebutprojet).getMonth() ==
                new Date(ele.dateDebutprojet).getMonth() &&
              new Date(element.dateDebutprojet).getFullYear() ==
                new Date().getFullYear() &&
              ele.etatProjet == "finalisé"
            ) {
              this.donneePF += 1;
            } else if (
              new Date(element.dateDebutprojet).getMonth() ==
                new Date(ele.dateDebutprojet).getMonth() &&
              new Date(element.dateDebutprojet).getFullYear() ==
                new Date().getFullYear() &&
              ele.etatProjet == "en cours"
            ) {
              this.donneePNF += 1;
            }
          });
        if (
          new Date(element.dateDebutprojet).getMonth() == 0 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[0].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[0].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 1 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[1].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[1].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 2 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[2].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[2].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 3 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[3].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[3].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 4 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[4].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[4].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 5 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[5].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[5].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 6 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[6].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[6].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 7 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[7].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[7].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 8 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[8].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[8].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 9 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[9].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[9].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 10 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[10].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[10].value = this.donneePNF;
        }
        if (
          new Date(element.dateDebutprojet).getMonth() == 11 &&
          element.etatProjet == "finalisé"
        ) {
          dataSource1.dataset[0].data[11].value = this.donneePF;
        } else {
          dataSource1.dataset[1].data[11].value = this.donneePNF;
        }
        this.nbProj += 1;
      });
    });
  }
};
</script>
