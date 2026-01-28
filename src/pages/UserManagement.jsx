import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import UserTable from '../components/users/UserTable';
import UserModal from '../components/users/UserModal';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import api from '../utils/api';
import notifications from '../utils/notifications';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await notifications.confirm(
      'Hapus User?',
      'Apakah Anda yakin ingin menghapus user ini?'
    );

    if (confirmed) {
      try {
        await api.delete(`/users/${id}`);
        notifications.success('User berhasil dihapus');
        fetchUsers();
      } catch (error) {
        notifications.error(error.response?.data?.message || 'Gagal menghapus user');
      }
    }
  };

  const handleSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setIsModalOpen(false);
      notifications.success(selectedUser ? 'User berhasil diperbarui' : 'User berhasil ditambahkan');
      fetchUsers();
    } catch (error) {
      notifications.error(error.response?.data?.message || 'Operasi gagal');
    } finally {
      setModalLoading(false);
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'none' }}></div>
        <Button onClick={handleCreate} icon={Plus}>
          Tambah User
        </Button>
      </div>

      <Card>
        <UserTable 
          users={users} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          loading={loading} 
        />
      </Card>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        loading={modalLoading}
      />
    </div>
  );
};

export default UserManagement;
