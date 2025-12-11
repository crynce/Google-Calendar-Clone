
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const RegisterForm = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('All fields are necessary.')
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      if (res.ok) {
        router.push('/')
      } else {
        const { message } = await res.json()
        setError(message)
      }
    } catch (error) {
      setError('Something went wrong.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700">Full Name</label>
          <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        <button 
          type="submit" 
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          Register
        </button>
        {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  )
}

export default RegisterForm
