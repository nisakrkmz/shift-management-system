'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';

export default function NewShiftSwapPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{id: number, name: string}[]>([]);
  const [shifts, setShifts] = useState<{id: number, start_time: string, end_time: string}[]>([]);

  const [formData, setFormData] = useState({
    requested_shift_id: '',
    target_user_id: '',
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users and shifts in parallel
        const [usersResponse, shiftsResponse] = await Promise.all([
          fetch('/api/v1/users'),
          fetch('/api/v1/shifts')
        ]);

        if (!usersResponse.ok || !shiftsResponse.ok) {
          throw new Error('Veriler yüklenirken bir hata oluştu');
        }

        const [usersData, shiftsData] = await Promise.all([
          usersResponse.json(),
          shiftsResponse.json()
        ]);

        setUsers(usersData);
        setShifts(shiftsData);
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Form validation
    if (!formData.requested_shift_id || !formData.target_user_id) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/v1/shift_swap_requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shift_swap_request: {
            ...formData,
            requested_shift_id: parseInt(formData.requested_shift_id as string),
            target_user_id: parseInt(formData.target_user_id as string),
            status: 0 // Default status for new request
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'İstek oluşturulurken bir hata oluştu');
      }

      // Redirect to shift swaps list on success
      router.push('/shift-swaps');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      console.error('Error creating shift swap request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatShiftTime = (shift: {start_time: string, end_time: string}) => {
    const start = new Date(shift.start_time);
    const end = new Date(shift.end_time);
    
    return `${start.toLocaleDateString('tr-TR')} ${start.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}`;
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
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
            Yeni Vardiya Değişim İsteği
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <FormControl fullWidth required>
                <InputLabel>Vardiya Seçin</InputLabel>
                <Select
                  name="requested_shift_id"
                  value={formData.requested_shift_id}
                  onChange={handleChange}
                  label="Vardiya Seçin"
                >
                  <MenuItem value="">
                    <em>Vardiya Seçiniz</em>
                  </MenuItem>
                  {shifts.map((shift) => (
                    <MenuItem key={shift.id} value={shift.id}>
                      {`Vardiya #${shift.id} - ${formatShiftTime(shift)}`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Değiştirmek istediğiniz vardiyayı seçin</FormHelperText>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Hedef Kullanıcı</InputLabel>
                <Select
                  name="target_user_id"
                  value={formData.target_user_id}
                  onChange={handleChange}
                  label="Hedef Kullanıcı"
                >
                  <MenuItem value="">
                    <em>Kullanıcı Seçiniz</em>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Vardiyasını değiştirmek istediğiniz kişiyi seçin</FormHelperText>
              </FormControl>

              <TextField
                label="Not (İsteğe Bağlı)"
                name="note"
                value={formData.note}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                placeholder="Vardiya değişim isteğinizle ilgili bir not ekleyebilirsiniz..."
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  İptal
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
