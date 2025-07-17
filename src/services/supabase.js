import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Users/Members API
export const usersService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Projects API
export const projectsService = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        manager:users!projects_manager_id_fkey(*),
        project_teams!inner(
          team:teams(
            *,
            lead:users!teams_lead_id_fkey(*),
            team_members(
              user:users(*)
            )
          )
        ),
        project_parts(
          *,
          todos(*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform data to match current structure
    return data.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      manager: project.manager?.name || 'Unknown',
      deadline: project.deadline,
      progress: project.progress,
      status: project.status,
      teams: project.project_teams?.map(pt => pt.team.id) || [],
      parts: project.project_parts?.map(part => ({
        id: part.id,
        name: part.name,
        description: part.description,
        weight: part.weight,
        progress: part.progress,
        todos: part.todos || []
      })) || [],
      activityLog: project.activity_log || []
    }))
  },

  async createProject(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: projectData.name,
        description: projectData.description,
        manager_id: projectData.managerId,
        deadline: projectData.deadline,
        progress: 0,
        status: 'active'
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProject(id, projectData) {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Teams API
export const teamsService = {
  async getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        lead:users!teams_lead_id_fkey(*),
        project:projects(*),
        team_members(
          user:users(*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform data to match current structure
    return data.map(team => ({
      id: team.id,
      name: team.name,
      lead: team.lead?.name || 'Unknown',
      members: team.team_members?.map(tm => tm.user.id) || [],
      projectId: team.project_id,
      progress: team.progress,
      deadline: team.deadline
    }))
  },

  async createTeam(teamData) {
    const { data, error } = await supabase
      .from('teams')
      .insert([{
        name: teamData.name,
        lead_id: teamData.leadId,
        project_id: teamData.projectId,
        progress: 0,
        deadline: teamData.deadline
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTeam(id, teamData) {
    const { data, error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteTeam(id) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Project Parts API
export const projectPartsService = {
  async createProjectPart(projectId, partData) {
    const { data, error } = await supabase
      .from('project_parts')
      .insert([{
        project_id: projectId,
        name: partData.name,
        description: partData.description,
        weight: partData.weight,
        progress: partData.progress || 0
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProjectPart(id, partData) {
    const { data, error } = await supabase
      .from('project_parts')
      .update(partData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProjectPart(id) {
    const { error } = await supabase
      .from('project_parts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Todos API
export const todosService = {
  async createTodo(todoData) {
    const { data, error } = await supabase
      .from('todos')
      .insert([todoData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTodo(id, todoData) {
    const { data, error } = await supabase
      .from('todos')
      .update(todoData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Team Members API
export const teamMembersService = {
  async addTeamMember(teamId, userId) {
    const { data, error } = await supabase
      .from('team_members')
      .insert([{ team_id: teamId, user_id: userId }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async removeTeamMember(teamId, userId) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId)
    
    if (error) throw error
  }
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToProjects(callback) {
    return supabase
      .channel('projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        callback
      )
      .subscribe()
  },

  subscribeToTeams(callback) {
    return supabase
      .channel('teams')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'teams' }, 
        callback
      )
      .subscribe()
  },

  subscribeToUsers(callback) {
    return supabase
      .channel('users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        callback
      )
      .subscribe()
  }
}

export default supabase 