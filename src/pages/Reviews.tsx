import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Pagination } from '../components/ui/pagination';
import { Loading } from '../components/ui/loading';
import { Star } from 'lucide-react';
import ToastMessage from '@/components/layout/ToastMessage';
import { handleAuthError } from '@/utils/handleAuthError';
import { useNavigate } from 'react-router-dom';
import { ToastProps } from '@/types/toast';


interface Review {
  ava_codigo: number;
  usu_codigo: number;
  via_codigo: number;
  ava_nota: number;
  ava_comentario: string | null;
  ava_data_avaliacao: string;
  usu_nome?: string;
  via_origem?: string;
  via_destino?: string;
}

const Reviews: React.FC = () => {
  const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [minRatingFilter, setMinRatingFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


  const itemsPerPage = 10;


  async function fetchReviewsData() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/avaliacoes`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          }
        }
      );
      if (handleAuthError(response, setToast, navigate)) return;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar avaliações');
      }
      const data: Review[] = await response.json();
      setReviews(data);
    } catch (error: any) {
      console.error('Erro ao buscar avaliações:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao buscar avaliações',
        status: 'ERROR',
      })
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviewsData();
  }, []);


  const filteredReviews = reviews.filter((review) => {
    const matchesRating =
      minRatingFilter === 'all' || review.ava_nota >= parseInt(minRatingFilter);

    const matchesSearch =
      searchFilter === '' ||
      (review.ava_comentario && review.ava_comentario.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (review.usu_nome && review.usu_nome.toLowerCase().includes(searchFilter.toLowerCase())) ||
      String(review.usu_codigo).includes(searchFilter);

    return matchesRating && matchesSearch;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-6">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
      <div className="items-center mb-6 flex-col">
        <h1 className="text-3xl font-righteous text-black">Avaliações</h1>
        <p className="text-gray-600">As avaliações estão disponíveis apenas para visualização, não é possível excluir ou editar.</p>
      </div>


      <Card className="zoomx-card mb-6">
        <CardHeader>
          <CardTitle className="font-righteous">Filtros</CardTitle>
          <CardDescription>Filtre as avaliações buscando pelo comentário, usuário ou ID do usuário.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Pesquisar</label>
              <Input
                placeholder="Comentário, Usuário ou ID do Usuário..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="zoomx-input"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setMinRatingFilter('all');
                  setSearchFilter('');
                  setCurrentPage(1);
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      ---

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Lista de Avaliações</CardTitle>
          <CardDescription>
            {filteredReviews.length} avaliação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loading text='Carregando avaliações...' />
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500 py-4">Nenhuma avaliação encontrada.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-left border-b border-gray-200">
                      <th className="px-4 py-2 font-righteous">Nota</th>
                      <th className="px-4 py-2 font-righteous">Comentário</th>
                      <th className="px-4 py-2 font-righteous">Usuário</th>
                      <th className="px-4 py-2 font-righteous">Viagem (Código)</th>
                      <th className="px-4 py-2 font-righteous">Data da Avaliação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReviews.map((review) => (
                      <tr key={review.ava_codigo} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2">{renderStars(review.ava_nota)}</td>
                        <td className="px-4 py-2 max-w-xs truncate">
                          {review.ava_comentario || 'Sem comentário'}
                        </td>
                        <td className="px-4 py-2">
                          {review.usu_nome ? `${review.usu_nome} (ID: ${review.usu_codigo})` : `Usuário ID: ${review.usu_codigo}`}
                        </td>
                        <td className="px-4 py-2">
                          {review.via_origem && review.via_destino
                            ? `${review.via_origem} para ${review.via_destino} (ID: ${review.via_codigo})`
                            : `Viagem ID: ${review.via_codigo}`}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(review.ava_data_avaliacao).toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;