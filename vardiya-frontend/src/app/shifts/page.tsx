'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

export interface Shift {
  id: number;
  user_id: number;
  department_id: number;
  start_time: string;
  end_time: string;
  break_minutes: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export default function ShiftsPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{[key: number]: string}>({});
  const [departments, setDepartments] = useState<{[key: number]: string}>({});

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch('/api/v1/shifts');
        if (!response.ok) {
          throw new Error('Vardiyalar yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setShifts(data);
      } catch (err) {
        setError('Vardiyalar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        console.error('Error fetching shifts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAdditionalData = async () => {
      try {
        // Kullanıcıları ve departmanları çek
        const [usersRes, deptsRes] = await Promise.all([
          fetch('/api/v1/users'),
          fetch('/api/v1/departments')
        ]);

        if (usersRes.ok && deptsRes.ok) {
          const [usersData, deptsData] = await Promise.all([
            usersRes.json(),
            deptsRes.json()
          ]);

          // Kullanıcı ve departman verilerini işle
          const usersMap: {[key: number]: string} = {};
          const deptsMap: {[key: number]: string} = {};

          usersData.forEach((user: any) => {
            if (user && user.id) {
              usersMap[user.id] = user.name || `Kullanıcı ${user.id}`;
            }
          });

          deptsData.forEach((dept: any) => {
            if (dept && dept.id) {
              deptsMap[dept.id] = dept.name || `Departman ${dept.id}`;
            }
          });

          setUsers(usersMap);
          setDepartments(deptsMap);
        }
      } catch (err) {
        console.error('Kullanıcı veya departman verileri yüklenirken hata:', err);
      }
    };

    Promise.all([fetchShifts(), fetchAdditionalData()]);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const getShiftType = (startTime: string) => {
    const hours = new Date(startTime).getHours();
    if (hours >= 6 && hours < 14) return 'Sabah';
    if (hours >= 14 && hours < 22) return 'Akşam';
    return 'Gece';
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Yükleniyor...</Typography>
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
              Vardiyalar
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/shifts/new')}
          >
            Yeni Vardiya Ekle
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
                  <TableCell>Tarih</TableCell>
                  <TableCell>Saat</TableCell>
                  <TableCell>Vardiya Tipi</TableCell>
                  <TableCell>Kullanıcı</TableCell>
                  <TableCell>Departman</TableCell>
                  <TableCell>Mola (dk)</TableCell>
                  <TableCell>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shifts.length > 0 ? (
                  shifts.map((shift) => (
                    <TableRow 
                      key={shift.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => router.push(`/shifts/${shift.id}`)}
                    >
                      <TableCell>{formatDate(shift.start_time)}</TableCell>
                      <TableCell>
                        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                      </TableCell>
                      <TableCell>{getShiftType(shift.start_time)}</TableCell>
                      <TableCell>{users[shift.user_id] || `Kullanıcı ${shift.user_id}`}</TableCell>
                      <TableCell>{departments[shift.department_id] || `Departman ${shift.department_id}`}</TableCell>
                      <TableCell>{shift.break_minutes}</TableCell>
                      <TableCell>
                        {shift.status === 0 ? (
                          <span style={{ color: '#f57c00' }}>Beklemede</span>
                        ) : shift.status === 1 ? (
                          <span style={{ color: '#2e7d32' }}>Onaylandı</span>
                        ) : (
                          <span style={{ color: '#d32f2f' }}>Reddedildi</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        {isLoading ? 'Yükleniyor...' : 'Henüz vardiya bulunmamaktadır.'}
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
