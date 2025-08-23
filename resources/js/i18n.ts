import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Teams from "./pages/teams";
import Users from "./pages/users";
import { LogOut, Settings } from "lucide-react";
import Profile from "./pages/settings/profile";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      logout: "Logout",
      dashboard: "Dashboard",
      Roles: "Roles",
      name: "Name",
      guard_name: "Guard Name",
      permissions: "Permissions",
      updated_at: "Updated At",
      "A list of roles including their name, gard name and permissions.": "A list of roles including their name, gard name and permissions.",
      View: "View",
      Edit: "Edit",
      Delete: "Delete",
      "Manage roles and permissions": "Manage roles and permissions",
      "Search ...": "Search ...",
      "Add New Role": "Add New Role",
      "Add New": "Add New",
      Columns: "Columns",
      Filters: "Filters",
      Actions: "Actions",
      Import: "Import",
      Export: "Export",
      "Available permissions": "Available permissions",
      DASHBOARD: "DASHBOARD",
      DATA: "DATA",
      STATS: "STATS",
      ROLE: "ROLE",
      TEAM: "TEAM",
      USER: "USER",
      SHOW: "SHOW",
      MANAGE: "MANAGE",
      LIST: "LIST",
      CREATE: "CREATE",
      EDIT: "EDIT",
      DELETE: "DELETE",
      "Last Updated": "Last Updated",
      Cancel: "Cancel",
      "Create Role": "Create Role",
      "Edit Role": "Edit Role",
      "Save Changes": "Save Changes",
      "Are you sure you want to delete this role": "Are you sure you want to delete this role",
      Teams: "Teams",
      Users: "Users",
      Settings: "Settings",
      Profile: "Profile",
      LogOut: "Log Out"
    }
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
      logout: "Se déconnecter",
      dashboard: "Tableau de bord",
      Roles: "Rôles",
      name: "Nom",
      guard_name: "Nom de garde",
      permissions: "Permissions",
      updated_at: "Modifié le",
      "A list of roles including their name, gard name and permissions.": "Une liste de rôles, y compris leur nom, leur garde et leurs autorisations",
      View: "Voir",
      Edit: "Modifier",
      Delete: "Supprimer",
      "Manage roles and permissions": "Gérer les rôles et les autorisations",
      "Search ...": "Chercher ...",
      "Add New Role": "Ajouter un rôle",
      "Add New": "Ajouter un",
      Columns: "Colonnes",
      Filters: "Filtres",
      Actions: "Actions",
      Import: "Importer",
      Export: "Exporter",
      "Available permissions": "Permissions disponibles",
      DASHBOARD: "DASHBOARD",
      DATA: "DONNÉES",
      STATS: "STATS",
      ROLE: "ROLE",
      TEAM: "ÉQUIPE",
      USER: "UTILISATEUR",
      SHOW: "VOIR",
      MANAGE: "GÉRER",
      LIST: "LISTE",
      CREATE: "CRÉER",
      EDIT: "MODIFIER",
      DELETE: "SUPPRIMER",
      "Last Updated": "Dernière mise à jour",
      Cancel: "Annuler",
      "Create Role": "Créer un rôle",
      "Edit Role": "Modifier le rôle",
      "Save Changes": "Sauvegarder",
      "Are you sure you want to delete this role": "Êtes-vous sûr de vouloir supprimer ce rôle",
      Teams: "Equipes",
      Users: "Utilisateurs",
      Settings: "Paramètre",
      Profile: "Profil",
      LogOut: "Se déconnecter"
    }
  },
  ar: {
    translation: {
      welcome: "مرحبا",
      logout: "تسجيل الخروج",
      dashboard: "لوحة التحكم",
      name: "Nom",
      guard_name: "Nom de garde",
      permissions: "Permissions",
      updated_at: "Modifié le"
    }
  }
};

i18n
  .use(LanguageDetector) // detect language from localStorage, browser, etc.
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
