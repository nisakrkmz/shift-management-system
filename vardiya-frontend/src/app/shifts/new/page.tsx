'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  FormHelperText
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NewShiftPage() {
  const router = useRouter();
  const [users, setUsers] = useState<{id: number, name: string}[]>([]);
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    user_id: '',
    department_id: '',
    start_time: new Date(),
    end_time: new Date(new Date().setHours(new Date().getHours() + 8)),
    break_minutes: 30
  });

  // Fetch users and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, deptsResponse] = await Promise.all([
          fetch('/api/v1/users'),
          fetch('/api/v1/departments')
        ]);

        if (!usersResponse.ok || !deptsResponse.ok) {
          throw new Error('Veriler yüklenirken bir hata oluştu');
        }

        const [usersData, deptsData] = await Promise.all([
          usersResponse.json(),
          deptsResponse.json()
        ]);

        setUsers(usersData);
        setDepartments(deptsData);
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

  const handleTimeChange = (name: string, date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: date
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.user_id || !formData.department_id || !formData.start_time || !formData.end_time) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }

    if (formData.start_time >= formData.end_time) {
      setError('Bitiş saati başlangıç saatinden sonra olmalıdır');
      return;
    }

    try {
      // Format dates to ISO string without timezone offset
      const formatDate = (date: Date) => {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
      };

      const response = await fetch('/api/v1/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shift: {
            user_id: parseInt(formData.user_id as string),
            department_id: parseInt(formData.department_id as string),
            start_time: formatDate(formData.start_time),
            end_time: formatDate(formData.end_time),
            break_minutes: parseInt(formData.break_minutes as unknown as string) || 0,
            status: 0 // Default status
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Vardiya oluşturulurken bir hata oluştu');
      }

      // Redirect to shifts list on success
      router.push('/shifts');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      console.error('Error creating shift:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Yükleniyor...</Typography>
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
            Yeni Vardiya Ekle
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
                <InputLabel>Kullanıcı</InputLabel>
                <Select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  label="Kullanıcı"
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
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Departman</InputLabel>
                <Select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  label="Departman"
                >
                  <MenuItem value="">
                    <em>Departman Seçiniz</em>
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Başlangıç Zamanı"
                  value={formData.start_time}
                  onChange={(date) => handleTimeChange('start_time', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />

                <DateTimePicker
                  label="Bitiş Zamanı"
                  value={formData.end_time}
                  onChange={(date) => handleTimeChange('end_time', date)}
                  minDateTime={formData.start_time}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      sx: { mt: 2 }
                    },
                  }}
                />
              </LocalizationProvider>

              <TextField
                label="Mola Süresi (Dakika)"
                name="break_minutes"
                type="number"
                value={formData.break_minutes}
                onChange={handleChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, max: 240 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => router.back()}
                >
                  İptal
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                >
                  Kaydet
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
