import DashboardLayoutAdmin from "@/pages/Layout/DashboardLayoutAdmin.vue";
import AccueilAdmin from "@/pages/AccueilAdmin.vue";
import DashboardLayoutCommercial from "@/pages/Layout/DashboardLayoutCommercial.vue";
import DashboardTicketClient from "@/pages/Layout/DashboardTicketClient.vue";
import AccueilCommercial from "@/pages/AccueilCommercial.vue";
import DashboardLayoutChefPers from "@/pages/Layout/DashboardLayoutChefPers.vue";
import AccueilChefPers from "@/pages/AccueilChefPers.vue";
import DashboardLayoutAssChef from "@/pages/Layout/DashboardLayoutAssChef.vue";
import AccueilAssChef from "@/pages/AccueilAssChef.vue";
import AcceuilClient from "@/components/AcceuilClient.vue";
import AuthClient from "@/AuthClient/AuthClient.vue";
import Register from "@/AuthClient/Register.vue";
import Inscription from "@/components/Inscription.vue";
import Authentification from "@/components/Authentification.vue";
import ListeInscription from "@/components/ListeInscription.vue";
import StatsReclamation from "@/components/StatsReclamation.vue";
import ListeUtilisateurs from "@/components/ListeUtilisateurs.vue";
import ListeProjets from "@/components/ListeProjets.vue";
import ListeLangageDev from "@/components/ListeLangageDev.vue";
import ListeDeveloppeurs from "@/components/ListeDeveloppeurs.vue";
import ListeAssistants from "@/components/ListeAssistants.vue";
import AffecterEquipe from "@/components/AffecterEquipe.vue";
import ListeEquipeDev from "@/components/ListeEquipeDev.vue";
import ListeEquipeMain from "@/components/ListeEquipeMain.vue";
import ListeReclamations from "@/components/ListeReclamations.vue";
import CreerProjet from "@/components/CreerProjet.vue";
import ListeCommentaires from "@/components/ListeCommentaires.vue";
import CommentaireClient from "@/components/CommentaireClient.vue";
import AffecterProjets from "@/components/AffecterProjets.vue";
import ListeAffectation from "@/components/ListeAffectation.vue";
import MesTickets from "@/components/MesTickets.vue";
import CompteRendu from "@/components/CompteRendu.vue";
import ListeProduits from "@/components/ListeProduits.vue";
import ListeSocietes from "@/components/ListeSocietes.vue";
import AfficherTickets from "@/components/AfficherTickets.vue";
import LigneProduits from "@/components/LigneProduits.vue";
const routes = [
  { path: "/", component: Inscription },
  { path: "/Connexion", component: AuthClient },
  { path: "/Enregistrement", component: Register },
  { path: "/Authentification", component: Authentification },
  { path: "/AcceuilClient", component: AcceuilClient },
  { path: "/ListeReclamations", component: ListeReclamations },
  { path: "/ListeCommentaires", component: ListeCommentaires },
  { path: "/AfficherTickets", component: AfficherTickets },
    { 
    path: "/",
    component: DashboardTicketClient,
    redirect: "/StatsReclamation",
    children: [
      {
        path: "statsreclamation",
        name: "Nos offres",
        component: StatsReclamation
      }
    ]
  },
  { 
    path: "/",
    component: DashboardTicketClient,
    redirect: "/CommentaireClient",
    children: [
      {
        path: "Commentaireclient",
        name: "Commentaires",
        component: CommentaireClient
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutAdmin,
    redirect: "/accueiladmin",
    children: [
      {
        path: "accueiladmin",
        name: "Accueil Administrateur",
        component: AccueilAdmin
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutAdmin,
    redirect: "/listeinscription",
    children: [
      {
        path: "listeinscription",
        name: "Liste des inscriptions",
        component: ListeInscription
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutAdmin,
    redirect: "/listeutilisateurs",
    children: [
      {
        path: "listeutilisateurs",
        name: "Liste des utilisateurs",
        component: ListeUtilisateurs
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutCommercial,
    redirect: "/accueilcommercial",
    children: [
      {
        path: "accueilcommercial",
        name: "Accueil Commercial",
        component: AccueilCommercial
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutCommercial,
    redirect: "/listeproduits",
    children: [
      {
        path: "listeproduits",
        name: "Liste des produits",
        component: ListeProduits
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutCommercial,
    redirect: "/listesocietes",
    children: [
      {
        path: "listesocietes",
        name: "Liste des sociétés",
        component: ListeSocietes
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutCommercial,
    redirect: "/ligneProduits",
    children: [
      {
        path: "ligneProduits",
        name: "Liste des lignes produits",
        component: LigneProduits
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/accueilchefpers",
    children: [
      {
        path: "accueilchefpers",
        name: "Accueil Chef personnel",
        component: AccueilChefPers
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/listeEquipeMain",
    children: [
      {
        path: "listeEquipeMain",
        name: "Liste des equipes de maintenance",
        component: ListeEquipeMain
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/listeAssistants",
    children: [
      {
        path: "listeAssistants",
        name: "Liste des assistants techniques",
        component: ListeAssistants
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/listeEquipeDev",
    children: [
      {
        path: "listeEquipeDev",
        name: "Liste des equipes de développement",
        component: ListeEquipeDev
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/listeDeveloppeurs",
    children: [
      {
        path: "listeDeveloppeurs",
        name: "Liste des développeurs",
        component: ListeDeveloppeurs
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/affecterProjets",
    children: [
      {
        path: "affecterProjets",
        name: "Liste des réclamations",
        component: AffecterProjets
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/listeLangageDev",
    children: [
      {
        path: "listeLangageDev",
        name: "Liste des langages de développement",
        component: ListeLangageDev
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/listeProjets",
    children: [
      {
        path: "listeProjets",
        name: "Liste des projets",
        component: ListeProjets
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/creerProjet",
    children: [
      {
        path: "creerProjet",
        name: "Nouveau projet",
        component: CreerProjet
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutChefPers,
    redirect: "/affecterEquipe",
    children: [
      {
        path: "affecterEquipe",
        name: "Affectations des développeurs",
        component: AffecterEquipe
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutAssChef,
    redirect: "/accueilasschef",
    children: [
      {
        path: "accueilasschef",
        name: "Accueil Assistant",
        component: AccueilAssChef
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutAssChef,
    redirect: "/mesTickets",
    children: [
      {
        path: "mesTickets",
        name: "Liste de mes réclamations",
        component: MesTickets
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutAssChef,
    redirect: "/compteRendu",
    children: [
      {
        path: "compteRendu",
        name: "Liste des comptes rendus",
        component: CompteRendu
      }
    ]
  },
  {
    path: "/",
    component: DashboardLayoutAssChef,
    redirect: "/listeAffectation",
    children: [
      {
        path: "listeAffectation",
        name: "Liste des affectations",
        component: ListeAffectation
      }
    ]
  }
];

export default routes;
