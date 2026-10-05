"use client";

import "./Titulo.css";

interface TituloProps {
    titulo:string;
    descricao: string;
}

export default function Titulo(props: TituloProps) {
    return(
        <div className="titulo-container">
            <h1>{props.titulo}</h1>
            <p>{props.descricao}</p>
        </div>
    )


}