import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Hotels from './pages/Hotels'
import AddClient from './pages/AddClient'
import Users from './pages/Users'
import Login from './pages/Login'
import { getSession, deleteSession } from './lib/auth.js'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editClientId, setEditClientId] = useState(null)
  const [clientsRefreshTrigger, setClientsRefreshTrigger] = useState(0)
  const [usersRefreshTrigger, setUsersRefreshTrigger] = useState(0)

  // Check if user is logged in on mount using session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionToken = localStorage.getItem('kiteManager_session')
        if (sessionToken) {
          const session = await getSession(sessionToken)
          if (session && session.user) {
            setUser(session.user)
            setIsAuthenticated(true)
          } else {
            // Invalid or expired session
            localStorage.removeItem('kiteManager_session')
          }
        }
      } catch (error) {
        console.error('Session check error:', error)
        localStorage.removeItem('kiteManager_session')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem('kiteManager_session')
      if (sessionToken) {
        await deleteSession(sessionToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('kiteManager_session')
      setCurrentPage('dashboard')
    }
  }

  const handleNavigate = (page, clientId = null) => {
    setCurrentPage(page)
    if (clientId) {
      setEditClientId(clientId)
    } else {
      setEditClientId(null)
    }
  }

  const handleClientSave = () => {
    setCurrentPage('clients')
    setEditClientId(null)
    setClientsRefreshTrigger(prev => prev + 1)
  }

  const handleClientCancel = () => {
    setCurrentPage('clients')
    setEditClientId(null)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'clients':
        return <Clients onNavigate={handleNavigate} refreshTrigger={clientsRefreshTrigger} />
      case 'add-client':
        return <AddClient onSave={handleClientSave} onCancel={handleClientCancel} />
      case 'edit-client':
        return <AddClient clientId={editClientId} onSave={handleClientSave} onCancel={handleClientCancel} />
      case 'hotels':
        return <Hotels />
      case 'users':
        return <Users onNavigate={handleNavigate} refreshTrigger={usersRefreshTrigger} />
      default:
        return <Dashboard />
    }
  }

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
      />
    )
  }

  // Show main app if authenticated
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 bg-white w-full md:w-auto">
        {/* Mobile Header with Burger Menu */}
        <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold">DWMANAGER</h1>
          <div className="w-6"></div>
        </div>
        {renderPage()}
      </div>
    </div>
  )
}

export default App

