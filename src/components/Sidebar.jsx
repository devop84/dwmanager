function Sidebar({ currentPage, onNavigate, onLogout, user, isOpen, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white min-h-screen flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* App Title */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-2xl font-bold">DWMANAGER</h1>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.name || user.email}
              </p>
              <button
                onClick={() => {
                  onNavigate('users')
                  onClose()
                }}
                className={`transition-colors p-1 flex-shrink-0 ${
                  currentPage === 'users'
                    ? 'text-indigo-400'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="User Management"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-3 py-1.5 text-xs font-medium rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => {
                onNavigate('dashboard')
                onClose()
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentPage === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                onNavigate('clients')
                onClose()
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentPage === 'clients'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Clients
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                onNavigate('hotels')
                onClose()
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentPage === 'hotels'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Hotels
            </button>
          </li>
        </ul>
      </nav>
    </div>
    </>
  )
}

export default Sidebar

