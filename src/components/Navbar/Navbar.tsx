"use client";

import Link from "next/link";
import "./Navbar.css";

import { Ear } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [fontSize, setFontSize] = useState(100);

  const [contrast, setContrast] = useState(false);



  useEffect(() => {
    document.documentElement.style.fontSize =
      `${fontSize}%`;
  }, [fontSize]);

 

  useEffect(() => {
    if (contrast) {
      document.body.classList.add(
        "high-contrast"
      );
    } else {
      document.body.classList.remove(
        "high-contrast"
      );
    }
  }, [contrast]);



  function increaseFont() {
    if (fontSize < 130) {
      setFontSize(fontSize + 10);
    }
  }

  function decreaseFont() {
    if (fontSize > 80) {
      setFontSize(fontSize - 10);
    }
  }

  function toggleContrast() {
    setContrast(!contrast);
  }

  return (
    <header className="navbar-container">

      
      <div className="navbar-top">

        
        <button
          className="circle-button"
          onClick={toggleContrast}
        >
          <div className="contrast-circle">
            <div className="contrast-half"></div>
          </div>
        </button>

       
        <button
          className="circle-button text-button"
          onClick={increaseFont}
        >
          A+
        </button>

        
        <button
          className="circle-button text-button"
          onClick={decreaseFont}
        >
          A-
        </button>

        
        <button className="circle-button">
          <Ear size={22} />
        </button>

      </div>

     
      <div className="navbar-main">

        <Link href="/" className="logo-left">
          <img
            src="/imagens/logo-animal.png"
            alt="Logo Animal"
          />
        </Link>

        <a
          href="https://www.votorantim.sp.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="logo-right"
        >
          <img
            src="/imagens/logo-prefeitura.png"
            alt="Logo Prefeitura"
          />
        </a>

      </div>

    </header>
  );
}