import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.projects': 'Projects',
      'nav.teams': 'Teams',
      'nav.members': 'Members',
      
      // Common
      'common.loading': 'Loading...',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.add': 'Add',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.clear': 'Clear',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.confirm': 'Confirm',
      'common.close': 'Close',
      
      // Roles
      'role.manager': 'Manager',
      'role.teamLead': 'Team Lead',
      'role.member': 'Member',
      
      // Dashboard
      'dashboard.title': 'Project Control Center',
      'dashboard.welcome': 'Welcome to your project dashboard',
      'dashboard.totalProjects': 'Total Projects',
      'dashboard.activeProjects': 'Active Projects',
      'dashboard.completedProjects': 'Completed Projects',
      'dashboard.overallProgress': 'Overall Progress',
      
      // Projects
      'projects.title': 'Projects',
      'projects.addProject': 'Add Project',
      'projects.projectName': 'Project Name',
      'projects.manager': 'Manager',
      'projects.deadline': 'Deadline',
      'projects.progress': 'Progress',
      'projects.status': 'Status',
      'projects.actions': 'Actions',
      'projects.noProjects': 'No projects found',
      'projects.createNew': 'Create New Project',
      'projects.editProject': 'Edit Project',
      'projects.deleteProject': 'Delete Project',
      'projects.projectDetails': 'Project Details',
      'projects.teamSelector': 'Team Selection',
      'projects.timeline': 'Timeline',
      'projects.parts': 'Project Parts',
      'projects.addPart': 'Add Part',
      'projects.partName': 'Part Name',
      'projects.weight': 'Weight (%)',
      'projects.todoList': 'Todo List',
      'projects.addTodo': 'Add Todo',
      'projects.todoItem': 'Todo Item',
      'projects.activityLog': 'Activity Log',
      'projects.description': 'Description',
      'projects.selectTeams': 'Select Teams',
      'projects.managerName': 'Manager Name',
      'projects.projectDeadline': 'Project Deadline',
      'projects.projectDescription': 'Project Description',
      'projects.requiredField': 'This field is required',
      'projects.invalidDate': 'Please select a future date',
      'projects.creating': 'Creating project...',
      'projects.projectCreated': 'Project created successfully',
      'projects.createProjectTitle': 'Create New Project',
      'projects.projectForm': 'Project Information',
      
      // Teams
      'teams.title': 'Teams',
      'teams.teamName': 'Team Name',
      'teams.teamLead': 'Team Lead',
      'teams.members': 'Members',
      'teams.progress': 'Team Progress',
      'teams.deadline': 'Team Deadline',
      'teams.selectTeam': 'Select Team',
      'teams.noTeams': 'No teams found',
      'teams.addTeam': 'Add Team',
      'teams.editTeam': 'Edit Team',
      'teams.deleteTeam': 'Delete Team',
      'teams.teamDetails': 'Team Details',
      'teams.memberSelector': 'Select Member',
      
      // Members
      'members.title': 'Members',
      'members.memberName': 'Member Name',
      'members.role': 'Role',
      'members.currentTasks': 'Current Tasks',
      'members.personalTodo': 'Personal To-Do',
      'members.progress': 'Member Progress',
      'members.deadline': 'Member Deadline',
      'members.noMembers': 'No members found',
      'members.addMember': 'Add Member',
      'members.editMember': 'Edit Member',
      'members.deleteMember': 'Delete Member',
      'members.memberDetails': 'Member Details',
      
      // Status
      'status.active': 'Active',
      'status.completed': 'Completed',
      'status.pending': 'Pending',
      'status.overdue': 'Overdue',
      'status.onTrack': 'On Track',
      'status.atRisk': 'At Risk',
      
      // Charts
      'charts.progress': 'Progress',
      'charts.completion': 'Completion',
      'charts.timeline': 'Timeline',
      'charts.overview': 'Overview',
      
      // Settings
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.darkMode': 'Dark Mode',
      'settings.lightMode': 'Light Mode',
      'settings.role': 'Role',
      'settings.changeRole': 'Change Role',
      
      // Notifications
      'notifications.success': 'Success',
      'notifications.error': 'Error',
      'notifications.warning': 'Warning',
      'notifications.info': 'Information',
      'notifications.projectCreated': 'Project created successfully',
      'notifications.projectUpdated': 'Project updated successfully',
      'notifications.projectDeleted': 'Project deleted successfully',
      'notifications.teamCreated': 'Team created successfully',
      'notifications.teamUpdated': 'Team updated successfully',
      'notifications.teamDeleted': 'Team deleted successfully',
      'notifications.memberCreated': 'Member created successfully',
      'notifications.memberUpdated': 'Member updated successfully',
      'notifications.memberDeleted': 'Member deleted successfully',
    }
  },
  ja: {
    translation: {
      // Navigation
      'nav.dashboard': 'ダッシュボード',
      'nav.projects': 'プロジェクト',
      'nav.teams': 'チーム',
      'nav.members': 'メンバー',
      
      // Common
      'common.loading': '読み込み中...',
      'common.save': '保存',
      'common.cancel': 'キャンセル',
      'common.delete': '削除',
      'common.edit': '編集',
      'common.add': '追加',
      'common.back': '戻る',
      'common.next': '次へ',
      'common.previous': '前へ',
      'common.search': '検索',
      'common.filter': 'フィルター',
      'common.clear': 'クリア',
      'common.yes': 'はい',
      'common.no': 'いいえ',
      'common.confirm': '確認',
      'common.close': '閉じる',
      
      // Roles
      'role.manager': 'マネージャー',
      'role.teamLead': 'チームリーダー',
      'role.member': 'メンバー',
      
      // Dashboard
      'dashboard.title': 'プロジェクト管理センター',
      'dashboard.welcome': 'プロジェクトダッシュボードへようこそ',
      'dashboard.totalProjects': 'プロジェクト総数',
      'dashboard.activeProjects': 'アクティブプロジェクト',
      'dashboard.completedProjects': '完了プロジェクト',
      'dashboard.overallProgress': '全体進捗',
      
      // Projects
      'projects.title': 'プロジェクト',
      'projects.addProject': 'プロジェクト追加',
      'projects.projectName': 'プロジェクト名',
      'projects.manager': 'マネージャー',
      'projects.deadline': '期限',
      'projects.progress': '進捗',
      'projects.status': 'ステータス',
      'projects.actions': 'アクション',
      'projects.noProjects': 'プロジェクトが見つかりません',
      'projects.createNew': '新規プロジェクト作成',
      'projects.editProject': 'プロジェクト編集',
      'projects.deleteProject': 'プロジェクト削除',
      'projects.projectDetails': 'プロジェクト詳細',
      'projects.teamSelector': 'チーム選択',
      'projects.timeline': 'タイムライン',
      'projects.parts': 'プロジェクト構成',
      'projects.addPart': '構成追加',
      'projects.partName': '構成名',
      'projects.weight': '重み (%)',
      'projects.todoList': 'To-Doリスト',
      'projects.addTodo': 'To-Do追加',
      'projects.todoItem': 'To-Do項目',
      'projects.activityLog': 'アクティビティログ',
      'projects.description': '説明',
      'projects.selectTeams': 'チーム選択',
      'projects.managerName': 'マネージャー名',
      'projects.projectDeadline': 'プロジェクト期限',
      'projects.projectDescription': 'プロジェクト説明',
      'projects.requiredField': 'このフィールドは必須です',
      'projects.invalidDate': '未来の日付を選択してください',
      'projects.creating': 'プロジェクト作成中...',
      'projects.projectCreated': 'プロジェクトが正常に作成されました',
      'projects.createProjectTitle': '新規プロジェクト作成',
      'projects.projectForm': 'プロジェクト情報',
      
      // Teams
      'teams.title': 'チーム',
      'teams.teamName': 'チーム名',
      'teams.teamLead': 'チームリーダー',
      'teams.members': 'メンバー',
      'teams.progress': 'チーム進捗',
      'teams.deadline': 'チーム期限',
      'teams.selectTeam': 'チーム選択',
      'teams.noTeams': 'チームが見つかりません',
      'teams.addTeam': 'チーム追加',
      'teams.editTeam': 'チーム編集',
      'teams.deleteTeam': 'チーム削除',
      'teams.teamDetails': 'チーム詳細',
      'teams.memberSelector': 'メンバー選択',
      
      // Members
      'members.title': 'メンバー',
      'members.memberName': 'メンバー名',
      'members.role': '役割',
      'members.currentTasks': '現在のタスク',
      'members.personalTodo': '個人To-Do',
      'members.progress': 'メンバー進捗',
      'members.deadline': 'メンバー期限',
      'members.noMembers': 'メンバーが見つかりません',
      'members.addMember': 'メンバー追加',
      'members.editMember': 'メンバー編集',
      'members.deleteMember': 'メンバー削除',
      'members.memberDetails': 'メンバー詳細',
      
      // Status
      'status.active': 'アクティブ',
      'status.completed': '完了',
      'status.pending': '保留中',
      'status.overdue': '期限超過',
      'status.onTrack': '順調',
      'status.atRisk': 'リスク',
      
      // Charts
      'charts.progress': '進捗',
      'charts.completion': '完了率',
      'charts.timeline': 'タイムライン',
      'charts.overview': '概要',
      
      // Settings
      'settings.title': '設定',
      'settings.language': '言語',
      'settings.darkMode': 'ダークモード',
      'settings.lightMode': 'ライトモード',
      'settings.role': '役割',
      'settings.changeRole': '役割変更',
      
      // Notifications
      'notifications.success': '成功',
      'notifications.error': 'エラー',
      'notifications.warning': '警告',
      'notifications.info': '情報',
      'notifications.projectCreated': 'プロジェクトが正常に作成されました',
      'notifications.projectUpdated': 'プロジェクトが正常に更新されました',
      'notifications.projectDeleted': 'プロジェクトが正常に削除されました',
      'notifications.teamCreated': 'チームが正常に作成されました',
      'notifications.teamUpdated': 'チームが正常に更新されました',
      'notifications.teamDeleted': 'チームが正常に削除されました',
      'notifications.memberCreated': 'メンバーが正常に作成されました',
      'notifications.memberUpdated': 'メンバーが正常に更新されました',
      'notifications.memberDeleted': 'メンバーが正常に削除されました',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 