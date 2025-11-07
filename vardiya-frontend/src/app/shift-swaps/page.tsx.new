'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface ShiftSwapRequest {
  id: number;
  requester_id: number;
  requested_shift_id: number;
  target_user_id: number;
  status: number;
  note: string;
  created_at: string;
  updated_at: string;
  requester_name?: string;
  target_user_name?: string;
}

export default function ShiftSwapsPage() {
  const router = useRouter();
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/shift_swap_requests');
        if (!response.ok) {
          throw new Error('Vardiya değişim istekleri yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        
        // Kullanıcı isimlerini yükle
        const requestsWithNames = await Promise.all(
          data.map(async (request: ShiftSwapRequest) => {
            try {
              const [requester, targetUser] = await Promise.all([
                fetch(`/api/v1/users/${request.requester_id}`).then(res => res.json()),
                fetch(`/api/v1/users/${request.target_user_id}`).then(res => res.json())
              ]);
              return {
                ...request,
                requester_name: requester?.name || `Kullanıcı ${request.requester_id}`,
                target_user_name: targetUser?.name || `Kullanıcı ${request.target_user_id}`
              };
            } catch (err) {
              console.error('Kullanıcı bilgileri yüklenirken hata:', err);
              return {
                ...request,
                requester_name: `Kullanıcı ${request.requester_id}`,
                target_user_name: `Kullanıcı ${request.target_user_id}`
              };
            }
          })
        );
        
        setSwapRequests(requestsWithNames);
      } catch (err) {
        setError('Vardiya değişim istekleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        console.error('Error fetching shift swap requests:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusChip = (status: number) => {
    switch (status) {
      case 0:
        return <Chip label="Beklemede" color="warning" size="small" />;
      case 1:
        return <Chip label="Onaylandı" color="success" size="small" />;
      case 2:
        return <Chip label="Reddedildi" color="error" size="small" />;
      default:
        return <Chip label="Bilinmeyen" size="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => router.back()}
              sx={{ 
                color: 'primary.main',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { 
                  bgcolor: 'action.hover',
                  color: 'primary.dark' 
                },
                mr: 1
              }}
              title="Geri Dön"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Vardiya Değişim İstekleri
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/shift-swaps/new')}
          >
            Yeni İstek Oluştur
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>İstek Sahibi</TableCell>
                  <TableCell>Hedef Kullanıcı</TableCell>
                  <TableCell>Vardiya ID</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Not</TableCell>
                  <TableCell>Oluşturulma Tarihi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {swapRequests.length > 0 ? (
                  swapRequests.map((request) => (
                    <TableRow 
                      key={request.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => router.push(`/shift-swaps/${request.id}`)}
                    >
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.requester_name}</TableCell>
                      <TableCell>{request.target_user_name}</TableCell>
                      <TableCell>{request.requested_shift_id}</TableCell>
                      <TableCell>{getStatusChip(request.status)}</TableCell>
                      <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {request.note || '-'}
                      </TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        Henüz vardiya değişim isteği bulunmamaktadır.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}
