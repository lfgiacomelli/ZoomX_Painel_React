import { useState } from 'react';
import { Mail, Check, Settings, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmailHeader from '@/components/layout/EmailHeader';
import ToastMessage from '@/components/layout/ToastMessage';
import { ToastProps } from '@/types/toast';

export default function Email() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        company: '',
        address_company: '',
        address_number: '',
        bairro: '',
        cep: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${BASE_URL}/api/email/contratacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsSuccess(true);
                setToast({
                    visible: true,
                    message: data.message || 'E-mail enviado com sucesso!',
                    status: 'SUCCESS',
                });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    company: '',
                    address_company: '',
                    address_number: '',
                    bairro: '',
                    cep: ''
                });
            } else {
                setToast({
                    visible: true,
                    message: data.error || 'Erro ao enviar o e-mail. Tente novamente.',
                    status: 'ERROR',
                });
            }
        } catch (error) {
            setToast({
                visible: true,
                message: 'Erro ao enviar e-mail: ' + error.message,
                status: 'ERROR',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {toast.visible && (
                <ToastMessage
                    message={toast.message}
                    status={toast.status}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
            <EmailHeader />
            <div className="max-w-6xl mx-auto p-16">
                <div className="text-center mb-20">
                    <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3">
                        <span className="block">Soluções para</span>
                        <span className="font-medium">Gestão de Mototáxi</span>
                    </h1>
                    <div className="w-20 h-1 bg-blue-500 mx-auto mt-4"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        Contrate o ZoomX e transforme a mobilidade de mototáxi em Presidente Venceslau com uma plataforma completa e profissional.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 mb-20">
                    <div className="lg:w-1/2 space-y-10">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
                            <div className="flex items-start mb-5">
                                <div className="bg-blue-50 p-2 rounded-lg mr-4">
                                    <Settings className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 mb-2">Para Empresas</h2>
                                    <p className="text-gray-600">
                                        Controle completo da sua frota com ferramentas profissionais
                                    </p>
                                </div>
                            </div>
                            <ul className="space-y-3 pl-2">
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Monitoramento em tempo real das solicitações</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Relatórios financeiros detalhados</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Funcionalidades de banimento de usuários</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Gestão de mototaxistas e motocicletas</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Controle de anúncios dentro do aplicativo</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Controle de e-mails de verificação de conta</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Avisos de clima em tempo real para Presidente Venceslau</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Tarifas dinâmicas baseadas no horário</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
                            <div className="flex items-start mb-5">
                                <div className="bg-purple-50 p-2 rounded-lg mr-4">
                                    <User className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 mb-2">Para Usuários</h2>
                                    <p className="text-gray-600">
                                        Experiência premium para passageiros de mototáxi
                                    </p>
                                </div>
                            </div>
                            <ul className="space-y-3 pl-2">
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Solicitação rápida de corridas</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Rotas calculadas automaticamente</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Pagamentos via PIX</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Notificações em tempo real baseadas no sistema de gestão</span>
                                </li>

                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Interface intuitiva e fácil de usar</span>
                                </li>

                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Usabilidade e agilidade aplicada no aplicativo móvel</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Cadastro de endereços favoritos</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Histórico com gerador de recibos para cada viagem</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Sistema de avaliação para feedback de usuários</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">E-mails automáticos baseados no uso do aplicativo</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="bg-white p-8 sm:p-10 rounded-lg shadow-sm border border-gray-200">
                            <div className="mb-8">
                                <div className="flex items-center mb-3">
                                    <Mail className="w-6 h-6 text-blue-600 mr-2" />
                                    <h2 className="text-2xl font-medium text-gray-900">Fale conosco</h2>
                                </div>
                                <p className="text-gray-600">
                                    Quer saber como o ZoomX pode atender sua empresa? Solicite uma demonstração e fale com um de nossos especialistas.
                                </p>
                            </div>

                            {isSuccess ? (
                                <div className="text-center py-10">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 mb-4">
                                        <Check className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Mensagem enviada</h3>
                                    <p className="text-gray-600 mb-6">
                                        Nossa equipe entrará em contato em breve.
                                    </p>
                                    <Button
                                        onClick={() => setIsSuccess(false)}
                                        variant="outline"
                                        className="border-gray-300"
                                    >
                                        Enviar nova mensagem
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Nome completo *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Insira seu nome completo"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Insira o email da empresa"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Telefone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="(00) 00000-0000"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                                            Empresa/Cooperativa
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            placeholder="Insira o nome fantasia da empresa"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="address_company" className="block text-sm font-medium text-gray-700">
                                            Endereço da empresa
                                        </label>
                                        <input
                                            type="text"
                                            id="address_company"
                                            name="address_company"
                                            placeholder="Insira aqui a rua da empresa"
                                            value={formData.address_company}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="address_number" className="block text-sm font-medium text-gray-700">
                                                Número *
                                            </label>
                                            <input
                                                type="number"
                                                id="address_number"
                                                name="address_number"
                                                placeholder="Número do endereço da empresa"
                                                required
                                                value={formData.address_number}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                                                Bairro *
                                            </label>
                                            <input
                                                type="text"
                                                id="bairro"
                                                name="bairro"
                                                placeholder="Insira aqui o bairro da empresa"
                                                required
                                                value={formData.bairro}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                                            CEP da Empresa
                                        </label>
                                        <input
                                            type="text"
                                            id="cep"
                                            name="cep"
                                            placeholder="00000-000"
                                            value={formData.cep}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                            Mensagem *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Queremos entender suas necessidades! Fale sobre sua empresa e como podemos apoiar sua operação com o ZoomX."
                                        ></textarea>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full mb-2 py-3 px-6 font-medium rounded-md bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200 flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                'Enviando...'
                                            ) : (
                                                <>
                                                    <span>ENVIAR E-MAIL</span>
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
