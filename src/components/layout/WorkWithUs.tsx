import { useState, useEffect } from 'react';
import facaParteDoTime from '../../assets/faca_parte_do_time.png';
import trabalheConosco from '../../assets/trabalhe_no_zoomx.png';

export default function WorkWithUs() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [facaParteDoTime, trabalheConosco];
  const slideTexts = [
    {
      title: "Ganhos Diários",
      description: "Trabalhe com liberdade e receba seus ganhos todos os dias, de forma rápida e prática."
    },
    {
      title: "Flexibilidade Total",
      description: "Você escolhe quando e onde quer trabalhar, adaptando sua rotina ao seu estilo de vida."
    },
    {
      title: "Segurança e Suporte",
      description: "Conte com nossa tecnologia para corridas seguras e um time de suporte sempre pronto para te ajudar."
    },
    {
      title: "Seja Seu Próprio Chefe",
      description: "Assuma o controle da sua renda e tenha a autonomia de decidir o ritmo do seu trabalho."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Trabalhe como Mototaxista no ZoomX</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Junte-se à maior plataforma de mobilidade urbana e conquiste sua independência financeira
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Slider de imagens */}
          <div className="w-full lg:w-1/2 relative overflow-hidden rounded-xl shadow-lg">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="min-w-full h-96 bg-gray-200">
                  <img
                    src={image}
                    alt={`ZoomX mototaxi ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Textos em colunas */}
          <div className="w-full lg:w-1/2">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Vantagens de ser Mototaxista no ZoomX
              </h3>

              <div className="mb-12">
                <h4 className="text-xl font-medium text-gray-800 mb-2">
                  {slideTexts[currentImageIndex].title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {slideTexts[currentImageIndex].description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Como funciona:</h4>
                  <p className="text-gray-600">
                    O cadastro deve ser feito presencialmente em uma unidade oficial contratante do ZoomX,
                    onde nossa equipe validará seus documentos e esclarecerá possíveis dúvidas.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Como fazer parte:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600">
                    <li>Realize seu cadastro presencialmente em uma unidade oficial contratante do ZoomX.</li>
                    <li>Envie os dados da sua moto e documentação necessária no ato do cadastro.</li>
                    <li>Comece a receber corridas!</li>
                  </ol>
                </div>


                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Requisitos:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>CNH categoria A válida</li>
                    <li>Moto a partir de 2012</li>
                    <li>Documentação em dia</li>
                    <li>Capacete e itens de segurança</li>
                    <li>Cadastro aprovado na ZoomX</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
