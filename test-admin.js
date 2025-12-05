// Script para verificar y crear admin
if (typeof window !== 'undefined') {
  const users = localStorage.getItem('athletixy_users')
  console.log('Usuarios actuales:', users)
  
  if (users) {
    const parsed = JSON.parse(users)
    console.log('Parsed:', parsed)
    const admin = parsed.find(u => u.email === 'admin@athletixy.com')
    console.log('Admin encontrado:', admin)
  }
}
