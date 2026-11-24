import { useEffect, useState } from 'react'

interface UserRecord {
  id: number
  nev: string
  eletkor: number
  regisztracio_datuma: string
  aktiv: boolean
  egyenleg: number
  erdeklodesi_korok: string[]
}

interface UserResponse {
  skibi: UserRecord[]
}

function User() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch('/vmi.json')
        if (!response.ok) {
          throw new Error(`A felhasználói adatok betöltése nem sikerült (${response.status}).`)
        }

        const data: UserResponse = await response.json()
        setUsers(data.skibi)
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'A felhasználói adatok betöltése nem sikerült.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadUsers()
  }, [])

  return (
    <main className="container py-5 text-start">
      <div className="mb-4">
        <h1 className="h2 mb-2">Felhasználók</h1>
      </div>

      {loading && (
        <div className="text-center py-5" role="status">
          <div className="spinner-border text-primary" aria-hidden="true" />
          <span className="visually-hidden">Betöltés...</span>
        </div>
      )}

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Név</th>
                <th scope="col">Életkor</th>
                <th scope="col">Regisztráció dátuma</th>
                <th scope="col">Állapot</th>
                <th scope="col" className="text-end">Egyenleg</th>
                <th scope="col">Érdeklődési körök</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <th scope="row">{user.id}</th>
                  <td className="fw-semibold">{user.nev}</td>
                  <td>{user.eletkor} év</td>
                  <td>{new Date(user.regisztracio_datuma).toLocaleDateString('hu-HU')}</td>
                  <td>
                    <span className={`badge ${user.aktiv ? 'text-bg-success' : 'text-bg-secondary'}`}>
                      {user.aktiv ? 'Aktív' : 'Inaktív'}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    {new Intl.NumberFormat('hu-HU', {
                      style: 'currency',
                      currency: 'HUF',
                      maximumFractionDigits: 2,
                    }).format(user.egyenleg)}
                  </td>
                  <td>{user.erdeklodesi_korok.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default User