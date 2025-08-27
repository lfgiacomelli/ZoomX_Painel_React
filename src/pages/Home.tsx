import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Bike,
  MapPin,
  Clock,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import mockup from '../assets/mockup_app.png';
import HomeHeader from '@/components/layout/HomeHeader';
import WorkWithUs  from '@/components/layout/WorkWithUs';
import Footer from '@/components/layout/AppFooter';

export default function Home() {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: <Bike className="w-8 h-8" />,
      title: "Gestão de Corridas",
      description: "Organize solicitações de mototáxi e entregas de forma inteligente e integrada."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Notificações em Tempo Real",
      description: "Acompanhe os serviços com precisão e segurança através de notificações em tempo real."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Eficiência e Rapidez",
      description: "Agilidade no atendimento com confirmação instantânea de corridas e entregas."
    }
  ];

  const stats = [
    { value: "99.9%", label: "Disponibilidade" },
    { value: "+5 mil", label: "Corridas registradas" },
    { value: "24/7", label: "Painel disponível" },
    { value: "+3x", label: "Mais eficiência" }
  ];

  const handleAccessPanel = () => navigate('/login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] text-gray-900 font-['Righteous'] overflow-hidden">
      <HomeHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent z-10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36 relative z-20">
          <div className="grid lg:grid-cols-2 items-center gap-12 xl:gap-24">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, x: -40 }}
              animate={heroInView ? {
                opacity: 1, x: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              } : {}}
              className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? {
                  opacity: 1, y: 0,
                  transition: { delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                } : {}}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4"
              >
                <Zap className="w-4 h-4 mr-2" /> Sistema exclusivo de PV
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? {
                  opacity: 1, y: 0,
                  transition: { delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                } : {}}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              >
                <span className="block">Transformando a mobilidade de</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Presidente Venceslau</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={heroInView ? {
                  opacity: 1,
                  transition: { delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                } : {}}
                className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                O ZoomX é um sistema exclusivo para uma única empresa de mototáxi e entregas urbanas de Presidente Venceslau, trazendo mais eficiência, controle e agilidade.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? {
                  opacity: 1, y: 0,
                  transition: { delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                } : {}}
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4"
              >
                <Button onClick={handleAccessPanel} className="px-8 py-5 text-lg font-medium rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <span className="mr-3">ACESSAR PAINEL</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1, transition: { delay: 0.8, duration: 0.8 } } : {}}
                className="pt-8 flex flex-col items-center lg:items-start gap-4"
              >
                <div className="flex items-center gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (<Star key={i} filled={true} />))}
                  <span className="text-gray-600 text-sm">Avaliação máxima dos usuários locais</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-5 h-5" />
                  <span>Desenvolvido em Presidente Venceslau</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={heroInView ? {
                opacity: 1,
                scale: 1,
                transition: { delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              } : {}}
              className="relative order-1 lg:order-2"
            >
              <div className="relative w-full h-auto max-w-4xl mx-auto lg:mx-0">
                <motion.img
                  src={mockup}
                  alt="Painel exclusivo ZoomX"
                  className="relative w-full h-full object-contain transform transition-transform duration-500 hover:scale-[1.02] z-10"
                  loading="eager"
                  initial={{ y: 20 }}
                  animate={heroInView ? {
                    y: 0,
                    transition: { delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  } : {}}
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Tudo que sua empresa precisa</h2>
            <p className="text-lg text-gray-600">
              Profissionalize o atendimento e otimize suas corridas com uma plataforma completa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.6 } }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-gray-50 rounded-xl p-8 hover:bg-white transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <WorkWithUs />
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.6 } }}
                viewport={{ once: true }}
                className="p-6"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Modernize agora seu serviço de mototáxi</h2>
            <p className="text-lg text-gray-600 mb-8">
              Com o ZoomX, sua empresa de mototáxi e entregas em Presidente Venceslau terá uma gestão mais profissional, moderna e eficiente.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Destaque sua empresa no mercado com o ZoomX
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={handleAccessPanel} className="px-8 py-5 text-lg font-medium rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 shadow-lg hover:shadow-xl group">
                <span className="mr-3">COMEÇAR AGORA</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="px-8 py-5 text-lg font-medium rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-100 transition-all duration-300">
                FALAR COM VENDAS
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
