import { useState, useEffect } from 'react'
import sql from '../lib/neon.js'

function Clients({ onNavigate, refreshTrigger }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortColumn, setSortColumn] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(30)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch clients from database
  useEffect(() => {
    fetchClients()
  }, [refreshTrigger])

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError('')
      const result = await sql`SELECT * FROM clients ORDER BY id ASC`
      setClients(result)
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError('Failed to load clients. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle column header click for sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Sort clients
  const sortedClients = [...clients].sort((a, b) => {
    let aVal = a[sortColumn]
    let bVal = b[sortColumn]

    // Handle null/undefined values
    if (aVal == null) aVal = ''
    if (bVal == null) bVal = ''

    // Numeric sorting for ID column
    if (sortColumn === 'id') {
      const aNum = Number(aVal)
      const bNum = Number(bVal)
      
      // If both are valid numbers, compare numerically
      if (!isNaN(aNum) && !isNaN(bNum)) {
        if (sortDirection === 'asc') {
          return aNum - bNum
        } else {
          return bNum - aNum
        }
      }
    }

    // String comparison for other columns
    aVal = String(aVal).toLowerCase()
    bVal = String(bVal).toLowerCase()

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })

  // Filter clients by search term
  const filteredClients = sortedClients.filter((client) => {
    if (!searchTerm) return true
    
    const search = searchTerm.toLowerCase()
    return (
      String(client.id || '').toLowerCase().includes(search) ||
      String(client.nome_cliente || '').toLowerCase().includes(search) ||
      String(client.tel_celular || '').toLowerCase().includes(search) ||
      String(client.email || '').toLowerCase().includes(search) ||
      String(client.nacionalidade || '').toLowerCase().includes(search) ||
      String(client.obs || '').toLowerCase().includes(search) ||
      String(client.cpf || '').toLowerCase().includes(search) ||
      String(client.data_nasc || '').toLowerCase().includes(search)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedClients = filteredClients.slice(startIndex, endIndex)

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return
    }

    try {
      await sql`DELETE FROM clients WHERE id = ${id}`
      await fetchClients()
    } catch (err) {
      console.error('Error deleting client:', err)
      alert('Failed to delete client. Please try again.')
    }
  }

  // Handle edit - navigate to edit page
  const handleEdit = (clientId) => {
    if (onNavigate) {
      onNavigate('edit-client', clientId)
    }
  }

  // Handle add client
  const handleAddClient = () => {
    if (onNavigate) {
      onNavigate('add-client')
    }
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  // Render sort indicator
  const renderSortIndicator = (column) => {
    if (sortColumn !== column) return null
    return sortDirection === 'asc' ? ' ↑' : ' ↓'
  }

  // Render pagination component
  const renderPagination = (isTop = false) => {
    if (totalPages <= 1) return null
    
    return (
      <div className={`bg-white px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 border border-gray-200 rounded-lg shadow-sm ${isTop ? 'mb-4' : 'mt-4'}`}>
        <div className="text-xs md:text-sm text-gray-700 text-center md:text-left">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredClients.length)} of {filteredClients.length} clients
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <span className="hidden sm:inline">First</span>
            <span className="sm:hidden">«</span>
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">‹</span>
          </button>
          <span className="px-2 md:px-3 py-1 text-xs md:text-sm text-gray-700 whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">›</span>
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <span className="hidden sm:inline">Last</span>
            <span className="sm:hidden">»</span>
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Clients</h1>
        <div className="text-gray-600">Loading clients...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={handleAddClient}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          title="Add Client"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden sm:inline">Add Client</span>
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Pagination above table */}
      {renderPagination(true)}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  ID{renderSortIndicator('id')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('nome_cliente')}
                >
                  Name{renderSortIndicator('nome_cliente')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('tel_celular')}
                >
                  Phone{renderSortIndicator('tel_celular')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  Email{renderSortIndicator('email')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('nacionalidade')}
                >
                  Nationality{renderSortIndicator('nacionalidade')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('obs')}
                >
                  Notes{renderSortIndicator('obs')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('cpf')}
                >
                  CPF{renderSortIndicator('cpf')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('data_nasc')}
                >
                  Birth Date{renderSortIndicator('data_nasc')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No clients found
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.nome_cliente || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.tel_celular || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.nacionalidade || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {client.obs || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.cpf || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(client.data_nasc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(client.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination below table */}
      {renderPagination()}
    </div>
  )
}

export default Clients
