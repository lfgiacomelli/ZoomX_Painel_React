import { useEffect, useState } from "react";

type AnunciosProps = {
    anu_codigo: number;
    anu_titulo: string;
    anu_descricao: string;
    anu_foto: string;
};

export default function Announcements() {
    const [anuncios, setAnuncios] = useState<AnunciosProps[]>([]);
    const BASE_URL = "http://192.168.0.22:3000";

    async function fetchData() {
        try {
            const response = await fetch(`${BASE_URL}/api/anuncios`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar anúncios");
            }
            const data = await response.json();
            setAnuncios(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (anuncios.length === 0) {
        return <p className="text-center text-gray-500">Carregando anúncios...</p>;
    }

    return (
        <div className="overflow-hidden py-6 group relative w-full">
            <div
                className="flex whitespace-nowrap gap-6 animate-scroll group-hover:animation-paused"
                style={{ animationDuration: "20s" }} 
            >
                {anuncios.concat(anuncios).map((item, index) => (
                    <div
                        key={`${item.anu_codigo}-${index}`}
                        className="min-w-[300px] max-w-sm bg-white rounded-lg shadow-md p-4"
                    >
                        <img
                            src={item.anu_foto}
                            alt={item.anu_titulo}
                            className="w-full h-40 object-cover rounded-md mb-2"
                        />
                        <h3 className="text-lg font-semibold">{item.anu_titulo}</h3>
                        <p className="text-sm text-gray-600">
                            {item.anu_descricao.length > 20
                                ? `${item.anu_descricao.substring(0, 37)}...`
                                : item.anu_descricao}
                        </p>
                    </div>
                ))}
            </div>
        </div>

    );
}
