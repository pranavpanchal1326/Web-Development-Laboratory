import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import authService from '../features/auth/authService';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import Spinner from '../components/Spinner';

const socket = io('http://localhost:5000');

function getRoleColor(role) {
  if (role === 'admin') return 'secondary';
  if (role === 'staff') return 'primary';
  return 'default';
}

function getStatusColor(status) {
  if (status === 'active') return 'success';
  if (status === 'inactive') return 'default';
  if (status === 'pending') return 'warning';
  return 'default';
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  return parts.map(p => p[0]).join('').toUpperCase();
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial list of users
    const fetchUsers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const data = await authService.getAllUsers(user.token);
        setUsers(data);
        setIsLoading(false);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Failed to fetch users');
        setIsLoading(false);
      }
    };
    fetchUsers();

    // Listen for real-time new users
    socket.on('newUser', (newUser) => {
      toast.info(`New user registered: ${newUser.name}`);
      setUsers(prev => [...prev, newUser]);
    });

    // Cleanup
    return () => {
      socket.off('newUser');
    };
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={800}>
          User Management
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: theme => theme.palette.grey[100] }}>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.avatar} alt={user.name}>
                        {getInitials(user.name)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{user.name}</Typography>
                        {user.department && (
                          <Typography variant="caption" color="text.secondary">
                            {user.department}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`Email: ${user.email}`}>
                      <Typography variant="body2">{user.email}</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      variant="outlined"
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status ? user.status : 'unknown'}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Real-time updates enabled. New users will appear instantly.
        </Typography>
      </Box>
    </Container>
  );
}

export default UserManagement;
