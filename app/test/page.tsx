'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [mounted, setMounted] = useState(false)
  const [touchDevice, setTouchDevice] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTouchDevice('ontouchstart' in window)
  }, [])

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '32px',
        marginBottom: '20px',
        color: '#333'
      }}>
        🧪 Test Page - IdeaNoter
      </h1>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#555' }}>
          ✅ React fonctionne !
        </h2>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Mounted: {mounted ? '✅ Oui' : '❌ Non'}
        </p>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Touch Device: {touchDevice ? '✅ Oui' : '❌ Non'}
        </p>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Screen Width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px
        </p>
        <p style={{ fontSize: '16px', color: '#666' }}>
          User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'N/A'}...
        </p>
      </div>

      <div style={{
        backgroundColor: '#e8f5e9',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #4caf50'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#2e7d32' }}>
          ✅ Si vous voyez ce message
        </h2>
        <p style={{ fontSize: '16px', color: '#1b5e20' }}>
          Cela signifie que React et Next.js fonctionnent correctement sur votre iPhone.
          Le problème vient probablement de la connexion InstantDB.
        </p>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '2px solid #ffc107'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#856404' }}>
          📋 Instructions
        </h3>
        <p style={{ fontSize: '14px', color: '#856404' }}>
          1. Si vous voyez cette page → React fonctionne ✅<br/>
          2. Retournez à l'app principale et dites-moi ce que vous voyez<br/>
          3. Je vais corriger le problème InstantDB
        </p>
      </div>
    </div>
  )
}
