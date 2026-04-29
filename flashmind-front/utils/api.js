const BASE_URL = '/api'

async function request(method, path, body) {
  const token = localStorage.getItem('flashmind_token')

  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  if (res.status === 401 && path !== '/auth/login') {
    localStorage.removeItem('flashmind_token')
    localStorage.removeItem('flashmind_user')
    window.router?.navigate('/login')
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  const text = await res.text()
  const json = text ? JSON.parse(text) : {}

  if (res.status === 401 && path === '/auth/login') {
    throw new Error(json.message || 'E-mail ou senha incorretos')
  }

  if (!res.ok) {
    throw new Error(json.message || `Erro ${res.status}`)
  }

  return json
}

export const Api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  put:    (path, body)   => request('PUT',    path, body),
  patch:  (path, body)   => request('PATCH',  path, body),
  delete: (path)         => request('DELETE', path),
}
