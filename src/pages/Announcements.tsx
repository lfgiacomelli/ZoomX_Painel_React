import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Pagination } from '../components/ui/pagination';
import { Loading } from '@/components/ui/loading';
import { useNavigate } from 'react-router-dom';

import emptyAnuncios from '../assets/empty.png'
import ToastMessage from '@/components/layout/ToastMessage';
import { handleAuthError } from '@/utils/handleAuthError';

const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const BASE_URL = 'https://backend-turma-a-2025.onrender.com';
  const [isLoading, setIsLoading] = useState(true);
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
  }>({
    visible: false,
    message: "",
    status: "INFO",
  });
  const [formData, setFormData] = useState({
    anu_titulo: '',
    anu_descricao: '',
    anu_foto: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/admin/anuncios`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          }
        }
      );
      if (handleAuthError(response, setToast, navigate)) return;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnuncios(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setToast({
        visible: true,
        message: 'Falha ao carregar os anúncios. Por favor, tente novamente mais tarde.',
        status: 'ERROR',
      });
    }
    finally {
      setIsLoading(false);
    }
  }

  const itemsPerPage = 6;
  const totalPages = Math.ceil(anuncios.length / itemsPerPage);
  const paginatedAnnouncements = anuncios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setFormData({
      anu_titulo: announcement.anu_titulo,
      anu_descricao: announcement.anu_descricao,
      anu_foto: announcement.anu_foto || '',
    });
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingAnnouncement(null);
    setFormData({
      anu_titulo: '',
      anu_descricao: '',
      anu_foto: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Você tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.')) {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/anuncios/excluir/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensagem || 'Não foi possível excluir o anúncio');
        }

        const data = await response.json();
        setToast({
          visible: true,
          message: data.mensagem || 'Anúncio excluído com sucesso!',
          status: 'SUCCESS',
        });
        fetchAnnouncements();
      } catch (error: any) {
        console.error('Error deleting announcement:', error);
        setToast({
          visible: true,
          message: error.message || 'Não foi possível excluir o anúncio.',
          status: 'ERROR',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const payload = {
      titulo: formData.anu_titulo,
      descricao: formData.anu_descricao,
      foto: formData.anu_foto,

    };

    try {
      let response;
      if (editingAnnouncement) {
        response = await fetch(`${BASE_URL}/api/admin/anuncios/editar/${editingAnnouncement.anu_codigo}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${BASE_URL}/api/admin/anuncios/adicionar/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Failed to save announcement.');
      }

      const data = await response.json();
      setToast({
        visible: true,
        message: data.mensagem || 'Anúncio salvo com sucesso!',
        status: 'SUCCESS',
      });
      setIsModalOpen(false);
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      setToast({
        visible: true,
        message: error.message || 'Falha ao salvar anúncio. Tente novamente.',
        status: 'ERROR',
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  if (anuncios.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-righteous text-black">Anúncios</h1>
        <img src={emptyAnuncios} alt='sem anúncios' className="w-90 h-90 mx-auto" />
        <p className="text-center" style={{ fontSize: '1.25rem' }}>Nenhum anúncio encontrado.</p>
        <div className="flex justify-center">
          <Button className="zoomx-button mt-4" onClick={handleNew}>
            <Plus className="w-4 h-4 mr-2" />
            Novo anúncio
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-righteous">
                {editingAnnouncement ? 'Editar anúncio' : 'Novo anúncio'}
              </DialogTitle>
              <DialogDescription>
                Por favor, preencha os detalhes do anúncio.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  className="zoomx-input"
                  value={formData.anu_titulo}
                  onChange={(e) => handleInputChange('anu_titulo', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  className="zoomx-input min-h-24"
                  value={formData.anu_descricao}
                  onChange={(e) => handleInputChange('anu_descricao', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL da imagem</label>
                <Input
                  type="url"
                  className="zoomx-input"
                  value={formData.anu_foto}
                  onChange={(e) => handleInputChange('anu_foto', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.anu_foto && (
                  <div className="mt-2">
                    <img
                      src={formData.anu_foto}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="zoomx-button">
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-righteous text-black">Anúncios</h1>
            <Button className="zoomx-button" onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" />
              Novo anúncio
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAnnouncements.map((announcement) => (
              <Card key={announcement.anu_codigo} className="zoomx-card overflow-hidden">
                {announcement.anu_foto && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={announcement.anu_foto}
                      alt={announcement.anu_titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-righteous text-lg">
                      {announcement.anu_titulo || 'Sem título'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-sm">
                    {announcement.anu_descricao || 'Sem descrição'}
                  </CardDescription>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(announcement)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(announcement.anu_codigo)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-righteous">
              {editingAnnouncement ? 'Editar anúncio' : 'Novo anúncio'}
            </DialogTitle>
            <DialogDescription>
              Por favor, preencha os detalhes do anúncio.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input
                className="zoomx-input"
                value={formData.anu_titulo}
                onChange={(e) => handleInputChange('anu_titulo', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                className="zoomx-input min-h-24"
                value={formData.anu_descricao}
                onChange={(e) => handleInputChange('anu_descricao', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL da imagem</label>
              <Input
                type="url"
                className="zoomx-input"
                value={formData.anu_foto}
                onChange={(e) => handleInputChange('anu_foto', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {formData.anu_foto && (
                <div className="mt-2">
                  <img
                    src={formData.anu_foto}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="zoomx-button">
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

};

export default Announcements;