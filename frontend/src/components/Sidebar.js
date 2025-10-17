"use client"

import { useEffect } from "react"

function Sidebar({ isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const navItems = [
    { icon: "home", label: "Home", href: "#home" },
    { icon: "upload", label: "Upload", href: "#upload" },
    { icon: "file", label: "Files", href: "#files" },
    { icon: "settings", label: "Settings", href: "#settings" },
  ]

  const renderIcon = (iconName) => {
    const icons = {
      home: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      upload: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      ),
      file: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
      ),
      settings: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m-2 2l-4.2 4.2m13.2-5.2l-6 0m-6 0l-6 0m13.2 5.2l-4.2-4.2m-2-2l-4.2-4.2"></path>
        </svg>
      ),
    }
    return icons[iconName] || null
  }

  return (
    <>
      {/* Backdrop */}
      <div className={`sidebar-backdrop ${isOpen ? "active" : ""}`} onClick={onClose} />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Navigation</h2>
          <button className="close-button" onClick={onClose} aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="nav-item" onClick={onClose}>
              <span className="nav-icon">{renderIcon(item.icon)}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
