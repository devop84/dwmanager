import { useState, useEffect } from 'react'
import sql from '../lib/neon.js'

function AddClient({ clientId, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome_cliente: '',
    tel_celular: '',
    email: '',
    nacionalidade: '',
    obs: '',
    cpf: '',
    data_nasc: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEditMode = !!clientId

  // Load client data if editing
  useEffect(() => {
    if (clientId) {
      fetchClient()
    }
  }, [clientId])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const result = await sql`SELECT * FROM clients WHERE id = ${clientId}`
      if (result.length > 0) {
        const client = result[0]
        setFormData({
          nome_cliente: client.nome_cliente || '',
          tel_celular: client.tel_celular || '',
          email: client.email || '',
          nacionalidade: client.nacionalidade || '',
          obs: client.obs || '',
          cpf: client.cpf || '',
          data_nasc: client.data_nasc ? client.data_nasc.split('T')[0] : ''
        })
      }
    } catch (err) {
      console.error('Error fetching client:', err)
      setError('Failed to load client data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isEditMode) {
        // Update existing client
        await sql`
          UPDATE clients 
          SET nome_cliente = ${formData.nome_cliente || null},
              tel_celular = ${formData.tel_celular || null},
              email = ${formData.email || null},
              nacionalidade = ${formData.nacionalidade || null},
              obs = ${formData.obs || null},
              cpf = ${formData.cpf || null},
              data_nasc = ${formData.data_nasc || null},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${clientId}
        `
      } else {
        // Get next ID
        const maxIdResult = await sql`SELECT MAX(id) as max_id FROM clients`
        const nextId = (maxIdResult[0]?.max_id || 0) + 1

        // Insert new client
        await sql`
          INSERT INTO clients (id, nome_cliente, tel_celular, email, nacionalidade, obs, cpf, data_nasc)
          VALUES (${nextId}, ${formData.nome_cliente || null}, ${formData.tel_celular || null}, 
                  ${formData.email || null}, ${formData.nacionalidade || null}, 
                  ${formData.obs || null}, ${formData.cpf || null}, ${formData.data_nasc || null})
        `
      }

      if (onSave) {
        onSave()
      }
    } catch (err) {
      console.error('Error saving client:', err)
      setError(isEditMode ? 'Failed to update client' : 'Failed to create client')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Loading client data...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Go back"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Client' : 'Add Client'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nome_cliente" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="nome_cliente"
              name="nome_cliente"
              value={formData.nome_cliente}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="tel_celular" className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              id="tel_celular"
              name="tel_celular"
              value={formData.tel_celular}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="nacionalidade" className="block text-sm font-medium text-gray-700 mb-2">
              Nationality
            </label>
            <input
              type="text"
              id="nacionalidade"
              name="nacionalidade"
              value={formData.nacionalidade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="data_nasc" className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <input
              type="date"
              id="data_nasc"
              name="data_nasc"
              value={formData.data_nasc}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="obs" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="obs"
              name="obs"
              value={formData.obs}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Client' : 'Create Client'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClient

