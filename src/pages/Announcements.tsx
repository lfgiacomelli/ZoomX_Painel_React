
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Pagination } from '../components/ui/pagination';

// Dados de exemplo
const mockAnnouncements = [
  { 
    id: '1', 
    title: 'Promoção de Verão', 
    description: 'Desconto de 20% em todas as corridas durante o mês de janeiro!', 
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop', 
    active: true, 
    createdAt: '2024-01-15', 
    updatedAt: '2024-01-15' 
  },
  { 
    id: '2', 
    title: 'Novo Serviço de Entregas Express', 
    description: 'Agora oferecemos entregas em até 30 minutos para sua comodidade.', 
    imageUrl: null, 
    active: true, 
    createdAt: '2024-02-01', 
    updatedAt: '2024-02-01' 
  },
  { 
    id: '3', 
    title: 'Manutenção Programada', 
    description: 'O sistema ficará indisponível no domingo das 2h às 4h para manutenção.', 
    imageUrl: null, 
    active: false, 
    createdAt: '2024-02-10', 
    updatedAt: '2024-02-15' 
  },
];

const Announcements: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    active: true,
  });
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil(mockAnnouncements.length / itemsPerPage);
  const paginatedAnnouncements = mockAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      imageUrl: announcement.imageUrl || '',
      active: announcement.active,
    });
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (announcementId: string) => {
    if (confirm('Tem certeza que deseja excluir este anúncio?')) {
      console.log('Excluindo anúncio:', announcementId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando anúncio:', formData);
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-righteous text-black">Anúncios</h1>
        <Button className="zoomx-button" onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Anúncio
        </Button>
      </div>

      {/* Grid de Anúncios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="zoomx-card overflow-hidden">
            {announcement.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={announcement.imageUrl} 
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="font-righteous text-lg">
                  {announcement.title}
                </CardTitle>
                <Badge className={announcement.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {announcement.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-sm">
                {announcement.description}
              </CardDescription>
              <div className="text-xs text-gray-500 mb-4">
                Criado em {new Date(announcement.createdAt).toLocaleDateString('pt-BR')}
                {announcement.updatedAt !== announcement.createdAt && (
                  <span> • Atualizado em {new Date(announcement.updatedAt).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
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
                  onClick={() => handleDelete(announcement.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal de Criação/Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-righteous">
              {editingAnnouncement ? 'Editar Anúncio' : 'Novo Anúncio'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do anúncio abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input 
                className="zoomx-input" 
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea 
                className="zoomx-input min-h-24" 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL da Imagem (opcional)</label>
              <Input 
                type="url"
                className="zoomx-input" 
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange('active', checked)}
              />
              <label className="text-sm font-medium">
                Anúncio ativo (visível para os usuários)
              </label>
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
