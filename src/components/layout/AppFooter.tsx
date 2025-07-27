export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4 font-righteous">ZoomX</h2>
            <p className="text-sm text-gray-400">
              Plataforma de gestão de serviços de moto táxi e entregas urbanas.
              Inovação, rapidez e segurança para cidades inteligentes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 font-righteous">Links úteis</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition">Início</a></li>
              <li><a href="/conta" className="hover:text-white transition">Minha Conta</a></li>
              <li><a href="/suporte" className="hover:text-white transition">Suporte</a></li>
              <li><a href="/politica-privacidade" className="hover:text-white transition">Privacidade</a></li>
              <li><a href="/termos" className="hover:text-white transition">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 font-righteous">Contato</h2>
            <p className="text-sm text-gray-400">E-mail: contato@zoomx.com</p>
            <p className="text-sm text-gray-400">Telefone: (11) 99999-0000</p>
            <p className="text-sm text-gray-400 mt-2">Endereço: Rua das Entregas, 123 - São Paulo, SP</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} <span className="font-medium">ZoomX</span>. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
