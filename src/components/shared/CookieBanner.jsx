import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { loadGA4, getConsent, setConsent } from '../../utils/analytics'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getConsent()
    if (consent === null) {
      setVisible(true)
    } else if (consent === 'accepted') {
      loadGA4()
    }
  }, [])

  function accept() {
    setConsent(true)
    loadGA4()
    setVisible(false)
  }

  function decline() {
    setConsent(false)
    setVisible(false)
  }

    return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-brand-blue border-t-2 border-brand-red px-6 py-4 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-white/80 max-w-2xl">
              We use Google Analytics to understand how visitors use our site — all data is anonymised.
              See our{' '}
              <Link to="/privacy" className="text-white underline underline-offset-2 hover:text-white/70 transition-colors">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={decline}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 px-4 py-2"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="text-sm font-semibold bg-brand-red text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Accept analytics
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )  
}
