import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './authContext';
import './loginPage.css'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Convertir datos a formato x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const response = await fetch('https://sanfelipe-gchccshmg4b9f7b9.canadacentral-01.azurewebsites.net', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const token = await response.text();
        console.log('Token recibido:', token);
        localStorage.setItem('token', token);
        login();
        navigate('/services');
      } else {
        const errorText = await response.text();
        console.error('Error del servidor:', response.status, errorText);
        
        if (response.status === 403) {
          setError('Usuario o contraseña incorrectos');
        } else if (response.status === 503 || response.status === 502) {
          setError('El servidor está iniciando. Espera 30 segundos e intenta de nuevo.');
        } else {
          setError(errorText || 'Error al iniciar sesión');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'AbortError') {
        setError('El servidor está tardando mucho. Intenta nuevamente en 1 minuto.');
      } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
        setError('El servidor está iniciando (puede tardar 1-2 minutos). Por favor espera e intenta de nuevo.');
      } else {
        setError('Error al conectar. Verifica tu conexión a internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <h2>Bienvenido</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingresa tu usuario"
            />
            <i className="icon-user"></i>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
            <i className="icon-lock"></i>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="footer-links">
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
            <a href="/register">Crear una cuenta</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
