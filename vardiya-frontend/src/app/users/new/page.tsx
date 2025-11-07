'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type UserRole = 'admin' | 'yönetici' | 'çalışan';

interface Department {
  id: number;
  name: string;
}


export default function NewUserPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department_id: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: formData.name,
            email: formData.email,
            department_id: formData.department_id
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kullanıcı oluşturulurken bir hata oluştu');
      }

      // Redirect to users list on success
      router.push('/users');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      console.error('Error creating user:', error);
    }
  };

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/v1/departments');
        if (!response.ok) {
          throw new Error('Departmanlar yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setDepartments(data);
        setIsLoading(false);
      } catch (err) {
        setError('Departmanlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        console.error('Error fetching departments:', err);
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

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
            Yeni Kullanıcı Ekle
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <TextField
                  label="Ad Soyad"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                />
                
                <TextField
                  label="E-posta"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                />
                
                
                <FormControl fullWidth margin="normal" required>
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
                
                
              </Box>
              
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => router.push('/users')}
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
