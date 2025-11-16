'use client'

import { useEffect, useState } from 'react'

export default function PWACheckPage() {
  const [isStandalone, setIsStandalone] = useState(false)
  const [displayMode, setDisplayMode] = useState('')
  const [userAgent, setUserAgent] = useState('')

  useEffect(() => {
    // Vérifier si l'app est en mode standalone
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone ||
                      document.referrer.includes('android-app://')

    setIsStandalone(standalone)

    // Détecter le mode d'affichage
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setDisplayMode('standalone')
    } else if (window.matchMedia('(display-mode: fullscreen)').matches) {
      setDisplayMode('fullscreen')
    } else if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      setDisplayMode('minimal-ui')
    } else {
      setDisplayMode('browser')
    }

    setUserAgent(navigator.userAgent)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">🔍 Diagnostic PWA</h1>

        <div className="space-y-4">
          {/* Status principal */}
          <div className={`p-4 rounded-lg ${isStandalone ? 'bg-green-100 border-2 border-green-500' : 'bg-yellow-100 border-2 border-yellow-500'}`}>
            <h2 className="font-bold text-lg mb-2">
              {isStandalone ? '✅ Mode Plein Écran ACTIF' : '⚠️ Mode Navigateur'}
            </h2>
            <p className="text-sm">
              {isStandalone
                ? "Parfait! L'application est en mode standalone (plein écran)."
                : "L'application s'ouvre dans le navigateur Safari."}
            </p>
          </div>

          {/* Mode d'affichage */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Mode d'affichage:</h3>
            <p className="font-mono text-sm bg-white p-2 rounded">{displayMode}</p>
          </div>

          {/* Instructions si pas en standalone */}
          {!isStandalone && (
            <div className="bg-orange-50 border-2 border-orange-300 p-4 rounded-lg">
              <h3 className="font-bold mb-3">📱 Pour activer le mode plein écran:</h3>
              <ol className="list-decimal ml-5 space-y-2 text-sm">
                <li>Touchez le bouton <strong>Partager</strong> (carré avec flèche ↑) en bas de Safari</li>
                <li>Faites défiler et touchez <strong>"Sur l'écran d'accueil"</strong></li>
                <li>Touchez <strong>"Ajouter"</strong></li>
                <li><strong>Fermez Safari</strong></li>
                <li>Ouvrez l'app depuis l'<strong>icône sur votre écran d'accueil</strong></li>
              </ol>
            </div>
          )}

          {/* Info succès */}
          {isStandalone && (
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
              <h3 className="font-bold mb-2">🎉 Succès!</h3>
              <p className="text-sm">
                Votre application fonctionne en mode plein écran. La barre Safari ne devrait pas être visible.
              </p>
              <p className="text-sm mt-2">
                Vous pouvez maintenant retourner à l'<a href="/" className="text-blue-600 underline">application principale</a>.
              </p>
            </div>
          )}

          {/* User Agent */}
          <details className="bg-gray-50 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">Informations techniques</summary>
            <div className="mt-3 space-y-2 text-xs">
              <div>
                <strong>User Agent:</strong>
                <p className="font-mono bg-white p-2 rounded mt-1 break-all">{userAgent}</p>
              </div>
              <div>
                <strong>Display Mode:</strong>
                <p className="font-mono bg-white p-2 rounded mt-1">{displayMode}</p>
              </div>
              <div>
                <strong>Standalone:</strong>
                <p className="font-mono bg-white p-2 rounded mt-1">{isStandalone ? 'true' : 'false'}</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
