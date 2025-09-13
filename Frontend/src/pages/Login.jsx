import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', showPassword: false })
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const errors = useMemo(() => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password required'
    return e
  }, [form])

  const isValid = Object.keys(errors).length === 0

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(t => ({ ...t, [name]: true }))
  }

  function togglePassword() {
    setForm(f => ({ ...f, showPassword: !f.showPassword }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!isValid) return
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      // Simulated network delay
      await new Promise(r => setTimeout(r, 800))
      // Fake credential check placeholder
      if (form.email === 'test@test.com' && form.password === 'test123') {
        setSuccess(true)
      } else {
        throw new Error('Invalid credentials (try test@test.com / test123)')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <header className="login-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard.</p>
        </header>
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="input-shell">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                autoComplete="username"
              />
            </div>
            {touched.email && errors.email && <small id="err-email" style={{ color: 'var(--color-danger)' }}>{errors.email}</small>}
          </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-shell">
                <input
                  id="password"
                  name="password"
                  type={form.showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'err-password' : undefined}
                  autoComplete="current-password"
                />
                <button type="button" className="password-toggle" onClick={togglePassword} aria-label={form.showPassword ? 'Hide password' : 'Show password'}>
                  {form.showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {touched.password && errors.password && <small id="err-password" style={{ color: 'var(--color-danger)' }}>{errors.password}</small>}
            </div>

          <div className="actions">
            <button type="submit" className="submit-btn" disabled={!isValid || submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
            <div className="alt-link">Don't have an account? <Link to="/register">Create one</Link></div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)' }}>{error}</div>}
            {success && <div style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>Login successful!</div>}
          </div>
        </form>
        <footer className="login-footer">© {new Date().getFullYear()} Your Company. All rights reserved.</footer>
      </div>
    </div>
  )
}
